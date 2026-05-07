import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, MapPin, Star, ArrowRight, Car, UserCheck, Smartphone, Zap, ShieldAlert, Award, Coffee, ShieldCheck } from 'lucide-react';

import { useNavigate, Link } from 'react-router-dom';
import SupportBot from '../components/SupportBot';

const LandingPage = () => {
    const navigate = useNavigate();

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-accent selection:text-black overflow-x-hidden">
            
            {/* Top Tactical Alert Bar */}
            <div className="bg-accent text-black py-2 px-6 text-[8px] font-black uppercase tracking-[0.5em] text-center">
                Sri Lanka's #1 Elite Designated Driver Network // Serving Colombo, Kandy, Galle & Negombo 24/7
            </div>

            {/* Navigation */}
            <nav className="fixed top-10 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-7xl bg-[#0d0d0d]/40 backdrop-blur-3xl border border-white/5 px-8 py-5 rounded-[2.5rem] flex justify-between items-center shadow-2xl">
                <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-black shadow-lg shadow-accent/20">
                        <Shield size={24} />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-lg font-black tracking-tighter uppercase italic text-white">Drive<span className="text-accent">Safe</span></span>
                        <span className="text-[6px] font-black uppercase tracking-[0.4em] text-gray-500 mt-0.5">SL Operational HQ</span>
                    </div>
                </Link>

                <div className="hidden lg:flex items-center space-x-10 text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">
                    <a href="#about" className="hover:text-accent transition-colors">Our Protocol</a>
                    <a href="#risks" className="hover:text-accent transition-colors">Risk Intel</a>
                    <a href="/support" className="hover:text-accent transition-colors">HQ Support</a>
                </div>

                <div className="flex items-center space-x-3">
                    <button onClick={() => navigate('/login')} className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all px-4 py-2">Login</button>
                    <button onClick={() => navigate('/register')} className="bg-white text-black text-[9px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl hover:bg-accent transition-all shadow-xl shadow-white/5 active:scale-95">Initialize</button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
                {/* Generated Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/colombo_night_luxury_ride_1778020489434.png" 
                        alt="Colombo Night" 
                        className="w-full h-full object-cover opacity-40 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]"></div>
                </div>
                
                <div className="container mx-auto px-6 relative z-10 pt-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center space-x-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full mb-10 backdrop-blur-xl"
                        >
                            <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_10px_#facc15]"></div>
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-accent">Active Protocol: SL-GUARD-001</span>
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                            className="text-7xl md:text-[10rem] font-black tracking-tighter uppercase italic mb-10 leading-[0.8] mix-blend-difference"
                        >
                            Night <br />
                            <span className="text-accent">Guardian.</span>
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-gray-400 text-sm md:text-xl font-bold max-w-2xl mx-auto mb-16 uppercase tracking-tight leading-relaxed italic"
                        >
                            Elite designated drivers for Colombo's premium nightlife. <br className="hidden md:block" />
                            We don't just drive; we secure your night, your vehicle, and your legacy.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="flex flex-col lg:flex-row items-center justify-center gap-6"
                        >
                            <button onClick={() => navigate('/login')} className="group w-full lg:w-auto bg-accent text-black font-black px-12 py-7 rounded-[2rem] text-xs uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(250,204,21,0.3)] hover:bg-white transition-all flex items-center justify-center space-x-4 active:scale-95">
                                <span>Initialize Mission</span>
                                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                                <button onClick={() => navigate('/register')} className="w-full sm:w-auto bg-white/5 border border-white/10 text-white font-black px-8 py-7 rounded-[2rem] text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center space-x-4 backdrop-blur-xl">
                                    <UserCheck size={24} className="text-accent" />
                                    <span>Join as Client</span>
                                </button>
                                <button onClick={() => navigate('/register')} className="w-full sm:w-auto bg-white/5 border border-white/10 text-white font-black px-8 py-7 rounded-[2rem] text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center space-x-4 backdrop-blur-xl">
                                    <Award size={24} className="text-blue-500" />
                                    <span>Apply as Pilot</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Floating Tactical Data Section */}
                <div className="absolute bottom-12 left-12 right-12 z-20 hidden xl:flex justify-between items-end">
                    <div className="bg-[#111]/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl flex items-center space-x-8">
                        <div className="flex flex-col">
                            <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Live Fleet</span>
                            <span className="text-2xl font-black italic text-accent leading-none">248 PI-LOTS</span>
                        </div>
                        <div className="h-10 w-[1px] bg-white/10"></div>
                        <div className="flex flex-col">
                            <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">Avg Dispatch</span>
                            <span className="text-2xl font-black italic text-white leading-none">04:12 MIN</span>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em] mb-4">Colombo Operations Map</p>
                        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="w-1/2 h-full bg-accent"></motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sri Lankan Risk Protocol Section */}
            <section id="risks" className="py-40 bg-[#050505] relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <motion.div {...fadeInUp} className="relative group">
                            <div className="absolute -inset-4 bg-accent/20 rounded-[4rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <img 
                                src="/elite_pilot_steering_sl_1778020515424.png" 
                                alt="Elite Pilot" 
                                className="w-full rounded-[4rem] border border-white/10 shadow-2xl relative z-10"
                            />
                            <div className="absolute top-10 left-10 z-20 bg-black/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/10">
                                <ShieldAlert size={40} className="text-red-600 mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-white leading-tight">DUI Alert: <br /> SL Police Protocols</p>
                            </div>
                        </motion.div>

                        <div className="space-y-16">
                            <div>
                                <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-accent mb-6">Tactical Risk Assessment</h2>
                                <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">Why the <br /> <span className="text-red-600">Smart Choice</span> <br /> is DriveSafe?</h3>
                            </div>

                            <div className="space-y-10">
                                <RiskItem 
                                    title="Sri Lankan Police Penalties" 
                                    desc="Drunk driving fines in Sri Lanka range from LKR 25,000 to LKR 50,000, along with immediate license suspension and potential imprisonment. Don't let one night destroy your record." 
                                />
                                <RiskItem 
                                    title="Fatal Accident Risk" 
                                    desc="Alcohol impairs reaction time by over 120%. Avoid becoming another statistic in Sri Lanka's high road accident count. We preserve lives and your vehicle." 
                                />
                                <RiskItem 
                                    title="Colombo Nightlife Experts" 
                                    desc="Our pilots know every shortcut in Colombo, from Marine Drive to Galle Road, ensuring you bypass traffic and arrive home with maximum stealth and safety." 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Strategic Stats Section */}
            <section className="py-32 bg-[#0a0a0a] border-y border-white/5 relative">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        <StatCard label="Missions Completed" value="12,500+" sub="Across SL" />
                        <StatCard label="DUI Fines Prevented" value="LKR 312M+" sub="Total Savings" />
                        <StatCard label="Pilot Network" value=" Colombo Based" sub="Elite Only" />
                        <StatCard label="Response Speed" value=" < 5 Mins" sub="City Central" />
                    </div>
                </div>
            </section>

            {/* Tactical Features Grid */}
            <section id="about" className="py-40">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-32">
                        <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-accent mb-6">Operational Capabilities</h2>
                        <h3 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic mix-blend-difference">Precision <span className="text-white/20">Logistics.</span></h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        <FeatureCard 
                            icon={<Smartphone />}
                            title="Command Terminal"
                            desc="Low-latency mobile command interface. Book your pilot in exactly 3 taps."
                        />
                        <FeatureCard 
                            icon={<Zap />}
                            title="Turbo Dispatch"
                            desc="Real-time proximity mapping ensures the closest pilot is redirected to your coordinates instantly."
                        />
                        <FeatureCard 
                            icon={<ShieldCheck />}
                            title="Level 3 Verification"
                            desc="Every pilot undergoes background checks by HQ and must hold a 5-star rating to remain active."
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA: Secure Your Night */}
            <section className="py-40 px-6">
                <div className="container mx-auto">
                    <div className="relative rounded-[5rem] overflow-hidden group">
                        <div className="absolute inset-0 bg-accent transition-transform duration-700 group-hover:scale-105"></div>
                        <div className="absolute inset-0 bg-[url('/colombo_night_luxury_ride_1778020489434.png')] opacity-20 object-cover mix-blend-overlay"></div>
                        
                        <div className="relative z-10 p-16 md:p-32 text-center text-black">
                            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic mb-10 leading-none">Ready for <br /> <span className="bg-black text-accent px-6 italic">Secure Transit?</span></h2>
                            <p className="text-sm md:text-xl font-black uppercase tracking-[0.2em] mb-16 max-w-xl mx-auto opacity-70">Initialize your first mission now and receive 10% off your first Colombo transit.</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-6">
                                <button onClick={() => navigate('/register')} className="bg-black text-white font-black px-16 py-7 rounded-[2rem] text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl active:scale-95">Create Account</button>
                                <button onClick={() => navigate('/login')} className="bg-white/20 backdrop-blur-2xl border border-black/10 text-black font-black px-16 py-7 rounded-[2rem] text-xs uppercase tracking-[0.3em] hover:bg-white transition-all active:scale-95">Guest Login</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-32 border-t border-white/5 bg-[#050505]">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-20">
                        <div className="space-y-8">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-black border border-white/10">
                                    <Shield size={24} />
                                </div>
                                <span className="text-xl font-black tracking-tighter uppercase italic text-white">Drive<span className="text-accent">Safe</span></span>
                            </div>
                            <p className="text-gray-600 text-xs font-bold uppercase tracking-widest leading-loose max-w-xs italic">
                                Tactical designated driver network operating at the intersection of luxury, safety, and Sri Lankan hospitality.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-20">
                            <FooterCol title="HQ Ops" links={['Strategic Map', 'Pilot Radar', 'Command HQ', 'Tactical API']} />
                            <FooterCol title="Protocols" links={['Privacy Link', 'Mission Terms', 'Refund Logic', 'Code Red']} />
                            <FooterCol title="Connect" links={['HQ Colombo', 'Instagram', 'X Terminal', 'LinkedIn']} />
                        </div>
                    </div>
                    <div className="mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[8px] font-black uppercase tracking-[0.4em] text-gray-700">
                        <p>© 2026 DRIVESAFE OPERATIONAL COMMAND. ALL RIGHTS RESERVED.</p>
                        <div className="flex items-center space-x-8">
                            <span className="text-accent">STATUS: ALL SYSTEMS NOMINAL</span>
                            <span>ENCRYPTION: AES-256 ACTIVE</span>
                        </div>
                    </div>
                </div>
            </footer>

            <SupportBot />
        </div>
    );
};

