"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Plus, Search } from "lucide-react";

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
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight uppercase">Transactions</h1>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Master Ledger Registry</p>
                </div>
                <button className="bg-white hover:bg-gray-200 text-black px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" />
                    New Entry
                </button>
            </div>

            <div className="border border-[#1f2937] bg-[#050505]">
                <div className="p-4 border-b border-[#1f2937] flex gap-4 items-center">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <input 
                            className="w-full bg-black border border-[#1f2937] text-white pl-9 pr-4 py-1.5 text-sm font-mono focus:outline-none focus:border-white transition-colors" 
                            placeholder="SEARCH/QUERY..."
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left font-mono">
                        <thead className="text-[10px] uppercase bg-black text-gray-500 border-b border-[#1f2937]">
                            <tr>
                                <th className="px-6 py-3 font-semibold tracking-widest">Date</th>
                                <th className="px-6 py-3 font-semibold tracking-widest">Description</th>
                                <th className="px-6 py-3 font-semibold tracking-widest">Category</th>
                                <th className="px-6 py-3 font-semibold tracking-widest">Account</th>
                                <th className="px-6 py-3 font-semibold tracking-widest text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 uppercase tracking-widest text-xs">
                                        [ FETCHING LEDGER ]
                                    </td>
                                </tr>
                            ) : transactions.length > 0 ? (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="border-b border-[#1f2937] hover:bg-[#0a0a0a] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-medium text-white">{tx.description || tx.merchant || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-[#1f2937] text-[10px] uppercase tracking-widest">
                                                {tx.category?.name || 'UNCATEGORIZED'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs uppercase">{tx.account?.name || 'UNKNOWN'}</td>
                                        <td className={`px-6 py-4 text-right ${tx.category?.type === 'INCOME' ? 'text-[#a3e635]' : 'text-gray-400'}`}>
                                            {tx.category?.type === 'INCOME' ? '+' : '-'}${tx.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 uppercase tracking-widest text-xs">
                                        No records found.
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
