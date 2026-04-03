"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Receipt, Wallet, Layers, LogOut, ShieldCheck } from "lucide-react";
import clsx from "clsx";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, logout, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router]);

    if (!mounted || !isAuthenticated) return null;

    const navigation = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Transactions", href: "/dashboard/transactions", icon: Receipt },
        { name: "Accounts", href: "/dashboard/accounts", icon: Wallet },
        { name: "Categories", href: "/dashboard/categories", icon: Layers },
    ];

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-border bg-card/30 backdrop-blur-3xl hidden md:flex flex-col">
                <div className="p-6 flex items-center gap-3 border-b border-border">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shadow-inner glass-gradient">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-bold tracking-tight text-foreground/90">FinDash</h2>
                        <p className="text-[10px] uppercase text-primary font-bold tracking-widest">{user?.role || 'User'}</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1.5">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200",
                                    isActive 
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border focus:outline-none">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-background/50 border border-border">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                 {/* Ambient Background Gradient for content */}
                 <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none -mr-[20%]" />
                
                <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
