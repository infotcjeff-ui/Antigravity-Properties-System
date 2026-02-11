'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/components/common/LanguageSwitcher';

interface ThemeToggleProps {
    className?: string;
    showLabel?: boolean;
}

export default function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme();
    const language = useLanguage();

    // Language-aware labels
    const getLabel = () => {
        if (theme === 'dark') {
            return language === 'zh-TW' ? '淺色模式' : 'Light Mode';
        } else {
            return language === 'zh-TW' ? '深色模式' : 'Dark Mode';
        }
    };

    const getTitle = () => {
        if (theme === 'dark') {
            return language === 'zh-TW' ? '切換至淺色模式' : 'Switch to Light Mode';
        } else {
            return language === 'zh-TW' ? '切換至深色模式' : 'Switch to Dark Mode';
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`flex items-center gap-3 p-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-white/70 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/10 transition-all ${className}`}
            title={getTitle()}
        >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {showLabel && (
                <span className="font-medium text-sm">
                    {getLabel()}
                </span>
            )}
        </motion.button>
    );
}
