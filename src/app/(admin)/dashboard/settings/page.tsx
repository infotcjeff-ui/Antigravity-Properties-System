'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Bell, Palette, Globe, Check, Sun, Moon, Database, Cloud, RefreshCw } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useDatabase } from '@/hooks/useStorage';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

type Language = 'zh-TW' | 'en';

export default function SettingsPage() {
    const [language, setLanguage] = useState<Language>('zh-TW');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const { theme, toggleTheme } = useTheme();
    const queryClient = useQueryClient();
    const { syncLocalToCloud, loading: dbLoading } = useDatabase();
    const { user, registerUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Access control
        if (user && user.role !== 'admin') {
            router.push('/dashboard');
            return;
        }
        // Load saved language preference
        const saved = localStorage.getItem('app-language') as Language | null;
        if (saved) {
            setLanguage(saved);
        }
    }, [user]);

    const changeLanguage = (newLang: Language) => {
        if (newLang === language) return;

        setLanguage(newLang);
        localStorage.setItem('app-language', newLang);
        document.documentElement.lang = newLang;

        // Trigger a custom event for other components to react
        window.dispatchEvent(new CustomEvent('language-change', { detail: newLang }));

        // Show alert
        const message = newLang === 'zh-TW'
            ? '語言已切換為繁體中文'
            : 'Language changed to English';
        setAlertMessage(message);
        setShowAlert(true);

        // Hide alert after 3 seconds
        setTimeout(() => setShowAlert(false), 3000);
    };

    const handleSyncData = async () => {
        const result = await syncLocalToCloud();

        setAlertMessage(result.message);
        setShowAlert(true);

        if (result.success) {
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            queryClient.invalidateQueries({ queryKey: ['proprietors'] });
            queryClient.invalidateQueries({ queryKey: ['rents'] });
        }

        setTimeout(() => setShowAlert(false), 5000);
    };

    // Get translated text based on current language
    const t = (zhTW: string, en: string) => language === 'zh-TW' ? zhTW : en;

    return (
        <div className="space-y-6">
            {/* Alert Toast */}
            <AnimatePresence>
                {showAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -50, x: '-50%' }}
                        className="fixed top-6 left-1/2 z-50 px-6 py-3 bg-green-500 text-white rounded-xl shadow-lg flex items-center gap-3"
                    >
                        <Check className="w-5 h-5" />
                        <span className="font-medium">{alertMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {t('系統設定', 'System Settings')}
                </h1>
                <p className="text-zinc-500 dark:text-white/50 mt-1">
                    {t('管理系統偏好設定和配置', 'Manage system preferences and configurations')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Settings - Language */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-zinc-200 dark:border-white/10"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                                {t('一般設定', 'General')}
                            </h2>
                            <p className="text-sm text-zinc-500 dark:text-white/40">
                                {t('語言與地區設定', 'Language and region settings')}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-zinc-700 dark:text-white/70">
                                    {t('顯示語言', 'Display Language')}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => changeLanguage('zh-TW')}
                                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${language === 'zh-TW'
                                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                        : 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-white/60 hover:bg-zinc-200 dark:hover:bg-white/20'
                                        }`}
                                >
                                    繁體中文
                                </button>
                                <button
                                    onClick={() => changeLanguage('en')}
                                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${language === 'en'
                                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                        : 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-white/60 hover:bg-zinc-200 dark:hover:bg-white/20'
                                        }`}
                                >
                                    English
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Appearance Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-zinc-200 dark:border-white/10"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                            <Palette className="w-5 h-5 text-pink-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                                {t('外觀設定', 'Appearance')}
                            </h2>
                            <p className="text-sm text-zinc-500 dark:text-white/40">
                                {t('主題與視覺效果', 'Themes and visual effects')}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-white/5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-zinc-700 dark:text-white/70">
                                    {t('顯示模式', 'Display Mode')}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => theme === 'dark' && toggleTheme()}
                                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${theme === 'light'
                                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                        : 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-white/60 hover:bg-zinc-200 dark:hover:bg-white/20'
                                        }`}
                                >
                                    <Sun className="w-4 h-4" />
                                    {t('淺色模式', 'Light Mode')}
                                </button>
                                <button
                                    onClick={() => theme === 'light' && toggleTheme()}
                                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${theme === 'dark'
                                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                        : 'bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-white/60 hover:bg-zinc-200 dark:hover:bg-white/20'
                                        }`}
                                >
                                    <Moon className="w-4 h-4" />
                                    {t('深色模式', 'Dark Mode')}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Security Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-zinc-200 dark:border-white/10"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                                {t('安全設定', 'Security')}
                            </h2>
                            <p className="text-sm text-zinc-500 dark:text-white/40">
                                {t('存取權限與身份驗證', 'Access and authentication')}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-white/5">
                            <span className="text-zinc-700 dark:text-white/70">
                                {t('角色權限控制', 'Role-based Access')}
                            </span>
                            <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">
                                {t('已啟用', 'Enabled')}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Notifications */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-zinc-200 dark:border-white/10"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                            <Bell className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                                {t('通知設定', 'Notifications')}
                            </h2>
                            <p className="text-sm text-zinc-500 dark:text-white/40">
                                {t('電郵與系統提醒', 'Email and system alerts')}
                            </p>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl border border-dashed border-zinc-200 dark:border-white/10 text-center">
                        <p className="text-zinc-500 dark:text-white/40 text-sm italic">
                            {t('通知中心開發中', 'Notification center under development')}
                        </p>
                    </div>
                </motion.div>

                {/* System Management */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-zinc-200 dark:border-white/10"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <Database className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                                {t('系統管理', 'System Management')}
                            </h2>
                            <p className="text-sm text-zinc-500 dark:text-white/40">
                                {t('資料同步與維護', 'Data synchronization and maintenance')}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5">
                            <h3 className="text-sm font-medium text-zinc-900 dark:text-white mb-2">
                                {t('資料同步', 'Data Sync')}
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-white/40 mb-4">
                                {t('將本地存儲的資料與雲端資料庫進行同步。這將會上傳本地新增的物業和租務記錄。', 'Sync your local data with the cloud database. This will upload any new local properties and rent records.')}
                            </p>
                            <button
                                onClick={handleSyncData}
                                disabled={dbLoading}
                                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                            >
                                {dbLoading ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Cloud className="w-4 h-4" />
                                )}
                                {t('同步本地資料', 'Sync Local Data')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
