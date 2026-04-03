"use client";

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Plus, Wallet, CreditCard, Landmark, PiggyBank, Briefcase, Download } from 'lucide-react';
import { downloadCSV } from '@/lib/export';

interface Account {
    id: string;
    name: string;
    type: string;
    balance: number;
}

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await api.get('/accounts');
                if (res.data.success) {
                    setAccounts(res.data.data);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load accounts.');
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'BANK': return <Landmark className="w-5 h-5 text-blue-400" />;
            case 'CREDIT_CARD': return <CreditCard className="w-5 h-5 text-purple-400" />;
            case 'SAVINGS': return <PiggyBank className="w-5 h-5 text-emerald-400" />;
            case 'INVESTMENT': return <Briefcase className="w-5 h-5 text-amber-400" />;
            default: return <Wallet className="w-5 h-5 text-gray-400" />;
        }
    };

    const getGradient = (type: string) => {
        switch (type) {
            case 'BANK': return 'from-blue-900/40 to-blue-900/10 border-blue-800/30';
            case 'CREDIT_CARD': return 'from-purple-900/40 to-purple-900/10 border-purple-800/30';
            case 'SAVINGS': return 'from-emerald-900/40 to-emerald-900/10 border-emerald-800/30';
            case 'INVESTMENT': return 'from-amber-900/40 to-amber-900/10 border-amber-800/30';
            default: return 'from-gray-900/40 to-gray-900/10 border-gray-800/30';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[#ededed]">Accounts</h1>
                    <p className="text-sm text-gray-400">Manage your connected bank accounts and credit cards.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => downloadCSV(accounts.map(acc => ({
                            Name: acc.name,
                            Type: acc.type,
                            Balance: acc.balance
                        })), 'Accounts')}
                        className="bg-[#111] hover:bg-[#1a1a1a] text-gray-300 border border-[#222] px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 active:scale-95 group"
                    >
                        <Download className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                        Export
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)] group">
                        <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                        Add Account
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-red-900/20 border border-red-900/50 text-red-400 text-sm font-medium">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[140px] rounded-2xl bg-[#111] animate-pulse border border-[#222]"></div>
                    ))}
                </div>
            ) : accounts.length === 0 ? (
                <div className="clean-card p-12 text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#111] border border-[#222] rounded-xl flex items-center justify-center mb-4">
                        <Wallet className="w-6 h-6 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-bold text-[#ededed]">No accounts found</h3>
                    <p className="text-sm text-gray-400 mt-1 max-w-sm">Connect a bank account or credit card to start tracking your finances automatically.</p>
                    <button className="mt-6 bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Link your first account
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accounts.map((acc) => (
                        <div key={acc.id} className={`clean-card p-6 bg-gradient-to-br ${getGradient(acc.type)} hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden group`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="p-2.5 bg-[#0a0a0a]/80 backdrop-blur-sm border border-[#222] rounded-xl">
                                    {getIcon(acc.type)}
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 bg-[#0a0a0a]/50 px-2 py-1 rounded-md border border-[#222]">
                                    {acc.type.replace('_', ' ')}
                                </span>
                            </div>
                            
                            <div className="relative z-10">
                                <p className="text-sm text-gray-400 font-medium mb-1">{acc.name}</p>
                                <h3 className="text-2xl font-bold text-[#ededed]">
                                    ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
