import React, { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

function DarkModeToggle() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

const toggleDarkMode = () => {
  document.body.classList.toggle('dark');
};

  useEffect(() => {
    if (dark) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <div style={{ position: 'absolute', top: 20, right: 20, cursor: 'pointer', fontSize: '1.4rem' }}>
      <button onClick={() => setDark(!dark)} style={{ background: 'none', border: 'none' }}>
        {dark ? <FaSun color="gold" /> : <FaMoon color="#333" />}
      </button>
    </div>
  );
}

export default DarkModeToggle;
