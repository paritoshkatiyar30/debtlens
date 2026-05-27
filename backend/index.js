const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./src/routes/authRoutes');
const salaryRoutes = require('./src/routes/salaryRoutes');
const aiRoutes = require('./src/routes/aiRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://debtlens-n1r2.vercel.app'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/ai', aiRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'DebtLens API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});