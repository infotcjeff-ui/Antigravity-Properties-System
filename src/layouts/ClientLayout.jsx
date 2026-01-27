import { Outlet } from 'react-router-dom'
import Topbar from '../components/Topbar'
import PageTransition from '../components/PageTransition'

const ClientLayout = () => {
    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
            <Topbar />
            <main className="flex-1 overflow-y-auto p-6">
                <PageTransition>
                    <Outlet />
                </PageTransition>
            </main>
        </div>
    )
}

export default ClientLayout
