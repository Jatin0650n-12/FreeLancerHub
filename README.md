
# Freelancer Project Hub

A full-stack freelance collaboration platform built with the **MERN stack**.  
It centralizes project posting, proposals, contracts, tasks, file sharing, real-time chat, and payments—providing a single workspace for clients and freelancers.

**Live Demo:** [freelancerprojecthub.vercel.app](https://freelancerprojecthub.vercel.app)

---

## 📌 Features

### Authentication & Roles

- JWT-based authentication
- Two roles: **Client** and **Freelancer**

### Project Lifecycle

- Clients post projects with descriptions and budgets
- Freelancers submit proposals with custom bids
- Clients accept proposals → project assigned + budget updated

### Project Workspace

- Private space for each project (only client + freelancer)
- **Kanban Task Board** (Todo, In Progress, Done)
- File uploads via **Cloudinary**
- Billing & Payment tab for invoices

### Payments

- **Razorpay API** integration
- Secure server-side order creation & HMAC-SHA256 signature verification

### Communication & Notifications

- Real-time project chat (**Socket.IO**)
- Direct messaging
- Notifications (messages, connection requests, project updates)

### Profiles & Reputation

- Editable LinkedIn-style profiles (Bio, Skills, Experience, Education)
- Profile pictures stored in **Cloudinary**
- Review & rating system for both clients and freelancers

### Social Features

- Home feed for posts (text + job postings)
- Likes & comments
- User connections (send/accept/decline requests)
- Hashtags linked to search

### UI/UX

- Built with **Tailwind CSS**
- Fully responsive across devices

---

## 🛠 Tech Stack

- **Frontend:** React, Vite, React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Real-time:** Socket.IO
- **Payments:** Razorpay
- **File Storage:** Cloudinary
- **Authentication:** JSON Web Tokens (JWT)
- **Deployment:** Vercel (frontend), Render / Railway (backend)

---

## 📂 Project Structure

```
freelancerProjectHub/
├── client/ # Frontend (React + Tailwind)
│ ├── public/ # Static assets
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Page views
│ │ ├── context/ # Auth & global state
│ │ ├── services/ # API calls & socket
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── package.json
├── server/ # Backend (Node.js + Express + MongoDB)
│ ├── config/ # DB, cloudinary, stripe configs
│ ├── controllers/ # Business logic
│ ├── middleware/ # Auth & error handlers
│ ├── models/ # MongoDB schemas
│ ├── routes/ # API routes
│ ├── utils/ # Helper functions
│ ├── server.js # Entry point
│ └── package.json
├── .gitignore
├── LICENSE
└── README.md # Project Documentation

```

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (>= 16) and npm
- MongoDB (local or Atlas)
- Cloudinary account
- Razorpay test/live account

---

### 1. Clone the repository
```bash
git clone https://github.com/Jatin0650n-12/FreeLancerHub.git
cd FreeLancerHub
```

---

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env # Copy example env and update credentials
```

Update `.env` with your credentials:
```env
PORT=5001
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
CLIENT_URL=http://localhost:5173
```



Start the backend server:

```bash
npm start
```

---

### 3. Frontend Setup
```bash
cd client
npm install
cp .env.example .env # Copy example env and update values
```

Update `.env` with your values:
```env
VITE_API_BASE_URL=http://localhost:5001
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id
```

Run the frontend:
```bash
npm run dev
```

---

## 🌐 Deployment



This project is deployed with a decoupled architecture.

### Backend (AWS EC2 + Nginx + PM2)
The backend Node.js application is deployed on an AWS EC2 instance, running as a persistent process managed by **PM2**. **Nginx** is used as a reverse proxy to handle incoming traffic and to serve the application over HTTPS using a free SSL certificate from **Let's Encrypt**.

### Frontend (Vercel)
The frontend React application is deployed on **Vercel**. The repository is configured with a `vercel.json` file to correctly handle client-side routing, and environment variables are set in the Vercel project settings to connect to the live backend API.

---

## 🧑‍💻 Contributing

- Fork the repo
- Create a new branch (e.g. `feature/my-feature`)
- Commit changes (`git commit -m "Added new feature"`)
- Push branch (`git push origin feature/my-feature`)
- Open a Pull Request

---

## 👤 Author

Jatin Kumar

- GitHub: [@Jatin0650n-12](https://github.com/Jatin0650n-12)

---

## 📜 License

This project is licensed under the MIT License.
