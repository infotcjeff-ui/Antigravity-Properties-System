'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface Notification {
    id: string;
    message: string;
    timestamp: Date;
    read: boolean;
    type: 'create' | 'update' | 'delete' | 'info';
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (message: string, type: Notification['type']) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'pms_notifications';

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Load notifications from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Convert timestamp strings back to Date objects
                const restored = parsed.map((n: Notification & { timestamp: string }) => ({
                    ...n,
                    timestamp: new Date(n.timestamp),
                }));
                setNotifications(restored);
            }
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    }, []);

    // Save notifications to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
        } catch (error) {
            console.error('Failed to save notifications:', error);
        }
    }, [notifications]);

    const addNotification = useCallback((message: string, type: Notification['type']) => {
        const newNotification: Notification = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            message,
            timestamp: new Date(),
            read: false,
            type,
        };
        setNotifications((prev) => [newNotification, ...prev].slice(0, 50)); // Keep max 50 notifications
    }, []);

    const markAsRead = useCallback((id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                markAsRead,
                markAllAsRead,
                clearAll,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}
