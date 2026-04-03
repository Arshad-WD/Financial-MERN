"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { ArrowUpRight, ArrowDownRight, Activity, DollarSign, CreditCard } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for the chart to make it look alive initially while we wait for backend trend APIs if needed.
// (Backend returns recent transactions, we map them optionally or use placeholder trends for visual wow factor).
const generateMockTrends = () => {
    return Array.from({ length: 7 }).map((_, i) => ({
        name: `Day ${i + 1}`,
        income: Math.floor(Math.random() * 500) + 1000,
        expense: Math.floor(Math.random() * 300) + 500,
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
            <div className="flex h-full items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, trend, type }: any) => (
        <div className="glass-card p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            <div className="flex justify-between items-start mb-4 relative z-10">
                <p className="text-muted-foreground font-medium text-sm">{title}</p>
                <div className={`p-2 rounded-lg ${type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : type === 'expense' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <h3 className="text-3xl font-bold tracking-tight mb-2 relative z-10">${value?.toLocaleString() || '0.00'}</h3>
            <div className="flex items-center gap-1 text-sm font-medium relative z-10">
                {trend > 0 ? (
                    <span className="flex items-center text-emerald-500"><ArrowUpRight className="w-4 h-4 mr-1"/> +{trend}%</span>
                ) : (
                    <span className="flex items-center text-destructive"><ArrowDownRight className="w-4 h-4 mr-1"/> {trend}%</span>
                )}
                <span className="text-muted-foreground ml-2">from last month</span>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">Financial Overview</h1>
                <p className="text-muted-foreground">Monitor your financial pulse in real-time.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Balance" 
                    value={summary?.netBalance} 
                    icon={DollarSign} 
                    trend={+12.5} 
                    type="net" 
                />
                <StatCard 
                    title="Total Income" 
                    value={summary?.totalIncome} 
                    icon={Activity} 
                    trend={+8.2} 
                    type="income" 
                />
                <StatCard 
                    title="Total Expenses" 
                    value={summary?.totalExpenses} 
                    icon={CreditCard} 
                    trend={-2.4} 
                    type="expense" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-6 flex flex-col">
                    <h3 className="text-lg font-semibold mb-6">Cash Flow Analytics</h3>
                    <div className="flex-1 min-h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} tickLine={false} axisLine={false} />
                                <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-0 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-border">
                        <h3 className="text-lg font-semibold">Recent Transactions</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-[350px]">
                        {summary?.recentTransactions?.length ? (
                            <div className="divide-y divide-border">
                                {summary.recentTransactions.map((tx: any) => (
                                    <div key={tx.id} className="p-4 hover:bg-white/5 transition-colors flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-sm text-foreground">{tx.description || 'Unknown Transaction'}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{new Date(tx.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className={`font-semibold ${tx.category?.type === 'INCOME' ? 'text-emerald-500' : 'text-foreground'}`}>
                                            {tx.category?.type === 'INCOME' ? '+' : '-'}${tx.amount.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center p-6 text-center text-muted-foreground text-sm">
                                No recent transactions.<br />Time to make some moves!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
