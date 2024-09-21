const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const userRoutes = require('./routes/userRoutes');

const sequelize = require('./models/index');
const errorMiddleware = require('./middleware/errorMiddleware');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/medications', medicationRoutes); // New medication route

// Error middleware
app.use(errorMiddleware);

// Database Connection and Server Start
sequelize.sync().then(() => {
  console.log('Database connected!');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.log('Error connecting to database: ', err);
});
