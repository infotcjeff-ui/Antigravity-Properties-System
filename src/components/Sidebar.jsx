import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
    HomeIcon,
    BuildingOfficeIcon,
    CurrencyDollarIcon,
    BanknotesIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline'

const menuItems = [
    { path: '/admin/dashboard', label: 'nav.dashboard', icon: HomeIcon },
    { path: '/admin/properties', label: 'nav.properties', icon: BuildingOfficeIcon },
    { path: '/admin/renting', label: 'nav.renting', icon: CurrencyDollarIcon },
    { path: '/admin/rentout', label: 'nav.rentout', icon: BanknotesIcon },
    { path: '/admin/proprietors', label: 'nav.proprietors', icon: UserGroupIcon },
]

const Sidebar = () => {
    const { t } = useTranslation()
    const location = useLocation()

    return (
        <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {t('app.title')}
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.path

                    return (
                        <Link key={item.path} to={item.path}>
                            <motion.div
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${isActive
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <Icon className="w-5 h-5 relative z-10" />
                                <span className="font-medium relative z-10">{t(item.label)}</span>
                            </motion.div>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}

export default Sidebar
