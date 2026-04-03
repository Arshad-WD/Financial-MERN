"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import { Mail, Lock, ArrowRight, ShieldCheck, User } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth(); // Use login to automatically log them in after registration

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/register', { name, email, password });
            if (res.data.success) {
                // If the backend returns user and token upon registration (like login), we log them in
                // If it doesn't return a token, we could redirect to login instead. Assuming it returns token:
                if (res.data.data?.token) {
                    login(res.data.data.token, res.data.data.user);
                } else {
                    // Fallback login
                    const loginRes = await api.post('/auth/login', { email, password });
                    login(loginRes.data.data.token, loginRes.data.data.user);
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.error?.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-[128px] animate-pulse delay-1000 pointer-events-none" />

            <div className="w-full max-w-md p-8 glass-card z-10 mx-4">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner glass-gradient">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Create Account</h1>
                    <p className="text-muted-foreground">Join the financial command center</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-background/50 border border-border rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-sm"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-background/50 border border-border rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-sm"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-background/50 border border-border rounded-lg py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full relative group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 mt-6 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <div className="relative flex items-center justify-center gap-2">
                            {loading ? 'Creating Account...' : 'Register'}
                            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </div>
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                    Already have an account? <Link href="/login" className="text-primary hover:underline font-semibold ml-1">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
