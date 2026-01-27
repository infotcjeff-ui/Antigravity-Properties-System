import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardBody, Input, Button } from '@nextui-org/react'
import { motion } from 'framer-motion'

const LoginPage = () => {
    const { t } = useTranslation()
    const { signIn } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await signIn(email, password)
            // Navigation will be handled by ProtectedRoute based on role
        } catch (err) {
            setError(t('auth.loginError'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="w-full max-w-md">
                    <CardBody className="p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                {t('app.title')}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">{t('auth.login')}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                type="email"
                                label={t('auth.email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                variant="bordered"
                            />

                            <Input
                                type="password"
                                label={t('auth.password')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                variant="bordered"
                            />

                            {error && (
                                <div className="text-red-500 text-sm text-center">{error}</div>
                            )}

                            <Button
                                type="submit"
                                color="primary"
                                className="w-full"
                                isLoading={loading}
                            >
                                {t('auth.loginButton')}
                            </Button>
                        </form>
                    </CardBody>
                </Card>
            </motion.div>
        </div>
    )
}

export default LoginPage
