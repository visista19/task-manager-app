import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [editing, setEditing] = useState(false);
const [newName, setNewName] = useState(user?.name || '');
const [newPassword, setNewPassword] = useState('');


  useEffect(() => {
    if (!token) return navigate('/login');
    axios
      .get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error(err);
        navigate('/login');
      });
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>👤 Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
      {editing && (
  <div className="edit-form">
    <input
      type="text"
      value={newName}
      placeholder="New name"
      onChange={(e) => setNewName(e.target.value)}
    />
    <input
      type="password"
      value={newPassword}
      placeholder="New password"
      onChange={(e) => setNewPassword(e.target.value)}
    />
    <button
      className="save-btn"
      onClick={() => {
        axios
          .put(
            'http://localhost:5000/api/profile',
            { name: newName, password: newPassword },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then(() => {
            alert('Profile updated!');
            setEditing(false);
            setUser({ ...user, name: newName });
            setNewPassword('');
          })
          .catch((err) => {
            console.error('Update error:', err);
            alert('Failed to update profile.');
          });
      }}
    >
      💾 Save
    </button>
  </div>
)}

<div className="button-group">
  <button
    className="profile-button logout-button"
    onClick={() => {
      localStorage.removeItem('token');
      navigate('/login');
    }}
  >
    Logout
  </button>

  <button
    className="profile-button dashboard-btn"
    onClick={() => navigate('/dashboard')}
  >
    ← Back to Dashboard
  </button>

  <button
    className="profile-button edit-btn"
    onClick={() => setEditing(true)}
  >
    ✏️ Edit Profile
  </button>
</div>

</div>
  );
}

export default Profile;
