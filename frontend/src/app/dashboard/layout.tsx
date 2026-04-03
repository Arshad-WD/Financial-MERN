"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Receipt, Wallet, LogOut } from "lucide-react";
import clsx from "clsx";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, logout, user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isLoading, router]);

    if (!mounted || isLoading || !isAuthenticated) return null;

    const navigation = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Transactions", href: "/dashboard/transactions", icon: Receipt },
        { name: "Accounts", href: "/dashboard/accounts", icon: Wallet },
    ];

    return (
        <div className="min-h-screen bg-black flex text-foreground font-sans">
            {/* Premium Dark Sidebar */}
            <aside className="w-64 border-r border-[#1a1a1a] bg-[#050505]/80 backdrop-blur-xl hidden md:flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        <span className="text-white font-black tracking-tighter text-xl">F</span>
                    </div>
                    <div>
                        <span className="font-black tracking-tighter text-xl text-[#ededed]">FINANCE</span>
                        <div className="h-0.5 w-6 bg-blue-500 rounded-full mt-0.5"></div>
                    </div>
                </div>

                <div className="px-4 py-6 flex-1 overflow-y-auto">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4 px-4">Management</p>
                    <nav className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={clsx(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 group relative",
                                        isActive 
                                            ? "text-blue-400 bg-blue-500/5 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.05)]" 
                                            : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
                                    )}
                                >
                                    {isActive && <div className="absolute left-0 w-1 h-4 bg-blue-500 rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>}
                                    <item.icon className={clsx("w-4 h-4 transition-transform group-hover:scale-110", isActive && "text-blue-400")} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-[#1a1a1a] space-y-4">
                    <div className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] group hover:border-[#333] transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-900/50 to-indigo-900/50 border border-blue-500/20 flex items-center justify-center text-blue-300 font-black text-sm uppercase">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-black text-[#ededed] truncate tracking-tight">{user?.name}</p>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
                                <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                    {user?.role === 'ADMIN' ? 'Administrator' : 'Financial Viewer'}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-gray-500 hover:text-red-400 hover:bg-red-400/5 border border-transparent hover:border-red-400/10 transition-all group"
                    >
                        <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Sign Out
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
