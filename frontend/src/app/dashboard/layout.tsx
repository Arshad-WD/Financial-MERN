"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Terminal, CreditCard, LayoutGrid, LogOut } from "lucide-react";

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
        { name: "Overview", href: "/dashboard", icon: Terminal },
        { name: "Transactions", href: "/dashboard/transactions", icon: CreditCard },
        { name: "Accounts", href: "/dashboard/accounts", icon: LayoutGrid },
    ];

    return (
        <div className="min-h-screen bg-black text-foreground flex flex-col font-mono selection:bg-[#a3e635] selection:text-black">
            {/* Top Omni-Bar Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-[#1f2937] bg-black">
                <div className="flex h-14 items-center px-4 max-w-[1600px] mx-auto w-full">
                    {/* Brand */}
                    <div className="flex items-center gap-2 mr-8">
                        <div className="w-5 h-5 bg-white flex items-center justify-center">
                            <span className="text-black font-extrabold text-xs">//</span>
                        </div>
                        <span className="font-bold tracking-tight uppercase text-sm">FinTerminal</span>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex items-center gap-6 text-sm font-medium">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`transition-colors uppercase tracking-widest text-xs flex items-center gap-1.5 ${
                                        isActive 
                                            ? "text-white" 
                                            : "text-gray-500 hover:text-white"
                                    }`}
                                >
                                    {isActive && <div className="w-1.5 h-1.5 bg-[#f43f5e] inline-block rounded-full animate-pulse" />}
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile / Access */}
                    <div className="ml-auto flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest bg-[#0a0a0a] px-2 py-1 border border-[#1f2937]">
                            <span className="w-2 h-2 rounded-full bg-[#a3e635]"></span>
                            ID: {user?.role}
                        </div>
                        <button
                            onClick={logout}
                            className="text-gray-500 hover:text-white transition-colors"
                            aria-label="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 pb-20">
                {children}
            </main>
        </div>
    );
}
