import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import DarkModeToggle from './DarkModeToggle';
import './Dashboard.css';
import { FaTrashAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    axios
      .get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data))
      .catch((err) => console.error('Fetch error:', err));
  }, [token, navigate]);
  const handleAdd = () => {
    if (!title.trim()) return;
    axios
      .post(
        'http://localhost:5000/api/tasks',
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setTasks([...tasks, res.data]);
        setTitle('');
      })
      .catch((err) => console.error('Add error:', err));
  };
 const handleToggle = (id, status) => {
  const newStatus = status === 'completed' ? 'pending' : 'completed';
  axios
    .put(
      `http://localhost:5000/api/tasks/${id}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((res) => {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
    })
    .catch((err) => console.error('Toggle error:', err));
};
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((err) => console.error('Delete error:', err));
  };
  const handleLogout = () => {
    document.body.classList.add('fade-out');
    setTimeout(() => {
      localStorage.removeItem('token');
      navigate('/login');
    }, 800);
  };
const completedCount = tasks.filter((task) => task.status === 'completed').length;
const totalCount = tasks.length;
const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  return (
    <>
      <DarkModeToggle />
      <div className={`container ${document.body.classList.contains('dark') ? 'dark' : ''}`}>
        <h1>My Tasks </h1>
              <div className="progress-wrapper">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${completionRate}%` }}>
  {Math.round(completionRate)}%
</div>
        </div>
        <p style={{ marginTop: '6px' }}>
          {completedCount} of {totalCount} tasks completed
        </p>
      </div>


        <div className="floating-task-bar">
          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="add-btn" onClick={handleAdd}>
            Add
          </button>
        </div>
        <Link to="/profile" className="profile-link">
  👤 View Profile
</Link>



        <ul className="task-list">
          {tasks.length === 0 && <p>No tasks yet</p>}
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.li
                key={task.id}
                className="task-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3 }}
              >
                <span className={task.status === 'completed' ? 'task-completed' : ''}>
                  {task.title}
                </span>
                <div>
                  <button className="complete-btn" onClick={() => handleToggle(task.id, task.status)}>
                    Complete
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(task.id)}>
                    <FaTrashAlt />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <motion.button
          onClick={handleLogout}
          className="logout-button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </motion.button>
      </div>
    </>
  );
}
export default Dashboard;
