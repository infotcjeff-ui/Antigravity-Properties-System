'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BentoGridProps {
    children: React.ReactNode;
    className?: string;
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
    return (
        <div className={`bento-grid ${className}`}>
            {children}
        </div>
    );
}

interface BentoCardProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    className?: string;
    size?: 'default' | 'lg' | 'tall' | 'wide';
    gradient?: 'purple' | 'blue' | 'green' | 'orange' | 'none';
    onClick?: () => void;
}

export function BentoCard({
    children,
    title,
    subtitle,
    icon,
    className = '',
    size = 'default',
    gradient = 'none',
    onClick
}: BentoCardProps) {
    const sizeClasses = {
        default: '',
        lg: 'bento-item-lg bento-item-tall',
        tall: 'bento-item-tall',
        wide: 'bento-item-lg',
    };

    const gradientClasses = {
        none: '',
        purple: 'bg-gradient-to-br from-purple-500/20 to-purple-600/10',
        blue: 'bg-gradient-to-br from-blue-500/20 to-blue-600/10',
        green: 'bg-gradient-to-br from-green-500/20 to-green-600/10',
        orange: 'bg-gradient-to-br from-orange-500/20 to-orange-600/10',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            className={`
        bento-item 
        ${sizeClasses[size]} 
        ${gradientClasses[gradient]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
        >
            {(icon || title || subtitle) && (
                <div className="flex items-start gap-3 mb-4">
                    {icon && (
                        <div className="p-2 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-white/80 border border-zinc-200 dark:border-none">
                            {icon}
                        </div>
                    )}
                    <div>
                        {title && (
                            <h3 className="font-semibold text-zinc-900 dark:text-white text-lg">{title}</h3>
                        )}
                        {subtitle && (
                            <p className="text-zinc-500 dark:text-white/50 text-sm mt-0.5">{subtitle}</p>
                        )}
                    </div>
                </div>
            )}
            {children}
        </motion.div>
    );
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    gradient?: 'purple' | 'blue' | 'green' | 'orange';
}

export function StatCard({ label, value, icon, trend, gradient = 'purple' }: StatCardProps) {
    const gradientIconClasses = {
        purple: 'from-purple-500 to-purple-600',
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        orange: 'from-orange-500 to-orange-600',
    };

    return (
        <BentoCard>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-zinc-500 dark:text-white/50 text-sm mb-1">{label}</p>
                    <p className="text-3xl font-bold text-zinc-900 dark:text-white">{value}</p>
                    {trend && (
                        <div className={`flex items-center gap-1 mt-2 text-sm ${trend.isPositive ? 'text-green-400' : 'text-red-400'
                            }`}>
                            <svg
                                className={`w-4 h-4 ${trend.isPositive ? '' : 'rotate-180'}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            <span>{trend.value}%</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradientIconClasses[gradient]} shadow-lg`}>
                    {icon}
                </div>
            </div>
        </BentoCard>
    );
}
