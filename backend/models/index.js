
// models/index.js
const User = require('./user');
const Task = require('./task');

// Associations here ✅
User.hasMany(Task, { onDelete: 'CASCADE' });
Task.belongsTo(User);

module.exports = {
  User,
  Task
};

