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
                // Adjusting to a likely backend route; or keeping it simple
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                    <p className="text-muted-foreground">Detailed history of all your financial movements.</p>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-glass shadow-primary/20 flex items-center gap-2 transition-colors">
                    <Plus className="w-5 h-5" />
                    New Transaction
                </button>
            </div>

            <div className="glass-card shadow-glass border border-border">
                <div className="p-4 border-b border-border flex gap-4 items-center bg-white/[0.02]">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input 
                            className="w-full bg-background border border-border rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50" 
                            placeholder="Search transactions..."
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-md text-sm font-medium hover:bg-white/5 transition-colors">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-white/[0.02] text-muted-foreground border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Description</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Account</th>
                                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        Loading transactions...
                                    </td>
                                </tr>
                            ) : transactions.length > 0 ? (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="border-b border-border hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 font-medium text-foreground">{tx.description || tx.merchant || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-border text-xs">
                                                {tx.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{tx.account?.name || 'Unknown Account'}</td>
                                        <td className={`px-6 py-4 text-right font-semibold ${tx.category?.type === 'INCOME' ? 'text-emerald-500' : 'text-foreground'}`}>
                                            {tx.category?.type === 'INCOME' ? '+' : '-'}${tx.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No transactions found.
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
