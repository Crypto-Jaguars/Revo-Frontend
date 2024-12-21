import { MdOutlineLightMode } from 'react-icons/md';
import { LuMoonStar } from 'react-icons/lu';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage?.getItem('theme') || 'light';
    } catch {
      return 'light';
    }
  }); // Retrieves from local, enhanced by suggestion on first PR

  useEffect(() => {
    const root = window.document.documentElement;
  
    // Main purpose of this useEffect is to set the theme on initial render
    
    if (theme === 'dark') {
      root.classList.add('dark');
      try {
        localStorage?.setItem('theme', 'dark'); 
      } catch (error) {
        console.warn('Failed to save theme preference:', error);
      }
    } else {
      root.classList.remove('dark');
      try {
        localStorage?.setItem('theme', 'light');
      } catch (error) {
        console.warn('Failed to save theme preference:', error);
      }
    }
    
    return () => {
      // Cleanup if component unmounts during theme transition
      root.classList.remove('dark');
    };
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