import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, profile, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (requiredRole && profile?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on role
        if (profile?.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />
        } else if (profile?.role === 'client') {
            return <Navigate to="/client/listings" replace />
        }
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute
