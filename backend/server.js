const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
const userRoutes = require('./routes/user');
app.use('/api', userRoutes);

const taskRoutes = require('./routes/task');
app.use('/api', taskRoutes); // 👈 This makes /api/tasks work


const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);


// DB
const sequelize = require('./config/db');
// 👈 THIS LINE is essential
require('./models'); 


sequelize.authenticate()
  .then(() => {
    console.log(' Database connected...');
    return sequelize.sync(); 
  })


// Sync DB
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected...');
    return sequelize.sync(); // This creates tables
  })
  .then(() => {
    console.log('✅ Tables synced');
  })
  .catch((err) => {
    console.error('❌ Error connecting to database:', err);
  });

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});



