import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Target, Heart, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10"></div>
            
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-20">
                    <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-500 hover:text-accent transition-colors group">
                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Return</span>
                    </button>
                    <div className="text-right">
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic">Our <span className="text-accent">Mission</span></h1>
                        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-1">Safeguarding every journey</p>
                    </div>
                </header>

                <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                        <h2 className="text-4xl font-black italic uppercase leading-tight mb-6">Redefining <span className="text-accent">Nightlife</span> Safety</h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            DriveSafe was born from a simple yet powerful idea: no one should have to choose between a good time and a safe ride home. We connect responsible vehicle owners with elite designated drivers, ensuring you and your car get home exactly as you left—safely.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <StatCard label="Trips Completed" value="50K+" />
                            <StatCard label="Expert Drivers" value="1,200+" />
                        </div>
                    </motion.div>
                    <div className="grid grid-cols-2 gap-4">
                        <FeatureCard icon={<ShieldCheck size={32} className="text-accent" />} title="Elite Safety" desc="Every driver is background checked and skills-verified." />
                        <FeatureCard icon={<Users size={32} className="text-accent" />} title="Community" desc="Built by people who care about road safety." />
                        <FeatureCard icon={<Target size={32} className="text-accent" />} title="Precision" desc="Real-time dispatching with localized GPS radar." />
                        <FeatureCard icon={<Heart size={32} className="text-accent" />} title="Reliability" desc="24/7 support for both customers and drivers." />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value }) => (
    <div className="bg-[#111] p-6 rounded-3xl border border-white/[0.03]">
        <p className="text-3xl font-black text-white italic">{value}</p>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{label}</p>
    </div>
);

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-[#111] p-8 rounded-[2.5rem] border border-white/[0.03] hover:border-accent/20 transition-all group">
        <div className="mb-4 group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="text-sm font-black uppercase tracking-tight mb-2">{title}</h3>
        <p className="text-[10px] text-gray-600 font-bold leading-relaxed">{desc}</p>
    </div>
);

export default AboutUs;
