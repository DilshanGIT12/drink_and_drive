import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, MapPin, Navigation, DollarSign, Clock, ShieldCheck, User as UserIcon, LayoutDashboard, History, LogOut, HelpCircle, Info, ChevronRight, Send, ShieldAlert, Zap, Activity, Car } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import socketService from '../../services/socketService';
import { useNavigate, Link } from 'react-router-dom';
import Map from '../../components/Map';
import SupportBot from '../../components/SupportBot';

const DriverRadar = () => {
    const { user, token, logout } = useAuthStore();
    const navigate = useNavigate();
    
    const [isOnline, setIsOnline] = useState(false);
    const [requests, setRequests] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [newMissionAlert, setNewMissionAlert] = useState(null);
    const [isConnected, setIsConnected] = useState(socketService.socket?.connected || false);
    const [earnings, setEarnings] = useState(12450); // Mock
    const [tripsCount, setTripsCount] = useState(8); // Mock

    useEffect(() => {
        if (user && token) {
            socketService.connect(token);
            
            socketService.on('new-ride-request', (request) => {
                setRequests(prev => {
                    if (prev.find(r => r.customerSocketId === request.customerSocketId)) return prev;
                    return [...prev, request];
                });

                setNewMissionAlert(request);
                setTimeout(() => setNewMissionAlert(null), 8000);

                setNotifications(prev => [
                    {
                        id: Date.now(),
                        type: 'mission',
                        title: 'Tactical Mission Available',
                        message: `From ${request.pickupLocation.address.split(',')[0]} to ${request.dropoffLocation.address.split(',')[0]}`,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        data: request
                    },
                    ...prev
                ]);
            });

            socketService.on('request-taken', (data) => {
                setRequests(prev => prev.filter(r => r.tripId !== data.tripId));
            });

            socketService.on('request-cancelled', (data) => {
                setRequests(prev => prev.filter(r => r.customerId !== data.customerId));
                setNewMissionAlert(null);
            });

            socketService.on('accept-success', (data) => {
                navigate(`/driver/active-trip/${data.tripId}`);
            });

            const handleConnect = () => setIsConnected(true);
            const handleDisconnect = () => setIsConnected(false);

            socketService.on('connect', handleConnect);
            socketService.on('disconnect', handleDisconnect);

            return () => {
                socketService.off('new-ride-request');
                socketService.off('request-taken');
                socketService.off('request-cancelled');
                socketService.off('accept-success');
                socketService.off('connect', handleConnect);
                socketService.off('disconnect', handleDisconnect);
            };
        }
    }, [user, token, navigate]);

    const toggleOnline = () => {
        const nextState = !isOnline;
        setIsOnline(nextState);
        
        if (nextState) {
            socketService.emit('driver-online', { vehicleType: 'both' });
        } else {
            socketService.emit('driver-offline');
        }
    };

    const handleAccept = (request) => {
        socketService.emit('accept-ride', request);
        setRequests([]); 
    };

    return (
        <div className="h-screen w-full bg-[#050505] flex flex-col md:flex-row overflow-hidden font-sans text-white relative">
            
            {/* Subtle Cinematic Background Overlay */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <img src="/colombo_night_luxury_ride_1778020489434.png" alt="" className="w-full h-full object-cover blur-2xl scale-125" />
            </div>

            {/* Tactical Sidebar */}
            <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-full md:w-[320px] bg-[#0d0d0d]/80 backdrop-blur-3xl border-r border-white/[0.05] flex flex-col z-30 shadow-[50px_0_100px_rgba(0,0,0,0.5)]"
            >
                <div className="p-10 pb-6">
                    <Link to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
                        <div className="w-14 h-14 bg-accent rounded-[1.5rem] flex items-center justify-center text-black shadow-[0_0_30px_rgba(250,204,21,0.3)]">
                            <Navigation size={32} className="rotate-45" />
                        </div>
                        <div>
                            <p className="text-2xl font-black tracking-tighter leading-none italic text-white uppercase">PILOT<span className="text-accent">RADAR</span></p>
                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.4em] mt-2 italic">Elite Unit Colombo</p>
                        </div>
                    </Link>
                </div>

                <div className="px-6 mb-8 space-y-4">
                    <div className="bg-white/[0.03] border border-white/[0.05] p-6 rounded-[2.5rem] grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest italic">Net Profit</p>
                            <p className="text-xl font-black text-accent italic tracking-tighter leading-none">LKR {earnings.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1 border-l border-white/5 pl-4">
                            <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest italic">Missions</p>
                            <p className="text-xl font-black text-white italic tracking-tighter leading-none">{tripsCount}</p>
                        </div>
                    </div>
                    {isOnline && (
                        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-green-500 italic">Target Acquisition Active</p>
                        </div>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-3 overflow-y-auto custom-scrollbar">
                    <DriverNavItem icon={<LayoutDashboard size={20} />} label="Mission Radar" active={!showNotifications} onClick={() => { setShowNotifications(false); }} />
                    <div className="relative group">
                        <DriverNavItem icon={<Zap size={20} />} label="Tactical Alerts" active={showNotifications} onClick={() => setShowNotifications(true)} />
                        {notifications.length > 0 && (
                            <div className="absolute top-4 right-6 w-6 h-6 bg-red-600 rounded-xl flex items-center justify-center text-[10px] font-black border-2 border-[#0d0d0d] shadow-lg shadow-red-600/20">
                                {notifications.length}
                            </div>
                        )}
                    </div>
                    <DriverNavItem icon={<History size={20} />} label="Hire Archives" onClick={() => navigate('/driver/history')} />
                    <DriverNavItem icon={<Activity size={20} />} label="Unit Performance" onClick={() => navigate('/driver/performance')} />
                    <div className="pt-8 mt-8 border-t border-white/[0.05] space-y-3">
                        <DriverNavItem icon={<HelpCircle size={20} />} label="HQ Comms" onClick={() => navigate('/support')} />
                        <DriverNavItem icon={<Info size={20} />} label="Rules of Engagement" onClick={() => navigate('/about')} />
                    </div>
                </nav>

                <div className="p-8 border-t border-white/[0.05] bg-black/20 mt-auto">
                    <button 
                        onClick={toggleOnline}
                        className={`w-full flex items-center justify-center space-x-4 py-6 rounded-[2.5rem] font-black text-xs transition-all active:scale-95 shadow-2xl relative overflow-hidden group mb-6 ${isOnline ? 'bg-red-700 text-white shadow-red-700/20' : 'bg-accent text-black shadow-[0_20px_40px_rgba(250,204,21,0.25)]'}`}
                    >
                        <Power size={24} />
                        <span className="tracking-[0.3em] uppercase italic">{isOnline ? 'Terminate Duty' : 'Go Operational'}</span>
                    </button>

                    <div className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-[2.5rem] flex items-center space-x-4 relative overflow-hidden group">
                        <div className="w-12 h-12 bg-accent/15 rounded-2xl flex items-center justify-center text-accent font-black text-xl italic border border-accent/20 shadow-[0_0_20px_rgba(250,204,21,0.1)]">{user?.fullName[0]}</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <p className="text-sm font-black truncate text-white uppercase italic leading-none tracking-tight">{user?.fullName}</p>
                                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                                <span className="text-[8px] font-black bg-accent text-black px-2 py-0.5 rounded-lg uppercase italic tracking-widest">{user?.badge || 'Pilot_01'}</span>
                                <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest leading-none italic">{isConnected ? 'Link Active' : 'Link Lost'}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => { logout(); navigate('/login'); }} 
                            className="text-gray-700 hover:text-red-600 transition-all p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-red-600/20 hover:bg-red-600/5 group/logout"
                            title="Terminate Session"
                        >
                            <LogOut size={20} className="group-hover/logout:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Main Radar Map Area */}
            <div className="flex-1 relative bg-[#050505] overflow-hidden flex flex-col z-10">
                
                {/* Top Tactical Telemetry */}
                <div className="h-16 border-b border-white/[0.05] bg-black/40 backdrop-blur-2xl px-10 flex items-center justify-between">
                    <div className="flex items-center space-x-8 text-[8px] font-black uppercase tracking-[0.5em] text-gray-500 italic">
                        <div className="flex items-center space-x-3">
                            <span className="text-accent">RADAR_STATUS:</span>
                            <span className={isOnline ? 'text-green-500 animate-pulse' : 'text-gray-700'}>{isOnline ? 'SCANNING_ACTIVE' : 'STANDBY'}</span>
                        </div>
                        <div className="h-4 w-[1px] bg-white/10"></div>
                        <div className="flex items-center space-x-3">
                            <span className="text-accent">ZONE:</span>
                            <span className="text-white">COLOMBO_METRO</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-8">
                        <div className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40 italic">
                            {new Date().toLocaleTimeString('en-US', { hour12: false })} Zulu
                        </div>
                    </div>
                </div>

                {/* Radar Grid Map */}
                <div className={`absolute inset-0 transition-all duration-1000 ${isOnline ? 'opacity-80 scale-105 saturate-150' : 'opacity-30 scale-100 grayscale'}`}>
                    <Map pickup={{ lat: 6.9271, lng: 79.8612 }} showSearch={false} /> 
                </div>

                {/* Radar Scanning Overlay */}
                <AnimatePresence>
                    {isOnline && requests.length === 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                        >
                            <div className="relative w-[500px] h-[500px] flex items-center justify-center">
                                <motion.div 
                                    animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }}
                                    className="absolute inset-0 border border-accent/40 rounded-full"
                                />
                                <motion.div 
                                    animate={{ scale: [1, 1.5], opacity: [0.2, 0] }}
                                    transition={{ repeat: Infinity, duration: 3, delay: 1, ease: "easeOut" }}
                                    className="absolute inset-0 border border-accent/30 rounded-full shadow-[inset_0_0_50px_rgba(250,204,21,0.1)]"
                                />
                                <div className="z-10 text-center bg-[#0d0d0d]/90 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                                    <div className="w-3 h-3 bg-accent rounded-full mx-auto mb-6 animate-pulse shadow-[0_0_20px_#facc15]" />
                                    <p className="text-[11px] font-black uppercase tracking-[0.5em] text-accent italic">Target Acquisition</p>
                                    <p className="text-[9px] text-gray-600 mt-4 font-black uppercase tracking-[0.2em] italic">Awaiting Client Coordinates...</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Offline State */}
                {!isOnline && !showNotifications && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-20">
                        <div className="text-center group">
                            <div className="w-28 h-28 bg-white/5 border border-white/10 rounded-[3rem] flex items-center justify-center mx-auto mb-8 text-gray-700 group-hover:border-accent/30 group-hover:text-accent transition-all duration-500 shadow-2xl">
                                <Power size={64} />
                            </div>
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-400 mb-4 leading-none">Terminal <br /> <span className="text-white opacity-40">Offline.</span></h2>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.5em] mt-6 italic">Toggle Power to Initialize Duty Protocol</p>
                        </div>
                    </div>
                )}

                {/* New Mission Prominent Alert */}
                <AnimatePresence>
                    {newMissionAlert && (
                        <motion.div 
                            initial={{ x: -100, opacity: 0, scale: 0.9 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            exit={{ x: -100, opacity: 0, scale: 0.9 }}
                            className="absolute top-6 left-[340px] z-[100] w-[400px]"
                        >
                            <div className="bg-accent p-[1px] rounded-[2rem] shadow-[0_20px_60px_rgba(250,204,21,0.25)]">
                                <div className="bg-[#0d0d0d] text-white p-5 rounded-[1.9rem] flex items-center justify-between border border-white/10 relative overflow-hidden group">
                                    <div className="flex items-center space-x-6 relative z-10">
                                        <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-black shadow-xl">
                                            <ShieldAlert size={28} className="animate-pulse" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black italic uppercase tracking-tighter leading-none mb-1.5 text-accent">Priority Hire!</h3>
                                            <div className="flex items-center space-x-3">
                                                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest italic">Value:</p>
                                                <p className="text-sm font-black text-white italic tracking-tighter leading-none text-accent">LKR {newMissionAlert.estimatedFare.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => { setRequests([newMissionAlert]); setNewMissionAlert(null); }}
                                        className="bg-accent hover:bg-white text-black px-6 py-3.5 rounded-xl font-black uppercase text-[9px] tracking-[0.1em] italic shadow-xl transition-all relative z-10 active:scale-95"
                                    >
                                        Inspect
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ACTIVE MISSION REQUEST CARDS */}
                <div className="absolute top-16 right-12 w-[380px] flex flex-col gap-4 z-[110]">
                    <AnimatePresence>
                        {requests.map((request, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ x: 100, opacity: 0, scale: 0.9 }}
                                    animate={{ x: 0, opacity: 1, scale: 1 }}
                                    exit={{ x: 100, opacity: 0 }}
                                    className="bg-[#0d0d0d]/95 backdrop-blur-3xl p-8 rounded-[3rem] border border-accent/40 shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative overflow-hidden group"
                                >
                                <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                    <Zap size={150} className="text-accent" />
                                </div>
                                
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <div className="flex items-center space-x-3 text-accent mb-2">
                                            <Zap size={14} className="animate-pulse shadow-[0_0_10px_#facc15]" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.3em] italic leading-none">Hire Proposal</span>
                                        </div>
                                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white leading-none">
                                            {request.customerName.split(' ')[0]}'s Mission
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] text-gray-700 font-black uppercase tracking-widest italic mb-1.5">Tactical Pay</p>
                                        <p className="text-2xl font-black text-accent italic leading-none tracking-tighter">LKR {request.estimatedFare.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="space-y-6 mb-12">
                                    <div className="flex items-start space-x-4">
                                        <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shadow-[0_0_12px_#facc15]" />
                                        <div className="flex-1">
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] leading-none mb-2 italic">Extraction Point</p>
                                            <p className="text-xs font-black text-gray-300 italic leading-relaxed uppercase">{request.pickupLocation.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="w-2 h-2 rounded-full bg-red-600 mt-1.5 shadow-[0_0_12px_#dc2626]" />
                                        <div className="flex-1">
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] leading-none mb-2 italic">Dropoff Target</p>
                                            <p className="text-xs font-black text-gray-300 italic leading-relaxed uppercase">{request.dropoffLocation.address}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/[0.05] rounded-[2rem] mb-12 relative z-10">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-600 group-hover:text-accent transition-colors">
                                            <Car size={28} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-gray-700 font-black uppercase tracking-widest mb-1 italic">Vehicle Profile</p>
                                            <p className="text-xs font-black text-white uppercase italic tracking-widest">{request.vehicleCategory} // {request.vehicleType}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] text-gray-700 font-black uppercase tracking-widest mb-1 italic">Plate ID</p>
                                        <p className="text-xs font-black text-accent italic tracking-widest">{request.vehicleNumber}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 relative z-10">
                                    <button 
                                        onClick={() => setRequests(prev => prev.filter(r => r.customerSocketId !== request.customerSocketId))}
                                        className="bg-white/5 hover:bg-white/10 text-gray-600 hover:text-white font-black py-6 rounded-[2rem] transition-all uppercase tracking-[0.3em] text-[10px] italic border border-white/[0.05]"
                                    >
                                        Decline
                                    </button>
                                    <button 
                                        onClick={() => handleAccept(request)}
                                        className="bg-accent hover:bg-white text-black font-black py-6 rounded-[2rem] transition-all shadow-[0_20px_40px_rgba(250,204,21,0.25)] active:scale-95 uppercase tracking-[0.3em] text-[10px] italic"
                                    >
                                        Accept Hire
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* AI Support Bot - Moved to left on this page */}
                <SupportBot positionClasses="bottom-32 left-[340px]" />
            </div>
        </div>
    );
};

const DriverNavItem = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-6 rounded-[2rem] transition-all duration-500 group ${active ? 'bg-accent text-black shadow-[0_20px_40px_rgba(250,204,21,0.2)] scale-105' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
        <div className="flex items-center space-x-5">
            <span className={`${active ? 'text-black' : 'text-gray-700 group-hover:text-accent'} transition-colors`}>{icon}</span>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] italic">{label}</span>
        </div>
        <ChevronRight size={22} className={`${active ? 'opacity-100' : 'opacity-0'} group-hover:translate-x-2 transition-all`} />
    </button>
);

export default DriverRadar;
