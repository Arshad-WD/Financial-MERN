"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { ArrowRight, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
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
            const res = await api.post('/auth/login', { email, password });
            if (res.data.success) {
                login(res.data.data.token, res.data.data.user);
            }
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'AUTHORIZATION_FAILED');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono selection:bg-[#a3e635] selection:text-black p-4">
            <div className="w-full max-w-md border border-[#1f2937] bg-[#050505] p-8 md:p-10 relative">
                {/* Decorative Terminal Header */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#a3e635]" />
                
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-8 h-8 bg-white flex items-center justify-center text-black">
                        <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight uppercase text-white">FinTerminal</h1>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">SYSTEM_LOGIN_REQ</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-3 border border-[#f43f5e] bg-[#f43f5e]/10 text-[#f43f5e] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#f43f5e] inline-block animate-pulse" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Identity</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border border-[#1f2937] text-white py-3 px-4 outline-none focus:border-white transition-colors text-sm placeholder:text-[#1f2937]"
                            placeholder="user@system.com"
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Passcode</label>
                            <Link href="#" className="text-[10px] text-gray-600 hover:text-white uppercase tracking-widest hover:underline">Reset?</Link>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border border-[#1f2937] text-white py-3 px-4 outline-none focus:border-white transition-colors text-sm placeholder:text-[#1f2937]"
                            placeholder="********"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white hover:bg-gray-200 text-black font-bold uppercase tracking-widest text-xs py-4 px-4 transition-colors disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
                    >
                        {loading ? 'AUTHENTICATING...' : 'INITIALIZE_SESSION'}
                        {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-[#1f2937] text-xs text-gray-500 uppercase tracking-widest text-center">
                    New Operator? <Link href="/register" className="text-white hover:underline font-bold ml-1">Register</Link>
                </div>
            </div>
            
            <div className="mt-8 flex gap-4 text-[10px] text-gray-600 uppercase tracking-widest">
                <span>V1.0.0</span>
                <span>//</span>
                <span>SECURE_CONNECTION_ONLY</span>
            </div>
        </div>
    );
}
