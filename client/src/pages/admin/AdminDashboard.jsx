import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Car, DollarSign, ShieldCheck, Search, ChevronRight, LogOut, CheckCircle, XCircle, BarChart3, Clock, MapPin, Activity, Globe, TrendingUp, ShieldAlert, Cpu } from 'lucide-react';
import axios from 'axios';

import useAuthStore from '../../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import socketService from '../../services/socketService';

import Map from '../../components/Map';

const AdminDashboard = () => {
    const { user, logout, token } = useAuthStore();
    const navigate = useNavigate();
    
    const [view, setView] = useState('overview'); 
    const [stats, setStats] = useState({ totalUsers: 0, totalDrivers: 0, activeTrips: 0, totalRevenue: 0 });
    const [drivers, setDrivers] = useState([]);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMissions, setActiveMissions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const [sRes, dRes, tRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/admin/stats', config),
                    axios.get('http://localhost:5000/api/admin/drivers', config),
                    axios.get('http://localhost:5000/api/admin/trips', config)
                ]);
                setStats(sRes.data);
                setDrivers(dRes.data);
                setTrips(tRes.data);
                
                const active = tRes.data.filter(t => ['accepted', 'arrived', 'in_progress'].includes(t.status));
                setActiveMissions(active);

            } catch (err) {
                console.error('Admin fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        if (token) {
            socketService.connect(token);
            
            socketService.on('new-ride-request', () => {
                setStats(prev => ({ ...prev, activeTrips: prev.activeTrips + 1 }));
            });

            socketService.on('trip-status-updated', (data) => {
                fetchData();
            });
        }

        return () => {
            socketService.off('new-ride-request');
            socketService.off('trip-status-updated');
        };
    }, [view, token]);

    const handleUpdateStatus = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/admin/drivers/${id}/status`, { status }, config);
            const dRes = await axios.get('http://localhost:5000/api/admin/drivers', config);
            setDrivers(dRes.data);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="h-screen w-full bg-[#050505] flex flex-col md:flex-row overflow-hidden font-sans text-white relative">
            
            {/* Sidebar: Tactical Command */}
            <motion.div 
                initial={{ x: -100 }} animate={{ x: 0 }}
                className="w-full md:w-[300px] bg-[#0d0d0d]/90 backdrop-blur-3xl border-r border-white/[0.05] flex flex-col z-30 shadow-[50px_0_100px_rgba(0,0,0,0.5)]"
            >
                <div className="p-10 pb-12">
                    <Link to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
                        <div className="w-14 h-14 bg-red-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                            <ShieldAlert size={28} />
                        </div>
                        <div>
                            <p className="text-2xl font-black tracking-tighter leading-none italic text-white uppercase">COMMAND<span className="text-red-600">HQ</span></p>
                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em] mt-2">Strategic Admin Node</p>
                        </div>
                    </Link>
                </div>

                <div className="px-6 mb-10">
                    <div className="bg-red-600/10 border border-red-600/20 p-5 rounded-[2rem] flex items-center space-x-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Cpu size={30} className="text-red-600 animate-pulse" />
                        </div>
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_#dc2626]"></div>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-red-600 italic leading-none">Security Clearance: LEVEL 5</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-3 overflow-y-auto custom-scrollbar">
                    <AdminNavItem icon={<LayoutDashboard size={24} />} label="Operational Overview" active={view === 'overview'} onClick={() => setView('overview')} />
                    <AdminNavItem icon={<Globe size={24} />} label="Live Tactical Map" active={view === 'map'} onClick={() => setView('map')} />
                    <AdminNavItem icon={<Users size={24} />} label="Pilot Command" active={view === 'drivers'} onClick={() => setView('drivers')} />
                    <AdminNavItem icon={<Clock size={24} />} label="Mission Archives" active={view === 'trips'} onClick={() => setView('trips')} />
                    <AdminNavItem icon={<TrendingUp size={24} />} label="Revenue Intel" active={view === 'revenue'} onClick={() => setView('revenue')} />
                </nav>

                <div className="p-8 border-t border-white/[0.05] bg-black/20 mt-auto">
                    <div className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-[2.5rem] flex items-center space-x-4 relative group">
                        <div className="w-12 h-12 bg-red-600/20 rounded-2xl flex items-center justify-center text-red-500 font-black text-xl">AD</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black truncate text-white uppercase italic">Master Operator</p>
                            <div className="flex items-center space-x-2 mt-1">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]" />
                                <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest leading-none">Main Link Active</span>
                            </div>
                        </div>
                        <button onClick={() => { logout(); navigate('/login'); }} className="text-gray-700 hover:text-red-600 transition-colors p-2 rounded-xl hover:bg-white/5">
                            <LogOut size={24} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Main Command View */}
            <div className="flex-1 relative bg-[#050505] overflow-hidden flex flex-col z-10">
                
                {/* Top Telemetry Bar */}
                <div className="h-16 border-b border-white/[0.05] bg-black/40 backdrop-blur-2xl px-10 flex items-center justify-between">
                    <div className="flex items-center space-x-8 text-[8px] font-black uppercase tracking-[0.5em] text-gray-500 italic">
                        <div className="flex items-center space-x-3">
                            <span className="text-red-600">HQ_LINK:</span>
                            <span className="text-white">ENCRYPTED</span>
                        </div>
                        <div className="h-4 w-[1px] bg-white/10"></div>
                        <div className="flex items-center space-x-3">
                            <span className="text-red-600">LOC:</span>
                            <span className="text-white">COLOMBO_CENTRAL</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-4">
                            <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Network Load</span>
                            <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div initial={{ width: '10%' }} animate={{ width: '85%' }} transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }} className="h-full bg-red-600 shadow-[0_0_10px_#dc2626]"></motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Viewport */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        
                        {view === 'overview' && (
                            <motion.div key="overview" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-16">
                                <header>
                                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8] mb-6 text-white">Operational <br /> <span className="text-red-600 text-outline">Intelligence.</span></h1>
                                    <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.6em] ml-1 italic">Real-Time Global Surveillance & Fleet Management</p>
                                </header>

                                {/* Top Intel Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                                    <StatCard label="Network Revenue" value={`LKR ${stats.totalRevenue.toLocaleString()}`} icon={<DollarSign size={32} className="text-green-500" />} trend="+12.4% MoM" />
                                    <StatCard label="Missions In Progress" value={stats.activeTrips} icon={<Activity size={32} className="text-red-600" />} trend="LIVE" />
                                    <StatCard label="Online Pilots" value={stats.onlineDrivers} icon={<Car size={32} className="text-orange-500" />} trend="TACTICAL" />
                                    <StatCard label="Online Clients" value={stats.onlineCustomers} icon={<Users size={32} className="text-cyan-500" />} trend="ACTIVE" />
                                    <StatCard label="Total Pilot Force" value={stats.totalDrivers} icon={<ShieldCheck size={32} className="text-blue-500" />} trend="VERIFIED" />
                                    <StatCard label="Client Database" value={stats.totalUsers} icon={<Users size={32} className="text-purple-500" />} trend="SECURE" />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    {/* Mini Map View */}
                                    <div className="lg:col-span-2 bg-[#0d0d0d]/80 backdrop-blur-3xl rounded-[4rem] border border-white/[0.05] overflow-hidden h-[500px] relative shadow-[0_50px_100px_rgba(0,0,0,0.8)] group">
                                        <div className="absolute top-8 left-8 z-[10] flex items-center space-x-4 bg-black/60 backdrop-blur-2xl px-6 py-3 rounded-2xl border border-white/10">
                                            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] italic text-white">Live Operations Surveillance</span>
                                        </div>
                                        <Map showSearch={false} activeTrips={activeMissions} />
                                    </div>

                                    {/* Recent Activity Logs */}
                                    <div className="bg-[#0d0d0d]/80 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/[0.05] space-y-10 shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-10 opacity-[0.02]">
                                            <Activity size={120} className="text-red-600" />
                                        </div>
                                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Mission <span className="text-red-600">Telemetry</span></h3>
                                        <div className="space-y-8">
                                            {trips.slice(0, 6).map((t, i) => (
                                                <div key={i} className="flex items-center space-x-6 group cursor-pointer hover:translate-x-2 transition-transform">
                                                    <div className={`w-3 h-3 rounded-full ${t.status === 'completed' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-600 shadow-[0_0_10px_#dc2626]'} transition-all`} />
                                                    <div className="flex-1">
                                                        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 italic">LOG_#{t._id.slice(-6).toUpperCase()}</p>
                                                        <p className="text-[9px] text-gray-700 font-black uppercase tracking-[0.2em] mt-1 italic">{t.status}</p>
                                                    </div>
                                                    <p className="text-sm font-black text-white italic tracking-tighter">LKR {t.calculatedFare.toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={() => setView('trips')} className="w-full py-5 bg-white/5 hover:bg-white/10 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] transition-all border border-white/5 shadow-xl">Full Audit Logs</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {view === 'map' && (
                            <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full rounded-[5rem] overflow-hidden border border-white/[0.05] shadow-[0_50px_150px_rgba(0,0,0,1)] relative">
                                <Map showSearch={false} activeTrips={activeMissions} />

                                <div className="absolute top-12 right-12 z-[1000] w-80 space-y-6">
                                    <div className="bg-black/80 backdrop-blur-3xl p-8 rounded-[3.5rem] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-red-600 mb-8 flex items-center space-x-4 italic">
                                            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_#dc2626]"></div>
                                            <span>Fleet Analytics</span>
                                        </h4>
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center group">
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors italic">In Transit</span>
                                                <span className="text-2xl font-black text-white italic">{activeMissions.filter(m => m.status === 'in_progress').length}</span>
                                            </div>
                                            <div className="h-[1px] w-full bg-white/5"></div>
                                            <div className="flex justify-between items-center group">
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors italic">Dispatched</span>
                                                <span className="text-2xl font-black text-white italic">{activeMissions.filter(m => m.status === 'accepted').length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {view === 'drivers' && (
                            <motion.div key="drivers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                                <div className="bg-[#0d0d0d]/80 backdrop-blur-3xl p-12 rounded-[5rem] border border-white/[0.05] shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
                                    <header className="flex flex-col md:flex-row justify-between items-center gap-10 mb-16">
                                        <div>
                                            <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white">Pilot <span className="text-red-600">Command Control.</span></h3>
                                            <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.5em] mt-2 italic">Authentication & Deployment Terminal</p>
                                        </div>
                                        <div className="flex bg-white/5 px-8 py-5 rounded-[2rem] border border-white/10 items-center space-x-4 shadow-2xl group focus-within:border-red-600/50 transition-all">
                                            <Search size={24} className="text-gray-700 group-focus-within:text-red-600 transition-colors" />
                                            <input type="text" placeholder="PILOT_ID_SEARCH..." className="bg-transparent border-none text-[11px] font-black uppercase italic outline-none w-64 text-white placeholder:text-gray-800" />
                                        </div>
                                    </header>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                        {drivers.map((d) => (
                                            <div key={d._id} className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-[3rem] hover:bg-white/[0.04] hover:border-red-600/30 transition-all group relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                                    <Car size={60} className="text-white" />
                                                </div>
                                                <div className="flex items-center space-x-6 mb-10">
                                                    <div className="w-16 h-16 bg-red-600/10 rounded-[1.5rem] flex items-center justify-center text-red-600 font-black text-2xl border border-red-600/20 shadow-2xl group-hover:bg-red-600 group-hover:text-white transition-all">
                                                        {d.fullName[0]}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-black text-base uppercase truncate italic text-white leading-none">{d.fullName}</h4>
                                                        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em] mt-2">{d.phoneNumber}</p>
                                                    </div>
                                                    <div className={`w-3 h-3 rounded-full ${d.approvalStatus === 'approved' ? 'bg-green-500 shadow-[0_0_15px_#22c55e]' : 'bg-yellow-500 animate-pulse shadow-[0_0_15px_#eab308]'}`} />
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4 mb-10">
                                                    <div className="bg-black/40 p-4 rounded-2xl text-center border border-white/5 group-hover:border-white/10 transition-colors">
                                                        <p className="text-[8px] text-gray-700 font-black uppercase tracking-widest mb-1 italic">Tactical Points</p>
                                                        <p className="text-lg font-black text-white italic">{d.points || 0}</p>
                                                    </div>
                                                    <div className="bg-black/40 p-4 rounded-2xl text-center border border-white/5 group-hover:border-white/10 transition-colors">
                                                        <p className="text-[8px] text-gray-700 font-black uppercase tracking-widest mb-1 italic">Badge Level</p>
                                                        <p className="text-lg font-black text-red-600 italic uppercase">{d.badge || 'ROOKIE'}</p>
                                                    </div>
                                                </div>

                                                <div className="flex space-x-3">
                                                    <button 
                                                        onClick={() => handleUpdateStatus(d._id, 'approved')}
                                                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] italic transition-all ${d.approvalStatus === 'approved' ? 'bg-green-600/10 text-green-500 cursor-default border border-green-600/20' : 'bg-white/5 text-gray-600 hover:bg-green-600 hover:text-black border border-white/5'}`}
                                                    >
                                                        APPROVE_LINK
                                                    </button>
                                                    <button 
                                                        onClick={() => handleUpdateStatus(d._id, 'rejected')}
                                                        className="py-4 px-6 bg-white/5 text-gray-600 hover:bg-red-700 hover:text-white rounded-2xl transition-all border border-white/5"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {view === 'trips' && (
                            <motion.div key="trips" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                                <div className="bg-[#0d0d0d]/80 backdrop-blur-3xl p-16 rounded-[5rem] border border-white/[0.05] shadow-[0_50px_100px_rgba(0,0,0,1)]">
                                    <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-16 text-white">Mission <span className="text-red-600">Archival Nodes.</span></h3>
                                    <div className="space-y-6">
                                        {trips.map((trip) => (
                                            <div key={trip._id} className="bg-white/[0.02] border border-white/[0.05] p-10 rounded-[3.5rem] flex flex-col xl:flex-row xl:items-center justify-between hover:border-red-600/40 transition-all gap-10 group relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-2 h-full bg-red-600/20 group-hover:bg-red-600 transition-colors"></div>
                                                <div className="flex items-center space-x-12">
                                                    <div className="text-left w-40">
                                                        <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em] mb-2 italic">Mission Value</p>
                                                        <p className="text-3xl font-black text-green-500 italic leading-none tracking-tighter">LKR {trip.calculatedFare?.toLocaleString()}</p>
                                                    </div>
                                                    <div className="h-16 w-[1px] bg-white/5 hidden xl:block" />
                                                    <div className="flex-1">
                                                        <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em] mb-3 italic">Geo-Coordinates Transit</p>
                                                        <div className="flex items-center space-x-6">
                                                            <div className="flex items-center space-x-3">
                                                                <MapPin size={16} className="text-gray-700" />
                                                                <span className="text-xs font-black text-gray-400 italic truncate max-w-[250px] uppercase">{trip.pickupLocation.address}</span>
                                                            </div>
                                                            <ArrowRight size={16} className="text-red-600" />
                                                            <div className="flex items-center space-x-3">
                                                                <Navigation size={16} className="text-gray-700 rotate-45" />
                                                                <span className="text-xs font-black text-gray-400 italic truncate max-w-[250px] uppercase">{trip.dropoffLocation.address}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-10">
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em] mb-2 italic">Operation Protocol</p>
                                                        <div className="flex items-center space-x-4 justify-end">
                                                            <div className={`w-2 h-2 rounded-full ${trip.status === 'completed' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-600 shadow-[0_0_10px_#dc2626]'}`} />
                                                            <span className="text-[11px] font-black uppercase text-white italic tracking-widest">{trip.status}</span>
                                                        </div>
                                                    </div>
                                                    <button className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-gray-700 hover:text-white transition-all border border-white/10 group-hover:border-red-600/50">
                                                        <ChevronRight size={32} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const AdminNavItem = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-6 rounded-[2rem] transition-all duration-500 group ${active ? 'bg-red-600 text-white shadow-[0_20px_40px_rgba(220,38,38,0.3)] scale-105' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
        <div className="flex items-center space-x-5">
            <span className={`${active ? 'text-white' : 'text-gray-700 group-hover:text-red-600'} transition-colors`}>{icon}</span>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] italic">{label}</span>
        </div>
        <ChevronRight size={22} className={`${active ? 'opacity-100' : 'opacity-0'} group-hover:translate-x-2 transition-all`} />
    </button>
);

const StatCard = ({ label, value, icon, trend }) => (
    <div className="bg-[#0d0d0d]/90 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/[0.05] relative overflow-hidden group shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all hover:border-red-600/30">
        <div className="flex justify-between items-start mb-8">
            <div className="bg-white/5 w-14 h-14 rounded-[1.2rem] flex items-center justify-center border border-white/10 group-hover:bg-red-600 transition-all shadow-2xl">{icon}</div>
            <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl italic tracking-widest ${trend.includes('LIVE') || trend.includes('TACTICAL') ? 'bg-red-600/20 text-red-600 animate-pulse border border-red-600/20' : 'bg-green-600/10 text-green-500 border border-green-600/20'}`}>{trend}</span>
        </div>
        <div>
            <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em] mb-2 italic">{label}</p>
            <p className="text-3xl font-black italic tracking-tighter text-white leading-none">{value}</p>
        </div>
        <div className="absolute -bottom-10 -right-10 opacity-[0.02] group-hover:opacity-5 transition-opacity">
            <Cpu size={150} className="text-white" />
        </div>
    </div>
);

const ArrowRight = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

export default AdminDashboard;
