const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const Task = require('../models/task');

router.post('/tasks', verifyToken, async (req, res) => {
  const { title } = req.body;
  try {
    const task = await Task.create({
      title,
      UserId: req.userId
    });
    res.status(201).json(task);
  } catch (error) {
    console.error('Task create error:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
});

router.get('/tasks', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { UserId: req.userId } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// UPDATE a task's status
router.put('/tasks/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findByPk(id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.UserId !== req.userId)
      return res.status(403).json({ message: 'Unauthorized' });

    task.status = status;
    await task.save();

    res.json(task);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error updating task' });
  }
});

router.delete('/tasks/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.UserId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Server error deleting task' });
  }
});



module.exports = router;
