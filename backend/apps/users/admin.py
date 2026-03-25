from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Profile, CustomUser

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_staff')
    ordering = ('email',)

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'is_verified', 'followers_count')
    search_fields = ('user__email', 'user__first_name', 'user__last_name')

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Profile, ProfileAdmin)