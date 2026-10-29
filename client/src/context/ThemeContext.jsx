import { createContext, useState, useEffect, useContext } from 'react';

const C = createContext();

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    document.body.style.background = dark ? '#000' : '#fff';
    document.body.style.color = dark ? '#fff' : '#000';
  }, [dark]);

  return <C.Provider value={{ dark, toggle: () => setDark(v => !v) }}>{children}</C.Provider>;
}

export const useTheme = () => useContext(C);
