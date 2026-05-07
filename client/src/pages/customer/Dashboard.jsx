import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

import { Car, Clock, Send, LogOut, Package, ShieldCheck, User as UserIcon, Settings, ChevronRight, HelpCircle, Info, Navigation, ArrowRight, MapPin, Star, Heart, Bookmark, AlertTriangle, ShieldAlert, UserCheck } from 'lucide-react';
import Map from '../../components/Map';
import useAuthStore from '../../store/useAuthStore';
import socketService from '../../services/socketService';

import axios from 'axios';
import ChatTerminal from '../../components/ChatTerminal';
import SupportBot from '../../components/SupportBot';

const CustomerDashboard = () => {
    const { user, token, logout } = useAuthStore();
    const navigate = useNavigate();
    
    const [bookingStep, setBookingStep] = useState('config'); 
    const [pickup, setPickup] = useState(null);
    const [dropoff, setDropoff] = useState(null);
    const [distance, setDistance] = useState(0);
    const [tripType, setTripType] = useState('standard');
    const [vehicleType, setVehicleType] = useState('auto');
    const [vehicleCategory, setVehicleCategory] = useState('Sedan');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [estimatedFare, setEstimatedFare] = useState(0);
    const [acceptedTrip, setAcceptedTrip] = useState(null);
    const [isConnected, setIsConnected] = useState(socketService.socket?.connected || false);

    // Mock Saved Locations
    const savedLocations = [
        { label: 'Home', address: '123 Marine Drive, Colombo 03', lat: 6.9147, lng: 79.8512, icon: <Heart size={14} /> },
        { label: 'Office', address: 'World Trade Center, Colombo 01', lat: 6.9344, lng: 79.8433, icon: <Bookmark size={14} /> }
    ];

    const vehicleCategories = [
        { name: 'Sedan', icon: '🚗', desc: 'Fits 4 people + 2 bags' },
        { name: 'SUV', icon: '🚙', desc: 'Spacious for 5-7 people' },
        { name: 'Bike', icon: '🏍️', desc: 'Fast & agile for solo travel' },
        { name: 'Sports Car', icon: '🏎️', desc: 'Fast & high performance' }
    ];

    useEffect(() => {
        if (user && token) {
            socketService.connect(token);
            socketService.on('ride-accepted', (data) => {
                setAcceptedTrip(data);
                setIsSearching(false);
            });

            const handleConnect = () => setIsConnected(true);
            const handleDisconnect = () => setIsConnected(false);

            socketService.on('connect', handleConnect);
            socketService.on('disconnect', handleDisconnect);

            return () => {
                socketService.off('ride-accepted');
                socketService.off('connect', handleConnect);
                socketService.off('disconnect', handleDisconnect);
            };
        }
    }, [user, token]);

    useEffect(() => {
        if (distance > 0) {
            let fare = 2500;
            if (distance > 10) fare += Math.ceil(distance - 10) * 100;
            setEstimatedFare(fare);
        }
    }, [distance]);

    const handleLocationSelect = (type, location) => {
        if (type === 'pickup') setPickup(location);
        else setDropoff(location);
    };

    const useSavedLocation = (type, loc) => {
        const locationObj = { lat: loc.lat, lng: loc.lng, address: loc.address };
        handleLocationSelect(type, locationObj);
    };

    const handleRequestDriver = async () => {
        setIsSearching(true);
        socketService.emit('request-ride', {
            pickupLocation: pickup,
            dropoffLocation: dropoff,
            tripType,
            vehicleType,
            vehicleCategory,
            vehicleNumber,
            customerName: user.fullName,
            customerPhone: user.phoneNumber,
            estimatedFare
        });
    };

    return (
        <div className="h-screen w-full bg-[#050505] flex flex-col md:flex-row overflow-hidden font-sans text-white relative">
            
            {/* Subtle Cinematic Background Overlay */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <img src="/colombo_night_luxury_ride_1778020489434.png" alt="" className="w-full h-full object-cover blur-xl scale-110" />
            </div>

            {/* Sidebar */}
            <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-full md:w-[320px] bg-[#0d0d0d]/80 backdrop-blur-3xl border-r border-white/[0.05] flex flex-col z-30 shadow-2xl relative"
            >
                <div className="p-10 pb-12">
                    <Link to="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
                        <div className="w-14 h-14 bg-accent rounded-[1.5rem] flex items-center justify-center text-black shadow-[0_0_30px_rgba(250,204,21,0.3)]">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <p className="text-2xl font-black tracking-tighter leading-none italic text-white uppercase">DRIVE<span className="text-accent">SAFE</span></p>
                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1.5">Colombo Command</p>
                        </div>
                    </Link>
                </div>

                <div className="px-6 mb-8">
                    <div className="bg-accent/10 border border-accent/20 p-4 rounded-2xl flex items-center space-x-3">
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-accent italic">Strategic Presence Active</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-3 overflow-y-auto custom-scrollbar">
                    <NavItem icon={<Car size={20} />} label="Book a Ride" active={bookingStep !== 'none'} onClick={() => setBookingStep('config')} />
                    <NavItem icon={<Package size={20} />} label="Special Packages" onClick={() => navigate('/customer/packages')} />
                    <NavItem icon={<Clock size={20} />} label="Mission Logs" onClick={() => navigate('/customer/history')} />
                    <NavItem icon={<Settings size={20} />} label="Profile Terminal" onClick={() => navigate('/customer/profile')} />
                    <div className="pt-8 mt-8 border-t border-white/[0.05] space-y-3">
                        <NavItem icon={<HelpCircle size={20} />} label="HQ Support" onClick={() => navigate('/support')} />
                        <NavItem icon={<Info size={20} />} label="About Protocol" onClick={() => navigate('/about')} />
                    </div>
                </nav>

                <div className="p-8 mt-auto border-t border-white/[0.05] bg-black/20">
                    <div className="bg-white/[0.03] border border-white/[0.05] p-5 rounded-[2.5rem] flex items-center space-x-4 relative overflow-hidden group">
                        <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent font-black text-xl shadow-[0_0_20px_rgba(250,204,21,0.1)]">{user?.fullName?.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black truncate text-white uppercase italic tracking-tight">{user?.fullName}</p>
                            <div className="flex items-center space-x-2 mt-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
                                <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest leading-none italic">{isConnected ? 'Link Active' : 'Link Lost'}</p>
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

            {/* Main Area */}
            <div className="flex-1 relative bg-[#050505] flex flex-col z-10">
                
                {/* Top Tactical Bar */}
                <div className="h-16 border-b border-white/[0.05] bg-black/40 backdrop-blur-2xl px-10 flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-[8px] font-black uppercase tracking-[0.4em] text-gray-500">
                        <div className="flex items-center space-x-2">
                            <span className="text-accent italic">SL_OPS:</span>
                            <span className="text-white">COLOMBO_METRO_NOMINAL</span>
                        </div>
                        <div className="h-4 w-[1px] bg-white/10 hidden sm:block"></div>
                        <div className="hidden sm:flex items-center space-x-2">
                            <span className="text-accent italic">GPS:</span>
                            <span className="text-white">ENCRYPTED_LINK_ESTABLISHED</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">
                            {new Date().toLocaleTimeString('en-US', { hour12: false })} HRS
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {bookingStep === 'config' && (
                        <motion.div 
                            key="config" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}
                            className="flex-1 flex flex-col p-10 overflow-y-auto custom-scrollbar"
                        >
                            <div className="max-w-5xl mx-auto w-full space-y-16 py-10">
                                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                    <div>
                                        <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] mb-6">Initialize <br /> <span className="text-accent">Mission.</span></h2>
                                        <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.6em] ml-1">Tactical Booking Interface SL-01</p>
                                    </div>
                                    <div className="bg-red-600/10 border border-red-600/20 px-8 py-5 rounded-[2.5rem] flex items-center space-x-4">
                                        <ShieldAlert size={24} className="text-red-600" />
                                        <div>
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-tight">DUI Protocol Active</p>
                                            <p className="text-[8px] text-red-600 font-black uppercase tracking-widest mt-0.5">Zero Tolerance Enforced</p>
                                        </div>
                                    </div>
                                </header>

                                {/* Vehicle Category Selection */}
                                <section className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] italic">Target Fleet Category</label>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-accent">Active Dispatch: Sedan, SUV, Bike</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {vehicleCategories.map((cat) => (
                                            <button 
                                                key={cat.name}
                                                onClick={() => setVehicleCategory(cat.name)}
                                                className={`p-8 rounded-[3rem] border-2 transition-all text-left relative group overflow-hidden ${vehicleCategory === cat.name ? 'border-accent bg-accent/10' : 'border-white/[0.05] bg-white/[0.03] hover:border-white/20'}`}
                                            >
                                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                                    <span className="text-7xl">{cat.icon}</span>
                                                </div>
                                                <span className="text-4xl mb-6 block drop-shadow-2xl">{cat.icon}</span>
                                                <h4 className="font-black text-lg uppercase italic text-white leading-none">{cat.name}</h4>
                                                <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-2 group-hover:text-gray-400 transition-colors leading-relaxed">{cat.desc}</p>
                                                {vehicleCategory === cat.name && (
                                                    <motion.div layoutId="active" className="absolute top-6 right-6 w-3 h-3 bg-accent rounded-full shadow-[0_0_15px_#facc15]" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                {/* Mission Details Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                    {/* Left: Input Specs */}
                                    <div className="space-y-12">
                                        <div className="space-y-4 group">
                                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic group-focus-within:text-accent transition-colors">Vehicle Identity Code (Plate)</label>
                                            <input 
                                                type="text" placeholder="EX: WP ABC-1234"
                                                className="w-full bg-white/[0.03] border border-white/[0.1] p-8 rounded-[2.5rem] text-2xl font-black outline-none focus:border-accent/40 focus:bg-white/[0.08] transition-all uppercase italic text-white placeholder:text-gray-800"
                                                value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-6">
                                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Transmission Protocol</label>
                                            <div className="grid grid-cols-2 gap-6">
                                                <SelectorButton active={vehicleType === 'auto'} label="Auto Drive" onClick={() => setVehicleType('auto')} />
                                                <SelectorButton active={vehicleType === 'manual'} label="Manual Drive" onClick={() => setVehicleType('manual')} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Quick Launch Saved Locations */}
                                    <div className="space-y-8">
                                        <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2 italic">Quick Transit Protocols</label>
                                        <div className="grid grid-cols-1 gap-6">
                                            {savedLocations.map((loc) => (
                                                <div key={loc.label} className="bg-white/[0.03] border border-white/[0.05] p-6 rounded-[2.5rem] flex items-center justify-between group hover:border-accent/40 hover:bg-white/[0.05] transition-all backdrop-blur-xl">
                                                    <div className="flex items-center space-x-6">
                                                        <div className="w-14 h-14 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all shadow-xl">{loc.icon}</div>
                                                        <div>
                                                            <p className="text-sm font-black uppercase italic text-white">{loc.label}</p>
                                                            <p className="text-[10px] text-gray-600 font-bold tracking-tight mt-1">{loc.address}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-3">
                                                        <button onClick={() => useSavedLocation('pickup', loc)} className="px-4 py-2 bg-accent/20 text-accent text-[9px] font-black rounded-xl hover:bg-accent hover:text-black transition-all uppercase tracking-widest italic">Pickup</button>
                                                        <button onClick={() => useSavedLocation('dropoff', loc)} className="px-4 py-2 bg-white/5 text-gray-600 text-[9px] font-black rounded-xl hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest italic">Dropoff</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => vehicleNumber ? setBookingStep('mapping') : alert('Please enter Plate ID')}
                                    className="w-full bg-accent hover:bg-white text-black font-black py-8 rounded-[3rem] transition-all flex items-center justify-center space-x-6 group shadow-[0_30px_60px_rgba(250,204,21,0.2)] active:scale-95"
                                >
                                    <span className="tracking-[0.4em] uppercase text-sm italic">Initialize Tactical Navigation</span>
                                    <ArrowRight size={30} className="group-hover:translate-x-3 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {bookingStep === 'mapping' && (
                        <motion.div key="mapping" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 relative">
                            <Map onLocationSelect={handleLocationSelect} pickup={pickup} dropoff={dropoff} setDistance={setDistance} showSearch={!acceptedTrip} />
                            
                            {/* Back to Config */}
                            <button 
                                onClick={() => setBookingStep('config')}
                                className="absolute top-10 left-10 bg-[#0d0d0d]/90 backdrop-blur-3xl p-6 rounded-[2rem] border border-white/10 text-gray-500 hover:text-white transition-all z-20 shadow-2xl flex items-center space-x-4"
                            >
                                <ChevronRight size={30} className="rotate-180" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Adjust Specs</span>
                            </button>

                            {/* Booking Summary Panel */}
                            <AnimatePresence>
                                {pickup && dropoff && !acceptedTrip && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
                                        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[95%] md:w-[600px] z-20"
                                    >
                                        <div className="bg-[#0d0d0d]/95 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-[0_50px_150px_rgba(0,0,0,0.8)] relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
                                            
                                            <div className="flex flex-col sm:flex-row justify-between items-center gap-10 mb-12">
                                                <div className="text-center sm:text-left">
                                                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2 italic">Calculated Orbit</p>
                                                    <h3 className="text-5xl font-black italic tracking-tighter uppercase leading-none text-white">{distance.toFixed(2)} <span className="text-accent">KM</span></h3>
                                                </div>
                                                <div className="h-12 w-[1px] bg-white/10 hidden sm:block"></div>
                                                <div className="text-center sm:text-right">
                                                    <p className="text-accent text-[10px] font-black uppercase tracking-[0.4em] leading-none mb-3 italic text-right">Strategic Fee</p>
                                                    <p className="text-5xl font-black tracking-tighter italic text-accent leading-none">LKR {estimatedFare.toLocaleString()}</p>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={isSearching ? () => { setIsSearching(false); socketService.emit('cancel-ride'); } : handleRequestDriver}
                                                className={`w-full font-black py-8 rounded-[2.5rem] transition-all flex items-center justify-center space-x-6 relative overflow-hidden text-sm uppercase tracking-[0.3em] italic ${isSearching ? 'bg-white/5 text-red-500 border border-red-500/40' : 'bg-red-700 hover:bg-white text-white hover:text-black shadow-[0_20px_50px_rgba(185,28,28,0.4)] active:scale-95'}`}
                                            >
                                                {isSearching ? (
                                                    <>
                                                        <div className="w-6 h-6 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
                                                        <span>Scouring Airwaves...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Launch Dispatch Request</span>
                                                        <Navigation size={22} className="rotate-45" />
                                                    </>
                                                )}
                                            </button>
                                            
                                            {isSearching && (
                                                <p className="text-center text-[9px] text-gray-500 font-black uppercase tracking-[0.5em] mt-8 animate-pulse">Establishing Link with Elite Pilots in Colombo...</p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Match Notification */}
                <AnimatePresence>
                    {acceptedTrip && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-[2000] flex items-center justify-center p-8 bg-black/95 backdrop-blur-3xl">
                            <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} className="bg-[#0d0d0d] border border-white/10 p-10 rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] text-center max-w-md w-full relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-accent shadow-[0_0_20px_#facc15]"></div>
                                
                                <div className="flex justify-center mb-10">
                                    <div className="w-24 h-24 bg-accent/10 rounded-[2.5rem] flex items-center justify-center text-accent shadow-2xl border border-accent/20">
                                        <UserCheck size={48} />
                                    </div>
                                </div>

                                <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-3">Pilot <br /> <span className="text-accent">Identified.</span></h2>
                                <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.4em] mb-8">Strategic Asset En Route</p>
                                
                                <div className="bg-accent/5 border border-accent/20 p-8 rounded-[2.5rem] mb-10 relative group">
                                    <p className="text-[9px] text-accent font-black uppercase tracking-[0.4em] mb-3 italic">Security Decryption OTP</p>
                                    <p className="text-6xl font-black tracking-[0.3em] text-white italic drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{acceptedTrip.otp}</p>
                                    <p className="text-[8px] text-gray-600 font-bold uppercase tracking-[0.3em] mt-4">Share only with your assigned pilot</p>
                                </div>

                                <div className="space-y-4">
                                    <button onClick={() => navigate(`/customer/active-trip/${acceptedTrip.tripId}`)} className="w-full bg-white hover:bg-accent text-black font-black py-7 rounded-[2.5rem] transition-all uppercase tracking-[0.2em] text-xs italic shadow-2xl active:scale-95">Initiate Mission Control</button>
                                    <button 
                                        onClick={async () => {
                                            if (window.confirm("Abort this mission? Strategic repercussions may apply.")) {
                                                try {
                                                    await axios.put(`http://localhost:5000/api/trips/${acceptedTrip.tripId}/cancel`, {}, {
                                                        headers: { Authorization: `Bearer ${token}` }
                                                    });
                                                    socketService.emit('update-trip-status', { tripId: acceptedTrip.tripId, status: 'cancelled' });
                                                    setAcceptedTrip(null);
                                                } catch (err) {
                                                    alert('Abort failed');
                                                }
                                            }
                                        }}
                                        className="w-full bg-red-600/10 border border-red-600/20 text-red-600 font-black py-5 rounded-3xl transition-all uppercase tracking-[0.2em] text-[10px] hover:bg-red-600 hover:text-white italic"
                                    >
                                        Abort Mission Request
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tactical Chat Terminal */}
                {acceptedTrip && (
                    <ChatTerminal 
                        tripId={acceptedTrip.tripId} 
                        currentUser={user} 
                        messages={[]} 
                    />
                )}

                {/* AI Support Bot */}
                <SupportBot />
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center justify-between p-6 rounded-[2rem] transition-all duration-500 group ${active ? 'bg-accent text-black shadow-[0_15px_30px_rgba(250,204,21,0.2)] scale-105' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
        <div className="flex items-center space-x-5">
            <span className={`${active ? 'text-black' : 'text-gray-600 group-hover:text-accent'} transition-colors`}>{icon}</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">{label}</span>
        </div>
        <ChevronRight size={18} className={`${active ? 'opacity-100' : 'opacity-0'} group-hover:translate-x-2 transition-all`} />
    </button>
);

const SelectorButton = ({ active, label, onClick }) => (
    <button onClick={onClick} className={`py-6 rounded-[2.5rem] border-2 font-black text-[11px] uppercase tracking-[0.3em] italic transition-all ${active ? 'border-accent bg-accent/15 text-white shadow-2xl' : 'border-white/[0.05] bg-white/[0.03] text-gray-700 hover:border-white/20'}`}>
        {label}
    </button>
);

export default CustomerDashboard;
