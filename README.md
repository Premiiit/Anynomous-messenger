# Anonymous Messenger

Anonymous Messenger is a secure, anonymous email communication platform built with Next.js, Resend API, Gemini AI, and MongoDB. It empowers whistleblowers, journalists, and privacy-conscious users to communicate safely and maintain complete anonymity, with the help of smart AI-driven message suggestions.

## Features

- 🔒 **Authentication**
  - Secure login system using Credentials Provider from NextAuth.js
  - Passwords hashed securely using bcrypt
  - OTP-based verification through email using Resend API
  - JWT-based session management for better security

- ✉️ **Anonymous Messaging**
  - Send emails anonymously without revealing identity
  - Emails are routed through the platform, hiding sender details

- 🤖 **Smart Suggestions**
  - Gemini AI suggests message drafts to help users communicate better and faster
  - AI-powered phrasing for privacy-preserving communication

- 🗄️ **Database**
  - MongoDB used for storing user data securely

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Authentication**: NextAuth.js (Credentials Provider), JWT, bcrypt
- **Email Service**: Resend API
- **AI Integration**: Gemini AI (Google's Generative AI)
- **Database**: MongoDB
- **Hosting**: (Specify here: Vercel / your own server)



### Setup Environment Variables

Create a `.env.local` file at the root of the project and add the following:

```env
# Resend API Key
RESEND_API_KEY=your_resend_api_key

# MongoDB Connection URI
MONGODB_URI=your_mongodb_connection_string

# NextAuth Credentials Provider
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# JWT Secret
JWT_SECRET=your_jwt_secret

# Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key

