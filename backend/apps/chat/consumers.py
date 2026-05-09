import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Conversation, Message
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'
        self.user = self.scope["user"]

        print(f"Connecting to chat {self.conversation_id} as user: {self.user}")

        if not self.user.is_authenticated:
            print("User not authenticated, closing connection")
            await self.close()
            return

        # Check if user is part of the conversation
        if not await self.is_participant():
            print(f"User {self.user.username} is not a participant in conversation {self.conversation_id}")
            await self.close()
            return

        print(f"User {self.user.username} connected successfully to conversation {self.conversation_id}")
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_text = data.get('message')

        if not message_text:
            return

        # Save message to DB
        message_obj = await self.save_message(message_text)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message_text,
                'sender_id': self.user.id,
                'sender_username': self.user.username,
                'timestamp': str(message_obj.timestamp),
                'id': message_obj.id
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender_id': event['sender_id'],
            'sender_username': event['sender_username'],
            'timestamp': event['timestamp'],
            'id': event['id']
        }))

    @database_sync_to_async
    def is_participant(self):
        return Conversation.objects.filter(id=self.conversation_id, participants=self.user).exists()

    @database_sync_to_async
    def save_message(self, text):
        conversation = Conversation.objects.get(id=self.conversation_id)
        return Message.objects.create(
            conversation=conversation,
            sender=self.user,
            text=text
        )
