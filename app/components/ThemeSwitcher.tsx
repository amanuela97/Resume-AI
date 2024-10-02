import React, { useState } from "react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useEffect } from "react";

const ThemeSwitcher = () => {
    const [theme, setTheme] = useState<'light' | 'dark' | undefined>(undefined);

    useEffect(() => {
        // Get theme from localStorage on initial load
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme as 'light' | 'dark');
            document.documentElement.classList.add(storedTheme);
        } else {
            // Default to light theme
            setTheme('light');
            document.documentElement.classList.add('light');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        // Remove the old theme class and add the new one
        document.documentElement.classList.remove(theme as string);
        document.documentElement.classList.add(newTheme);

        // Store theme in localStorage
        localStorage.setItem('theme', newTheme);
    };
    return (
        <>
            <div className="flex items-center justify-center">
                <DarkModeSwitch checked={theme === 'dark'} onChange={toggleTheme} size={36} />
            </div>
        </>
    );
};

export default ThemeSwitcher;