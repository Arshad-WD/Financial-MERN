"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Receipt, Wallet, LogOut } from "lucide-react";
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
    ];

    return (
        <div className="min-h-screen bg-background flex text-foreground font-sans">
            {/* Soft Minimalist Sidebar */}
            <aside className="w-64 border-r border-[#222222] bg-[#000000]/50 backdrop-blur-md hidden md:flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <span className="text-white font-bold tracking-tight">F</span>
                    </div>
                    <span className="font-bold tracking-tight text-lg text-[#ededed]">Finance</span>
                </div>

                <div className="px-6 pb-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
                    <nav className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={clsx(
                                        "flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition-all duration-200",
                                        isActive 
                                            ? "bg-slate-50 text-blue-600 shadow-sm border border-slate-100" 
                                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                    )}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t border-[#222222]">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-lg bg-[#0a0a0a] border border-[#222222]">
                        <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold text-xs uppercase shadow-sm">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold text-[#ededed] truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md font-medium text-sm text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Log out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <div className="p-6 md:p-10 w-full max-w-6xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
