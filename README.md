# Aura Social Media Platform

Welcome to the Aura Social Media Platform! Our platform is designed to enhance user interaction through various social networking features. Below you'll find comprehensive information, including features, tech stack, setup instructions, and deployment information.

## Features
- **User Profiles**: Create and customize profiles with personal information, profile pictures, and bio.
- **News Feed**: View updates from friends and followed accounts.
- **Messaging**: Send and receive direct messages.
- **Notifications**: Stay updated with real-time notifications for likes, comments, and messages.
- **Search Functionality**: Easily find users, posts, and hashtags.
- **Privacy Settings**: Control who can see your profile and posts.

## Tech Stack
- **Frontend**: React.js, Redux for state management, Bootstrap for styling.
- **Backend**: Node.js with Express.js framework.
- **Database**: MongoDB for storing user data and posts.
- **Authentication**: JSON Web Tokens (JWT) for secure authentication.
- **Deployment**: Docker for containerization, deployed on AWS.

## Setup Instructions
1. **Clone the Repository**: 
   ```bash
   git clone https://github.com/AhnafTaiyeb310/social-media.git
   cd social-media
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the necessary configuration:
   ```
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   AWS_ACCESS_KEY=your_aws_access_key
   AWS_SECRET_KEY=your_aws_secret_key
   ```

4. **Run the Application**:
   ```bash
   npm start
   ```

5. **Access the App**: Open your web browser and go to `http://localhost:3000`.

## Deployment Information
To deploy the Aura Social Media Platform, follow these steps:
1. **Build the Application**:
   ```bash
   npm run build
   ```

2. **Create a Docker Image**:
   ```bash
   docker build -t aura-social-media .
   ```

3. **Run Docker Container**:
   ```bash
   docker run -p 80:3000 aura-social-media
   ```

4. **Deploy to AWS**: Use ECS (Elastic Container Service) for deploying and managing your application on AWS.

## Conclusion
Aura is designed to provide an engaging social experience for users with a focus on security and performance. Join us on this journey to grow your network and interact with others in a meaningful way!