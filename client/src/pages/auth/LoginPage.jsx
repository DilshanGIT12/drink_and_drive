import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Lock, Loader2, ShieldCheck, ChevronRight, ArrowLeft } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const LoginPage = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error, clearError, isAuthenticated, user } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            if (user.role === 'customer') navigate('/customer/dashboard');
            else if (user.role === 'driver') navigate('/driver/radar');
            else if (user.role === 'admin') navigate('/admin/dashboard');
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(phoneNumber, password);
        } catch (err) {}
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 font-sans relative overflow-hidden">
            {/* Background Image with Cinematic Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/colombo_night_luxury_ride_1778020489434.png" 
                    alt="Colombo Night" 
                    className="w-full h-full object-cover opacity-20 scale-110 blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent"></div>
            </div>

            <Link to="/" className="absolute top-10 left-10 z-20 flex items-center space-x-2 text-gray-500 hover:text-white transition-all group">
                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Return Base</span>
            </Link>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-[#0d0d0d]/60 backdrop-blur-3xl border border-white/5 p-12 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative z-10"
            >
                <div className="text-center mb-12">
                    <motion.div 
                        initial={{ scale: 0.8, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-20 h-20 bg-accent rounded-[2rem] mx-auto flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(250,204,21,0.2)]"
                    >
                        <ShieldCheck size={48} className="text-black" />
                    </motion.div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">DRIVE<span className="text-accent">SAFE</span></h1>
                    <p className="text-gray-500 font-bold text-[8px] uppercase tracking-[0.5em] mt-4">Authorized Personnel Only</p>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-8 text-[10px] flex justify-between items-center font-black uppercase tracking-widest">
                        <span>{error}</span>
                        <button onClick={clearError} className="p-1 hover:bg-red-500/10 rounded-lg">✕</button>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="group">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] ml-1 group-focus-within:text-accent transition-colors">Access Terminal</label>
                        <div className="relative mt-2">
                            <Phone size={28} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-accent transition-colors" />
                            <input 
                                type="tel" 
                                required
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 text-white pl-16 pr-8 py-6 rounded-[2rem] focus:outline-none focus:border-accent/40 focus:bg-white/[0.08] transition-all font-black text-lg placeholder:text-gray-800"
                                placeholder="07XXXXXXXX"
                            />
                        </div>
                    </div>

                    <div className="group">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] ml-1 group-focus-within:text-accent transition-colors">Security Key</label>
                        <div className="relative mt-2">
                            <Lock size={28} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-accent transition-colors" />
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 text-white pl-16 pr-8 py-6 rounded-[2rem] focus:outline-none focus:border-accent/40 focus:bg-white/[0.08] transition-all font-black text-lg placeholder:text-gray-800"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-accent hover:bg-white text-black font-black py-7 rounded-[2rem] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-4 shadow-2xl shadow-accent/20 group"
                    >
                        {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (
                            <>
                                <span className="tracking-[0.3em] uppercase text-xs italic">Initialize Login</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-16 text-center">
                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em]">
                        No Credentials? <Link to="/register" className="text-accent hover:text-white transition-colors ml-2 border-b border-accent/30 pb-1">Establish Link</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
