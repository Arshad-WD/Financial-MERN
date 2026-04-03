"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Wallet, ArrowUpRight, ArrowDownLeft, Activity, Download } from "lucide-react";
import { downloadCSV } from "@/lib/export";

// Mock data to visualize the soft graph
const generateMockTrends = () => {
    return Array.from({ length: 30 }).map((_, i) => ({
        name: `${i + 1}`,
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
            <div className="flex w-full h-[60vh] items-center justify-center">
                <div className="w-10 h-10 rounded-full border-2 border-[#222] border-t-blue-500 animate-spin" />
            </div>
        );
    }

    const StatCard = ({ title, value, type, trend, icon: Icon }: any) => {
        const isUp = trend > 0;
        const colorClass = type === 'net' ? 'text-blue-500' : type === 'income' ? 'text-emerald-500' : 'text-red-400';
        const bgClass = type === 'net' ? 'bg-blue-500/10 border-blue-500/20' : type === 'income' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-400/10 border-red-400/20';

        return (
            <div className="clean-card p-6 relative overflow-hidden group hover:border-[#333] transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
                        <h3 className="text-3xl font-bold text-[#ededed] tracking-tight">
                            ${(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className={`p-2.5 rounded-xl border ${bgClass} ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                    <span className={`flex items-center font-bold ${isUp ? 'text-emerald-500' : 'text-red-400'}`}>
                        {isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                        {Math.abs(trend)}%
                    </span>
                    <span className="text-gray-500 font-medium">vs last period</span>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
            {/* Premium Welcome Hero */}
            <div className="relative p-8 rounded-3xl bg-[#0a0a0a] border border-[#222] overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-transparent opacity-50"></div>
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full group-hover:bg-blue-600/20 transition-all duration-700"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                            <Activity className="w-3 h-3" />
                            Financial Health: Solid
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#ededed]">
                            Balance Breakdown
                        </h1>
                        <p className="text-gray-400 max-w-lg leading-relaxed">
                            You've managed <span className="text-[#ededed] font-semibold">${summary?.totalIncome?.toLocaleString() || '0'}</span> in total income. Here's a pulse check of your current cash flow.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => downloadCSV(summary?.recentTransactions?.map((tx: any) => ({
                                Date: new Date(tx.date).toLocaleDateString(),
                                Description: tx.description,
                                Category: tx.category?.name,
                                Amount: tx.amount
                            })), 'Dashboard_Summary')}
                            className="bg-[#111] hover:bg-[#1a1a1a] text-gray-300 border border-[#222] px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 active:scale-95 group"
                        >
                            <Download className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                            Export Data
                        </button>
                        <button className="bg-white hover:bg-gray-100 text-black px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95">
                            Refresh Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Wealth" value={summary?.netBalance} type="net" trend={12.5} icon={Wallet} />
                <StatCard title="Total Revenue" value={summary?.totalIncome} type="income" trend={8.2} icon={ArrowUpRight} />
                <StatCard title="Total Spent" value={summary?.totalExpenses} type="expense" trend={-2.4} icon={ArrowDownLeft} />
            </div>

            {/* Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cash Flow Chart */}
                <div className="lg:col-span-2 clean-card p-6 flex flex-col group">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-[#ededed]">Cash Flow Trends</h3>
                            <p className="text-xs text-gray-500 mt-1">Daily income vs expense performance</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="text-xs text-gray-400 font-medium tracking-tight">Income</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-xs text-gray-400 font-medium tracking-tight">Expense</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 w-full h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1a1a1a" />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#444" 
                                    tick={{fill: '#666', fontSize: 11, fontWeight: 500}} 
                                    axisLine={false} 
                                    tickLine={false} 
                                    dy={10}
                                />
                                <YAxis 
                                    stroke="#444" 
                                    tick={{fill: '#666', fontSize: 11, fontWeight: 500}} 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tickFormatter={(val) => `$${val}`} 
                                />
                                <Tooltip 
                                    cursor={{ stroke: '#333', strokeWidth: 1 }}
                                    contentStyle={{ 
                                        backgroundColor: '#0a0a0a', 
                                        border: '1px solid #222', 
                                        borderRadius: '12px', 
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
                                        padding: '12px'
                                    }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    labelStyle={{ color: '#666', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="income" 
                                    stroke="#10b981" 
                                    strokeWidth={3} 
                                    fillOpacity={1} 
                                    fill="url(#colorIncome)"
                                    animationDuration={2000}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="expense" 
                                    stroke="#3b82f6" 
                                    strokeWidth={3} 
                                    fillOpacity={1} 
                                    fill="url(#colorExpense)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Transactions Feed */}
                <div className="clean-card flex flex-col group h-full">
                    <div className="p-6 border-b border-[#222] flex justify-between items-center">
                        <h3 className="text-base font-bold text-[#ededed]">Recent Activity</h3>
                        <Activity className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 overflow-y-auto px-2">
                        {summary?.recentTransactions?.length ? (
                            <div className="space-y-1 py-3">
                                {summary.recentTransactions.slice(0, 8).map((tx: any) => (
                                    <div key={tx.id} className="p-3 hover:bg-[#111] border border-transparent hover:border-[#222] rounded-xl transition-all flex justify-between items-center group/item text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${tx.category?.type === 'INCOME' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-400'}`}>
                                                <DollarSign className="w-3.5 h-3.5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#ededed] group-hover/item:text-white transition-colors">{tx.description || 'Unknown'}</p>
                                                <p className="text-[10px] uppercase font-bold tracking-tight text-gray-600 mt-0.5">{new Date(tx.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className={`font-black tracking-tight ${tx.category?.type === 'INCOME' ? 'text-emerald-500' : 'text-gray-300'}`}>
                                            {tx.category?.type === 'INCOME' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                <div className="w-12 h-12 bg-gray-500/5 rounded-2xl flex items-center justify-center mb-3">
                                    <Activity className="w-6 h-6 text-gray-600" />
                                </div>
                                <p className="text-gray-500 text-xs font-semibold uppercase tracking-tight">No data available yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
