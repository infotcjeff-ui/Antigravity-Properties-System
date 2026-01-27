import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from './ThemeProvider'
import { Button } from '@nextui-org/react'
import { SunIcon, MoonIcon, LanguageIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

const Topbar = () => {
    const { t, i18n } = useTranslation()
    const { profile, signOut } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const [langMenuOpen, setLangMenuOpen] = useState(false)

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang)
        setLangMenuOpen(false)
    }

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {profile?.role === 'admin' ? t('app.admin') : t('app.client')}
                </h2>
            </div>

            <div className="flex items-center gap-3">
                {/* Language Selector */}
                <div className="relative">
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={() => setLangMenuOpen(!langMenuOpen)}
                    >
                        <LanguageIcon className="w-5 h-5" />
                    </Button>
                    {langMenuOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                            <button
                                onClick={() => handleLanguageChange('en')}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                            >
                                English
                            </button>
                            <button
                                onClick={() => handleLanguageChange('zh-TW')}
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                            >
                                ÁπÅÈ?‰∏≠Ê?
                            </button>
                        </div>
                    )}
                </div>

                {/* Theme Toggle */}
                <Button isIconOnly variant="light" onPress={toggleTheme}>
                    {theme === 'light' ? (
                        <MoonIcon className="w-5 h-5" />
                    ) : (
                        <SunIcon className="w-5 h-5" />
                    )}
                </Button>

                {/* User Info & Logout */}
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {profile?.full_name || 'User'}
                    </span>
                    <Button
                        isIconOnly
                        variant="light"
                        color="danger"
                        onPress={handleSignOut}
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default Topbar
