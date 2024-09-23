const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const medicationRequestRoutes = require('./routes/medicationRequestRoutes');
const donationRoutes = require('./routes/donationRoutes');
const medFormsRoutes = require('./routes/medicationFormRoutes');
const medicalConditionRoutes = require('./routes/medicalConditionRoutes');
const medSeverityRoutes = require('./routes/medSeverityRoutes');
const requestStatusRoures = require('./routes/requestStatusRoutes');
const urgencyRoutes = require('./routes/urgencyRoutes');
const donationStatusRoutes = require('./routes/donationStatusRoutes');

const sequelize = require('./models/index');

const initRoles = require('./init/initRoles');
const initMedForms = require('./init/initMedForms');

const errorMiddleware = require('./middleware/errorMiddleware');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/medications', medicationRoutes); // New medication route
app.use('/api/medication-requests', medicationRequestRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/medforms', medFormsRoutes)
app.use('/api/medical-condition', medicalConditionRoutes);
app.use('/api/medical-severity', medSeverityRoutes);
app.use('/api/request-status', requestStatusRoures);
app.use('/api/request-urgency', urgencyRoutes);
app.use('/api/donation-status', donationStatusRoutes);

// Error middleware
app.use(errorMiddleware);

// Database Connection and Server Start
sequelize.sync().then(() => {
  console.log('Database connected!');

   // Call the initialization functions
   initMedForms();
   initRoles();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.log('Error connecting to database: ', err);
});
