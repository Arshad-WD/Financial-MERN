"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";

// Mock data strictly to visualize the neo-brutalist chart
const generateMockTrends = () => {
    return Array.from({ length: 15 }).map((_, i) => ({
        name: `D${i + 1}`,
        value: Math.floor(Math.random() * 5000) + 1000,
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
            <div className="flex h-full items-center justify-center font-mono text-xs text-gray-500 uppercase tracking-widest">
                [ INITIALIZING SYSTEM ]
            </div>
        );
    }

    const StatBlock = ({ title, value, type }: any) => (
        <div className="p-6 border border-[#1f2937] hover:border-gray-500 transition-colors bg-[#050505]">
            <p className="text-gray-500 uppercase tracking-widest text-xs mb-4">{title}</p>
            <h3 className={`text-4xl lg:text-5xl font-bold tracking-tighter ${type === 'net' ? 'text-white' : type === 'income' ? 'text-[#a3e635]' : 'text-[#f43f5e]'}`}>
                ${value?.toLocaleString() || '0.00'}
            </h3>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Top Stat Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#1f2937] bg-black">
                <div className="md:border-r border-[#1f2937]">
                    <StatBlock title="Net Liquidity" value={summary?.netBalance} type="net" />
                </div>
                <div className="md:border-r border-[#1f2937]">
                    <StatBlock title="Total Volume (IN)" value={summary?.totalIncome} type="income" />
                </div>
                <div>
                    <StatBlock title="Total Volume (OUT)" value={summary?.totalExpenses} type="expense" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Full Bleed Graph Area */}
                <div className="lg:col-span-2 border border-[#1f2937] bg-[#050505] flex flex-col relative overflow-hidden">
                     <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#a3e635] animate-pulse" />
                        <span className="text-xs text-gray-400 font-mono uppercase tracking-widest">Live Flow</span>
                    </div>
                    <div className="flex-1 w-full h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trends}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#a3e635" stopOpacity={0.15}/>
                                    <stop offset="100%" stopColor="#a3e635" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" hide />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #1f2937', borderRadius: '0', color: '#fff', fontSize: '12px' }}
                                    itemStyle={{ color: '#a3e635' }}
                                />
                                <Area type="step" dataKey="value" stroke="#a3e635" strokeWidth={1} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Dense Transaction Registry */}
                <div className="border border-[#1f2937] bg-[#050505] flex flex-col h-[400px] overflow-hidden">
                    <div className="p-4 border-b border-[#1f2937] bg-[#0a0a0a]">
                        <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold">Transaction Registry</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {summary?.recentTransactions?.length ? (
                            <div className="divide-y divide-[#1f2937]">
                                {summary.recentTransactions.map((tx: any) => (
                                    <div key={tx.id} className="p-4 hover:bg-[#0a0a0a] transition-colors flex justify-between items-center text-sm">
                                        <div className="font-mono">
                                            <p className="text-white mb-1">{tx.description || 'N/A'}</p>
                                            <p className="text-[10px] text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className={`font-mono text-right ${tx.category?.type === 'INCOME' ? 'text-[#a3e635]' : 'text-gray-400'}`}>
                                            {tx.category?.type === 'INCOME' ? '+' : '-'}${tx.amount.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-xs text-gray-600 uppercase tracking-widest font-mono p-4 text-center">
                                No records located
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
