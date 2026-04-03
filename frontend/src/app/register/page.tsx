"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/register', { name, email, password });
            if (res.data.success) {
                if (res.data.data?.token) {
                    login(res.data.data.token, res.data.data.user);
                } else {
                    const loginRes = await api.post('/auth/login', { email, password });
                    login(loginRes.data.data.token, loginRes.data.data.user);
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center font-sans p-4 relative z-10 w-full">
            <div className="w-full max-w-[400px] clean-card p-8 md:p-10 relative bg-[#0a0a0a]/80 backdrop-blur-xl border border-[#222]">
                
                <div className="flex justify-center mb-8">
                    <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <span className="text-blue-400 font-bold text-xl tracking-tight">F</span>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-[#ededed] mb-1">Create an account</h1>
                    <p className="text-sm text-gray-400">Enter your details to get started</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5 bg">
                        <label className="text-sm font-semibold text-gray-300">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#111] border border-[#333] text-[#ededed] rounded-lg py-2.5 px-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-300">Email address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#111] border border-[#333] text-[#ededed] rounded-lg py-2.5 px-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm"
                            placeholder="you@company.com"
                            required
                        />
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#111] border border-[#333] text-[#ededed] rounded-lg py-2.5 px-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm py-2.5 px-4 rounded-lg transition-colors shadow-[0_0_15px_rgba(59,130,246,0.2)] disabled:opacity-50 mt-6 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                        {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
                    </button>
                </form>

                <div className="mt-8 text-sm text-center text-gray-500">
                    Already have an account? <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold ml-1">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
