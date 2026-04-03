"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Plus, Search, Filter } from "lucide-react";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#ededed]">Transactions</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and review your complete financial history.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-colors">
                    <Plus className="w-4 h-4" />
                    New Transaction
                </button>
            </div>

            <div className="clean-card overflow-hidden">
                <div className="p-4 border-b border-[#222] bg-[#0a0a0a]/50 flex gap-4 items-center">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <input 
                            className="w-full bg-[#111] border border-[#333] text-[#ededed] rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm" 
                            placeholder="Search transactions..."
                        />
                    </div>
                    <button className="flex items-center gap-2 text-sm font-semibold text-gray-400 bg-[#111] border border-[#333] px-4 py-2 rounded-lg hover:bg-[#222] transition-colors">
                        <Filter className="w-4 h-4" /> Filters
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#111] text-gray-400 border-b border-[#222] text-xs uppercase tracking-wider font-semibold">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Account</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#222]">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex justify-center">
                                            <div className="w-6 h-6 rounded-full border-2 border-[#333] border-t-blue-500 animate-spin" />
                                        </div>
                                    </td>
                                </tr>
                            ) : transactions.length > 0 ? (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-[#111] transition-colors bg-transparent">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-semibold text-[#ededed]">{tx.description || tx.merchant || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-md bg-[#222] text-gray-300 text-xs font-semibold">
                                                {tx.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">{tx.account?.name || 'Unknown'}</td>
                                        <td className={`px-6 py-4 text-right font-bold ${tx.category?.type === 'INCOME' ? 'text-emerald-500' : 'text-[#ededed]'}`}>
                                            {tx.category?.type === 'INCOME' ? '+' : '-'}${tx.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No transactions found matching your criteria.
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
