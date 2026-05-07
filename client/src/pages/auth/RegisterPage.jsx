import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Lock, User as UserIcon, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        password: '',
        role: 'customer'
    });
    const { register, loading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await register(formData);
            if (user.role === 'customer') navigate('/customer/dashboard');
            else navigate('/driver/radar');
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
                <span className="text-[10px] font-black uppercase tracking-widest">Abort Mission</span>
            </Link>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-[#0d0d0d]/60 backdrop-blur-3xl border border-white/5 p-12 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-black shadow-lg">
                            <ShieldCheck size={40} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Establish <span className="text-accent">Identity</span></h1>
                    <p className="text-gray-500 mt-3 text-[9px] font-black uppercase tracking-[0.4em]">Initialize Your Operational Profile</p>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-8 text-[10px] flex justify-between items-center font-black uppercase tracking-widest">
                        <span>{error}</span>
                        <button onClick={clearError} className="p-1 hover:bg-red-500/10 rounded-lg">✕</button>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <label className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] ml-1 group-focus-within:text-accent transition-colors">Full Name</label>
                            <div className="relative mt-2">
                                <UserIcon size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-accent" />
                                <input 
                                    type="text" 
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 text-white pl-14 pr-6 py-4 rounded-[1.5rem] focus:outline-none focus:border-accent/40 focus:bg-white/[0.08] transition-all font-bold text-sm"
                                    placeholder="Operator Name"
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] ml-1 group-focus-within:text-accent transition-colors">Contact Terminal</label>
                            <div className="relative mt-2">
                                <Phone size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-accent" />
                                <input 
                                    type="tel" 
                                    required
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 text-white pl-14 pr-6 py-4 rounded-[1.5rem] focus:outline-none focus:border-accent/40 focus:bg-white/[0.08] transition-all font-bold text-sm"
                                    placeholder="07XXXXXXXX"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="group">
                        <label className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] ml-1 group-focus-within:text-accent transition-colors">Security Key</label>
                        <div className="relative mt-2">
                            <Lock size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-accent" />
                            <input 
                                type="password" 
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 text-white pl-14 pr-6 py-4 rounded-[1.5rem] focus:outline-none focus:border-accent/40 focus:bg-white/[0.08] transition-all font-bold text-sm"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em] ml-1">Select Assignment</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, role: 'customer'})}
                                className={`py-4 rounded-2xl border font-black text-[9px] tracking-widest transition-all ${formData.role === 'customer' ? 'bg-accent text-black border-accent' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'}`}
                            >
                                MISSION CLIENT
                            </button>
                            <button 
                                type="button"
                                onClick={() => setFormData({...formData, role: 'driver'})}
                                className={`py-4 rounded-2xl border font-black text-[9px] tracking-widest transition-all ${formData.role === 'driver' ? 'bg-accent text-black border-accent' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'}`}
                            >
                                ELITE PILOT
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-accent hover:bg-white text-black font-black py-6 rounded-[1.5rem] mt-6 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-3 shadow-2xl"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <span className="tracking-[0.3em] uppercase text-[10px] italic">Finalize Registration</span>}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.2em]">
                        Existing Operator? <Link to="/login" className="text-accent hover:text-white transition-colors ml-2 font-black border-b border-accent/30 pb-0.5">Login Terminal</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
