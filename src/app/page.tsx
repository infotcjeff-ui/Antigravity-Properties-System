'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        // Check if user is authenticated
        try {
            const authData = localStorage.getItem('pms_auth');
            if (authData) {
                const parsed = JSON.parse(authData);
                if (parsed.isAuthenticated) {
                    // Redirect to dashboard if authenticated
                    router.push('/dashboard');
                    return;
                }
            }
        } catch {
            // Ignore errors
        }

        // Redirect to login if not authenticated
        router.push('/login');
    }, [router]);

    // Show loading state while redirecting
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-zinc-500 dark:text-white/50">載入中...</p>
            </div>
        </div>
    );
}
