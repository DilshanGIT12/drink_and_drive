import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Star, TrendingUp, Target, Award, Zap, BarChart3, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const DriverPerformance = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const stats = [
        { label: 'Pilot Rating', value: '4.92', icon: <Star className="text-accent" />, color: 'text-accent' },
        { label: 'Acceptance Rate', value: '98%', icon: <Target className="text-green-500" />, color: 'text-green-500' },
        { label: 'Tactical Points', value: user?.points || 0, icon: <Zap className="text-blue-500" />, color: 'text-blue-500' },
        { label: 'Weekly Earnings', value: 'LKR 42.5K', icon: <TrendingUp className="text-accent" />, color: 'text-accent' }
    ];

    const badges = [
        { name: 'Rookie Pilot', pts: 0, color: 'bg-gray-700', desc: 'Starting your journey as a safe driver.' },
        { name: 'Pro Navigator', pts: 250, color: 'bg-blue-600', desc: 'Proven reliability and mapping skills.' },
        { name: 'Elite Captain', pts: 750, color: 'bg-purple-600', desc: 'Commanding high respect and top ratings.' },
        { name: 'Legendary Ace', pts: 2000, color: 'bg-accent text-black', desc: 'The absolute master of the DriveSafe terminal.' }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans relative overflow-y-auto">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10"></div>
            
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-16">
                    <button onClick={() => navigate('/driver/radar')} className="flex items-center space-x-2 text-gray-500 hover:text-accent transition-colors group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Back to Radar</span>
                    </button>
                    <div className="text-right">
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Pilot <span className="text-accent">Performance</span></h1>
                        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-1">Tactical Analysis Hub</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-[#111] p-8 rounded-[2.5rem] border border-white/[0.03] relative group">
                            <div className="mb-4">{stat.icon}</div>
                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{stat.label}</p>
                            <p className={`text-2xl font-black italic mt-1 ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                        {/* Status Progression */}
                        <div className="bg-[#111] p-10 rounded-[3.5rem] border border-white/[0.03]">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h3 className="text-2xl font-black italic tracking-tighter uppercase">Current <span className="text-accent">Designation</span></h3>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Status: {user?.badge || 'Rookie Pilot'}</p>
                                </div>
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl ${
                                    user?.badge === 'Legendary Ace' ? 'bg-accent text-black' : 
                                    user?.badge === 'Elite Captain' ? 'bg-purple-600 text-white' : 
                                    user?.badge === 'Pro Navigator' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'
                                }`}>
                                    <Award size={32} />
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                                    <span>Rank Progression</span>
                                    <span>{user?.points || 0} Total Points</span>
                                </div>
                                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <motion.div 
                                        initial={{ width: 0 }} 
                                        animate={{ width: `${Math.min((user?.points / 2000) * 100, 100)}%` }}
                                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-accent shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Badge Gallery */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {badges.map((badge, idx) => {
                                const isUnlocked = (user?.points || 0) >= badge.pts;
                                return (
                                    <div key={idx} className={`p-8 rounded-[2.5rem] border transition-all ${isUnlocked ? 'bg-[#111] border-white/10' : 'bg-[#0a0a0a] border-white/[0.02] opacity-40'}`}>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${badge.color}`}>
                                                {isUnlocked ? <ShieldCheck size={24} /> : <Award size={24} className="text-gray-600" />}
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Requirement</p>
                                                <p className="text-sm font-black italic">{badge.pts} PTS</p>
                                            </div>
                                        </div>
                                        <h4 className="text-xl font-black uppercase italic mb-2">{badge.name}</h4>
                                        <p className="text-[10px] text-gray-600 font-bold leading-relaxed">{badge.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-[#111] p-10 rounded-[3.5rem] border border-white/[0.03]">
                            <h3 className="text-xl font-black italic tracking-tighter uppercase mb-8">Performance <span className="text-accent">Intel</span></h3>
                            <div className="space-y-6">
                                <IntelItem label="Wait Time Penalty" value="Low" status="good" />
                                <IntelItem label="Safety Compliance" value="Perfect" status="good" />
                                <IntelItem label="Cancellation Rate" value="0.02%" status="good" />
                                <IntelItem label="Peak Availability" value="Moderate" status="avg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const IntelItem = ({ label, value, status }) => (
    <div className="flex justify-between items-center">
        <div>
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{label}</p>
            <p className="text-sm font-black italic">{value}</p>
        </div>
        <div className={`w-2 h-2 rounded-full ${status === 'good' ? 'bg-green-500' : 'bg-accent'} shadow-[0_0_10px_currentColor]`} />
    </div>
);

export default DriverPerformance;
