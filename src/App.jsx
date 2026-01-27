import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './components/ThemeProvider'
import AdminLayout from './layouts/AdminLayout'
import ClientLayout from './layouts/ClientLayout'
import ProtectedRoute from './components/ProtectedRoute'

// Admin Pages
import PropertiesPage from './features/properties/PropertiesPage'
import RentingPage from './features/renting/RentingPage'
import RentOutPage from './features/rentout/RentOutPage'
import ProprietorsPage from './features/proprietors/ProprietorsPage'
import ShowAllPage from './features/dashboard/ShowAllPage'

// Client Pages
import MyListingsPage from './features/client/MyListingsPage'

// Auth Pages
import LoginPage from './features/auth/LoginPage'

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<ShowAllPage />} />
                        <Route path="properties" element={<PropertiesPage />} />
                        <Route path="renting" element={<RentingPage />} />
                        <Route path="rentout" element={<RentOutPage />} />
                        <Route path="proprietors" element={<ProprietorsPage />} />
                    </Route>

                    {/* Client Routes */}
                    <Route
                        path="/client"
                        element={
                            <ProtectedRoute requiredRole="client">
                                <ClientLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="/client/listings" replace />} />
                        <Route path="listings" element={<MyListingsPage />} />
                    </Route>

                    {/* Default Route */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App
