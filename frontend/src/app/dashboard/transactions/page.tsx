"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Plus, Search, Filter, ArrowUpRight, ArrowDownLeft, Calendar, Tag, CreditCard, SearchX, Download } from "lucide-react";
import { downloadCSV } from "@/lib/export";
import clsx from "clsx";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchTxs = async () => {
            try {
                const res = await api.get('/transactions');
                if (res.data.success) {
                    setTransactions(res.data.data);
                }
            } catch (err) {
                console.error("Failed to load transactions.");
            } finally {
                setLoading(false);
            }
        };
        fetchTxs();
    }, []);

    const filteredTxs = transactions.filter(tx => 
        tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#0a0a0a] p-8 rounded-3xl border border-[#1a1a1a]">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter text-[#ededed]">TRANSACTIONS</h1>
                    <p className="text-sm text-gray-500 font-medium max-w-sm">
                        A complete ledger of your financial history across all connected accounts.
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => downloadCSV(filteredTxs.map(tx => ({
                            Date: new Date(tx.date).toLocaleDateString(),
                            Description: tx.description,
                            Category: tx.category?.name,
                            Type: tx.category?.type,
                            Account: tx.account?.name,
                            Amount: tx.amount
                        })), 'Transactions')}
                        className="flex-1 md:flex-none bg-[#111] hover:bg-[#1a1a1a] text-gray-300 border border-[#222] px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 group"
                    >
                        <Download className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                        Export CSV
                    </button>
                    <button className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.15)] active:scale-95 group">
                        <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                        Record Transaction
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0a0a0a] border border-[#1a1a1a] text-[#ededed] rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all placeholder:text-gray-600" 
                        placeholder="Search by description or category..."
                    />
                </div>
                <button className="flex items-center gap-2 text-sm font-bold text-gray-400 bg-[#0a0a0a] border border-[#1a1a1a] px-6 py-3.5 rounded-2xl hover:bg-[#111] hover:text-gray-200 transition-all h-full">
                    <Filter className="w-4 h-4" /> 
                    Filters
                </button>
            </div>

            {/* Table Container */}
            <div className="clean-card overflow-hidden bg-[#050505] border-[#1a1a1a] rounded-3xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#0a0a0a] text-[10px] uppercase font-black tracking-[0.15em] text-gray-500 border-b border-[#1a1a1a]">
                            <tr>
                                <th className="px-8 py-5">Activity</th>
                                <th className="px-8 py-5">Category</th>
                                <th className="px-8 py-5">Origin</th>
                                <th className="px-8 py-5 text-right">Volume</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#131313]">
                            {loading ? (
                                [1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-8 py-6">
                                            <div className="h-10 bg-[#111] rounded-xl w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredTxs.length > 0 ? (
                                filteredTxs.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-[#070707] transition-all group cursor-default">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className={clsx(
                                                    "p-2.5 rounded-xl border transition-all duration-300",
                                                    tx.category?.type === 'INCOME' 
                                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 group-hover:bg-emerald-500/20" 
                                                        : "bg-red-400/10 border-red-400/20 text-red-400 group-hover:bg-red-400/20"
                                                )}>
                                                    {tx.category?.type === 'INCOME' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-[#ededed] group-hover:text-white transition-colors">{tx.description || 'General Transaction'}</span>
                                                    <span className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                <span className="text-xs font-bold text-gray-400 group-hover:text-gray-300 transition-colors">
                                                    {tx.category?.name || 'Uncategorized'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <CreditCard className="w-3.5 h-3.5" />
                                                <span className="text-xs font-semibold tracking-tight">{tx.account?.name || 'Main Account'}</span>
                                            </div>
                                        </td>
                                        <td className={clsx(
                                            "px-8 py-5 text-right font-black tracking-tighter text-lg transition-all underline-offset-4",
                                            tx.category?.type === 'INCOME' ? "text-emerald-500 group-hover:underline" : "text-[#ededed] group-hover:text-white"
                                        )}>
                                            {tx.category?.type === 'INCOME' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="p-4 rounded-3xl bg-[#0a0a0a] border border-[#1a1a1a]">
                                                <SearchX className="w-8 h-8 text-gray-600" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[#ededed] font-bold">No transactions found</p>
                                                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                                                    We couldn't find any records matching your search criteria. Try a different term.
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => setSearchTerm("")}
                                                className="text-blue-500 hover:text-blue-400 font-bold text-sm transition-colors"
                                            >
                                                Clear Search
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
