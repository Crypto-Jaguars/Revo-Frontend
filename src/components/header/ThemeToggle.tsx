import { MdOutlineLightMode } from 'react-icons/md';
import { LuMoonStar } from 'react-icons/lu';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light'); // Retrieves from local storage

  useEffect(() => {
    const root = window.document.documentElement;
  
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark'); // Stores the selected theme
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light'); // Stores the selected theme
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? (
        <MdOutlineLightMode className="text-yellow-700" size={30} />
      ) : (
        <LuMoonStar className="text-gray-700" size={30} />
      )}
    </button>
  );
}