const RiskItem = ({ title, desc }) => (
    <div className="flex items-start space-x-8 group">
        <div className="w-4 h-4 bg-red-600/20 border border-red-600/40 rounded-full mt-1.5 flex items-center justify-center group-hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]">
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full group-hover:bg-white transition-colors" />
        </div>
        <div className="flex-1">
            <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight italic mb-3 text-white group-hover:text-accent transition-colors">{title}</h4>
            <p className="text-gray-500 text-sm font-medium leading-relaxed italic">{desc}</p>
        </div>
    </div>
);

const StatCard = ({ label, value, sub }) => (
    <div className="space-y-1 group">
        <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] mb-3 group-hover:text-accent transition-colors">{label}</p>
        <p className="text-3xl font-black italic tracking-tighter text-white">{value}</p>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">{sub}</p>
    </div>
);

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-[#111]/40 backdrop-blur-xl p-12 rounded-[3.5rem] border border-white/5 hover:border-accent/30 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
            {React.cloneElement(icon, { size: 100 })}
        </div>
        <div className="w-16 h-16 bg-white/5 rounded-[1.8rem] flex items-center justify-center mb-10 group-hover:bg-accent group-hover:text-black transition-all shadow-xl">
            {React.cloneElement(icon, { size: 36 })}
        </div>
        <h4 className="text-2xl font-black uppercase tracking-tight italic mb-4">{title}</h4>
        <p className="text-gray-500 text-sm font-medium leading-relaxed italic">{desc}</p>
    </div>
);

const FooterCol = ({ title, links }) => (
    <div className="space-y-8">
        <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-white italic">{title}</h5>
        <ul className="space-y-4">
            {links.map((l, i) => (
                <li key={i}><a href="#" className="text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-accent transition-colors">{l}</a></li>
            ))}
        </ul>
    </div>
);

export default LandingPage;
