'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedDropdownProps {
    trigger: React.ReactNode;
    children: React.ReactNode;
    align?: 'left' | 'right' | 'center';
    className?: string;
}

export default function AnimatedDropdown({
    trigger,
    children,
    align = 'left',
    className = ''
}: AnimatedDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const alignmentClasses = {
        left: 'left-0',
        right: 'right-0',
        center: 'left-1/2 -translate-x-1/2'
    };

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            {/* Trigger */}
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                {trigger}
            </div>

            {/* Dropdown Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{
                            duration: 0.15,
                            ease: [0.4, 0.0, 0.2, 1]
                        }}
                        className={`absolute z-50 mt-2 ${alignmentClasses[align]} origin-top`}
                    >
                        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-white/10 overflow-hidden">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Dropdown Menu Item Component
interface DropdownItemProps {
    children: React.ReactNode;
    onClick?: () => void;
    icon?: React.ReactNode;
    className?: string;
}

export function DropdownItem({ children, onClick, icon, className = '' }: DropdownItemProps) {
    return (
        <motion.div
            whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
            onClick={onClick}
            className={`px-4 py-2.5 text-sm text-zinc-700 dark:text-white/80 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors flex items-center gap-3 ${className}`}
        >
            {icon && <span className="text-zinc-400 dark:text-white/40">{icon}</span>}
            <span>{children}</span>
        </motion.div>
    );
}

// Dropdown Divider Component
export function DropdownDivider() {
    return <div className="h-px bg-zinc-200 dark:bg-white/10 my-1" />;
}
