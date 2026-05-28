# DebtLens 💰

> Know your real salary before you sign the offer letter.

DebtLens is an AI-powered salary clarity tool for freshers in India. Enter your CTC and instantly see your actual in-hand salary, tax breakdown, and get a personalized financial plan powered by Google Gemini AI.

## 🌐 Live Demo
- **Frontend:** https://debtlens-n1r2.vercel.app
- **Backend API:** https://debtlens-backend.onrender.com

## 🚀 Features
- JWT Authentication (Register/Login)
- CTC to In-Hand salary breakdown
- New Tax Regime 2024-25 calculations
- AI-powered personalized financial advice
- Responsive UI with Tailwind CSS

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React.js + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | PostgreSQL + Prisma ORM |
| AI | Google Gemini 2.5 Flash |
| Auth | JWT (JSON Web Tokens) |
| Deploy | Vercel + Render |

## 📦 Local Setup

### Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Environment Variables
Create `backend/.env`:

PORT=5000
JWT_SECRET=your_secret_key_here
DATABASE_URL=your_postgresql_connection_string
GEMINI_API_KEY=your_gemini_api_key

## 👨‍💻 Author
Paritosh Katiyar — [GitHub](https://github.com/paritoshkatiyar30)