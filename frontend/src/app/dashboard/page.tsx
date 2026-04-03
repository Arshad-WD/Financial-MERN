"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

// Mock data to visualize the soft graph
const generateMockTrends = () => {
    return Array.from({ length: 30 }).map((_, i) => ({
        name: `Day ${i + 1}`,
        income: Math.floor(Math.random() * 800) + 2000,
        expense: Math.floor(Math.random() * 500) + 800,
    }));
};

export default function DashboardOverview() {
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [trends] = useState(generateMockTrends());

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await api.get('/dashboard/summary');
                if (res.data.success) setSummary(res.data.data);
            } catch (err) {
                console.error("Failed to fetch dashboard summary", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) {
        return (
            <div className="flex w-full h-full min-h-[400px] items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
            </div>
        );
    }

    const StatCard = ({ title, value, type, trend }: any) => {
        const isUp = trend > 0;
        return (
            <div className="clean-card p-6 flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-lg cursor-default">
                {/* Subtle gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <p className="text-slate-500 font-medium text-sm">{title}</p>
                    <div className={`p-2 rounded-lg transition-colors ${type === 'net' ? 'bg-blue-50 group-hover:bg-blue-100 text-blue-600' : type === 'income' ? 'bg-emerald-50 group-hover:bg-emerald-100 text-emerald-600' : 'bg-red-50 group-hover:bg-red-100 text-red-600'}`}>
                        <DollarSign className="w-4 h-4" />
                    </div>
                </div>
                <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight relative z-10">
                    ${value?.toLocaleString() || '0.00'}
                </h3>
                <div className="mt-4 flex items-center text-sm relative z-10">
                    <span className={`flex items-center font-semibold ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                        {isUp ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {Math.abs(trend)}%
                    </span>
                    <span className="text-slate-400 ml-2">vs last month</span>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
                {/* Decorative background geometry */}
                <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        Good morning — your finances are looking solid!
                    </h1>
                    <p className="text-blue-100 max-w-xl">
                        You have received ${summary?.totalIncome?.toLocaleString() || '0'} in income over the trackable period. Check your detailed cash flow below.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Balance" value={summary?.netBalance} type="net" trend={12.5} />
                <StatCard title="Income Volume" value={summary?.totalIncome} type="income" trend={8.2} />
                <StatCard title="Expense Volume" value={summary?.totalExpenses} type="expense" trend={-2.4} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Graph Area */}
                <div className="lg:col-span-2 clean-card p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-base font-semibold text-slate-800">Cash Flow</h3>
                    </div>
                    <div className="flex-1 w-full h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expense" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Transactions List */}
                <div className="clean-card flex flex-col overflow-hidden max-h-[440px]">
                    <div className="p-5 border-b border-border bg-slate-50/50">
                        <h3 className="text-base font-semibold text-slate-800">Recent Activity</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {summary?.recentTransactions?.length ? (
                            <div className="divide-y divide-border">
                                {summary.recentTransactions.map((tx: any) => (
                                    <div key={tx.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center text-sm">
                                        <div>
                                            <p className="font-semibold text-slate-700">{tx.description || 'Unknown'}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{new Date(tx.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className={`font-bold ${tx.category?.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-700'}`}>
                                            {tx.category?.type === 'INCOME' ? '+' : '-'}${tx.amount.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500 text-sm p-6 text-center">
                                No recent activity found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
