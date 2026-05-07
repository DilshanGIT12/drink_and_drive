import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, MessageSquare, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HelpSupport = () => {
    const navigate = useNavigate();

    const faqs = [
        { q: "How do I book a driver?", a: "Simply enter your pickup and drop-off locations on the dashboard and click 'Request Driver'." },
        { q: "What are the rates?", a: "Standard rates start at LKR 2500 for the first 10km, then LKR 100 per km." },
        { q: "How do I become a driver?", a: "Register with 'Driver' role and upload your NIC and Driving License for verification." },
        { q: "Is my car insured?", a: "Drivers are trained to handle all vehicle types, but we recommend having valid insurance." }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans relative">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-16">
                    <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-500 hover:text-accent transition-colors group">
                        <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Return</span>
                    </button>
                    <div className="text-right">
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Help <span className="text-accent">& Support</span></h1>
                        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-1">24/7 Command Center</p>
                    </div>
                </header>

                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <ContactCard icon={<Phone size={40} />} label="Hotline" value="+94 11 234 5678" />
                    <ContactCard icon={<Mail size={40} />} label="Email" value="support@drivesafe.lk" />
                    <ContactCard icon={<MessageSquare size={40} />} label="Live Chat" value="Available 24/7" />
                </div>

                <div className="bg-[#111] p-10 rounded-[3rem] border border-white/[0.03]">
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-8">Frequently Asked <span className="text-accent">Questions</span></h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <details key={idx} className="group bg-white/[0.02] rounded-2xl border border-white/[0.03] overflow-hidden transition-all">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <span className="font-bold text-sm uppercase tracking-tight">{faq.q}</span>
                                    <ChevronRight size={24} className="text-gray-600 group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="px-6 pb-6 text-gray-500 text-sm leading-relaxed border-t border-white/[0.03] pt-4">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>

                <div className="mt-12 bg-accent/5 p-8 rounded-[2.5rem] border border-accent/20 flex items-center justify-between">
                    <div>
                        <p className="text-lg font-black italic uppercase tracking-tight">Need immediate assistance?</p>
                        <p className="text-xs text-gray-500 font-bold uppercase mt-1">Our emergency response team is standing by.</p>
                    </div>
                    <button className="bg-accent text-black font-black px-8 py-4 rounded-2xl hover:bg-white transition-all shadow-xl shadow-accent/10 uppercase text-xs tracking-widest">
                        Call Support
                    </button>
                </div>
            </div>
        </div>
    );
};

const ContactCard = ({ icon, label, value }) => (
    <div className="bg-[#111] p-8 rounded-[2rem] border border-white/[0.03] text-center hover:border-accent/30 transition-all group">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-accent group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-black text-white">{value}</p>
    </div>
);

export default HelpSupport;
