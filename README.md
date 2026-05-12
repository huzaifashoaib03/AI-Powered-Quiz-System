# AI-Powered Quiz System 🧠⚡

A high-performance, secure, and intelligent quiz generation platform built with **Vanilla JavaScript**, **Groq AI (Llama 3.3)**, and **Cloudflare Workers**. This system allows users to generate custom quizzes on any topic with adjustable difficulty levels in real-time.

## 🌐 Live Demo
You can try the live version of the application here:  
👉 **[Smart Quiz by Huzaifa](https://smart-quiz-by-huzaifa.netlify.app/)**

## 🌟 Overview
This project is a core module of the **GGC-Portal** (an AI-driven campus management system). It replaces traditional static question banks with a dynamic AI engine that generates unique, context-aware questions tailored to the user's specific learning needs.

## 🚀 Key Features
- **Instant AI Generation:** Leverages the **Llama-3.3-70b-versatile** model via Groq SDK for high-speed quiz creation[cite: 1].
- **Customizable Parameters:**
  - **Topic Selection:** Generate questions on any subject or niche topic.
  - **Question Count:** Select the number of questions for your practice session.
  - **Difficulty Scaling:** Choose between **Easy, Medium, and Hard** modes[cite: 1].
- **Secure API Integration:** Uses a **Cloudflare Worker** as a serverless proxy to keep API keys hidden and secure from the frontend[cite: 1].
- **Responsive UI/UX:** A clean, modern interface designed with CSS3 for seamless use across all devices.
- **Real-time Feedback:** Get instant scores and feedback upon completing the quiz.

## 🛠️ Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **AI Inference Engine:** Groq Cloud SDK[cite: 1]
- **Backend/Proxy:** Cloudflare Workers (Serverless)[cite: 1]
- **Hosting:** Netlify (Frontend)

## 📂 Project Structure
```text
├── index.html       # Main application interface
├── style.css        # Custom styling and responsive design
├── script.js        # Core logic and Proxy API communication
└── README.md        # Project documentation and setup guide
