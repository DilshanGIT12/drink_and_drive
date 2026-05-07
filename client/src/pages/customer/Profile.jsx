import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, User as UserIcon, Mail, Phone, Shield, Car, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const Profile = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans relative">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-16">
                    <button onClick={() => navigate('/customer/dashboard')} className="flex items-center space-x-2 text-gray-500 hover:text-accent transition-colors group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Back</span>
                    </button>
                    <div className="text-right">
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic">My <span className="text-accent">Profile</span></h1>
                        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-1">Manage your terminal</p>
                    </div>
                </header>

                <div className="grid md:grid-cols-3 gap-10">
                    {/* Profile Card */}
                    <div className="md:col-span-1">
                        <div className="bg-[#111] p-10 rounded-[3rem] border border-white/[0.03] text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-accent"></div>
                            <div className="w-24 h-24 bg-accent/10 rounded-[2rem] mx-auto flex items-center justify-center text-accent font-black text-4xl mb-6 border border-accent/20">
                                {user?.fullName?.charAt(0)}
                            </div>
                            <h2 className="text-2xl font-black italic">{user?.fullName}</h2>
                            <p className="text-accent text-[10px] font-black uppercase tracking-[0.2em] mt-2">Verified {user?.role}</p>
                            
                            <button 
                                onClick={() => { logout(); navigate('/login'); }}
                                className="mt-10 w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2"
                            >
                                <LogOut size={16} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Details Form */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-[#111] p-10 rounded-[3.5rem] border border-white/[0.03]">
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-8 italic">Account <span className="text-accent">Details</span></h3>
                            
                            <div className="space-y-8">
                                <ProfileDetail icon={<UserIcon size={20} />} label="Full Name" value={user?.fullName} />
                                <ProfileDetail icon={<Phone size={20} />} label="Mobile Terminal" value={user?.phoneNumber} />
                                <ProfileDetail icon={<Shield size={20} />} label="Security Role" value={user?.role?.toUpperCase()} />
                            </div>
                        </div>

                        <div className="bg-[#111] p-10 rounded-[3.5rem] border border-white/[0.03]">
                            <h3 className="text-xl font-black uppercase tracking-tighter mb-6 italic">Vehicle <span className="text-accent">Preferences</span></h3>
                            <div className="flex items-center justify-between p-6 bg-white/[0.02] rounded-3xl border border-white/[0.05]">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400">
                                        <Car size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black italic uppercase">Default Gear Type</p>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Auto & Manual Compatible</p>
                                    </div>
                                </div>
                                <div className="bg-accent text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase italic shadow-lg shadow-accent/10">All-Access</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileDetail = ({ icon, label, value }) => (
    <div className="flex items-center space-x-6 group">
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-600 group-hover:text-accent transition-colors">
            {icon}
        </div>
        <div>
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{label}</p>
            <p className="text-lg font-black text-white italic tracking-tight">{value}</p>
        </div>
    </div>
);

export default Profile;
