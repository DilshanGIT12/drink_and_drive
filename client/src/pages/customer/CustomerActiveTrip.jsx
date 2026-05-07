import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, MapPin, ShieldCheck, Clock, Receipt, User, Phone, Navigation, AlertCircle, Share2, ShieldAlert, Zap, ArrowLeft, Star } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/useAuthStore';
import socketService from '../../services/socketService';
import Map from '../../components/Map';
import ChatTerminal from '../../components/ChatTerminal';

const CustomerActiveTrip = () => {
    const { id } = useParams();
    const { user, token } = useAuthStore();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [paymentStep, setPaymentStep] = useState('summary'); 
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [rating, setRating] = useState(5);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCancelTrip = async () => {
        if (!window.confirm("Abort this mission? Tactical protocols will be terminated.")) return;
        
        setIsCancelling(true);
        try {
            await axios.put(`http://localhost:5000/api/trips/${id}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            socketService.emit('update-trip-status', { 
                tripId: id, 
                status: 'cancelled' 
            });
            
            navigate('/customer/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Abort failed');
        } finally {
            setIsCancelling(false);
        }
    };

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/trips/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrip(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchTrip();
        if (token) {
            socketService.connect(token);
            
            socketService.on('driver-location-update', (data) => {
                if (data.tripId === id) {
                    setDriverLocation(data.location);
                }
            });

            socketService.on('trip-status-updated', (data) => {
                if (data.tripId === id) {
                    setTrip(prev => ({ ...prev, status: data.status }));
                }
            });
        }

        return () => {
            socketService.off('driver-location-update');
            socketService.off('trip-status-updated');
        };
    }, [id, token]);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (trip?.status === 'completed' || trip?.status === 'cancelled') return;
            try {
                const res = await axios.get(`http://localhost:5000/api/trips/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrip(res.data);
            } catch (err) {
                console.error(err);
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [id, token, trip?.status]);

    if (!trip) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin shadow-[0_0_20px_#facc15]" />
        </div>
    );

    const pickupCoords = {
        lat: trip.pickupLocation.coordinates[1],
        lng: trip.pickupLocation.coordinates[0]
    };
    
    const dropoffCoords = {
        lat: trip.dropoffLocation.coordinates[1],
        lng: trip.dropoffLocation.coordinates[0]
    };

    return (
        <div className="h-screen w-full bg-[#050505] text-white font-sans overflow-hidden flex flex-col relative">
            
            {/* Top Tactical Bar */}
            <div className="h-20 bg-black/60 backdrop-blur-3xl border-b border-white/[0.05] flex justify-between items-center px-10 z-30 shadow-2xl">
                <div className="flex items-center space-x-6">
                    <button onClick={() => navigate('/customer/dashboard')} className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Live <span className="text-accent">Telemetry.</span></h1>
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.4em] mt-2 italic">Active Mission: {id.slice(-8).toUpperCase()}</p>
                    </div>
                </div>
                
                <div className="flex items-center space-x-6">
                    <button 
                        onClick={() => {
                            const url = window.location.href;
                            navigator.clipboard.writeText(url);
                            alert('Strategic Tracking Link Secured.');
                        }}
                        className="hidden md:flex items-center space-x-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all italic"
                    >
                        <Share2 size={14} className="text-accent" />
                        <span>Establish Share Link</span>
                    </button>
                    <div className={`px-6 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] italic shadow-2xl ${
                        trip.status === 'completed' ? 'bg-green-500/10 border-green-500/20 text-green-500 shadow-green-500/10' : 'bg-accent/10 border-accent/20 text-accent shadow-accent/10 animate-pulse'
                    }`}>
                        {trip.status.replace('_', ' ')}
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
                
                {/* Tactical Map View */}
                <div className="flex-1 relative z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent z-20 pointer-events-none"></div>
                    <Map 
                        pickup={pickupCoords} 
                        dropoff={dropoffCoords} 
                        showSearch={false}
                    />
                    
                    {/* Live Status Overlay */}
                    <div className="absolute bottom-10 left-10 z-30">
                        <div className="bg-[#0d0d0d]/90 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex items-center space-x-6 group">
                            <div className="w-14 h-14 bg-accent/20 rounded-[1.5rem] flex items-center justify-center text-accent shadow-2xl border border-accent/20 group-hover:bg-accent group-hover:text-black transition-all">
                                <Zap size={32} className="animate-pulse" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mb-1 italic">Fleet Telemetry</p>
                                <p className="text-lg font-black text-white italic tracking-widest leading-none">GPS_LINK_NOMINAL</p>
                                <div className="flex items-center space-x-2 mt-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                                    <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest leading-none">Signal Strength: 100%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tactical Control Panel */}
                <div className="w-full md:w-[420px] bg-[#0d0d0d] p-10 flex flex-col z-20 shadow-[-50px_0_100px_rgba(0,0,0,0.8)] overflow-y-auto custom-scrollbar border-l border-white/[0.05] relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-accent/20 to-transparent"></div>
                    
                    {/* Status Modules */}
                    <AnimatePresence mode="wait">
                        {trip.status === 'accepted' && (
                            <motion.div key="accepted" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.03] p-10 rounded-[3.5rem] border border-white/[0.05] text-center shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                                    <Car size={100} />
                                </div>
                                <Car size={60} className="text-accent mx-auto mb-8 animate-bounce" />
                                <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none text-white">Pilot <br /> <span className="text-accent">Inbound.</span></h2>
                                <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] mt-6 leading-relaxed italic">Strategic extraction initiated. Operator is converging on your coordinates.</p>
                            </motion.div>
                        )}

                        {trip.status === 'arrived' && (
                            <motion.div key="arrived" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-accent/5 p-10 rounded-[4rem] border border-accent/20 text-center shadow-[0_0_100px_rgba(250,204,21,0.1)] relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
                                <div className="w-20 h-20 bg-accent rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
                                    <MapPin size={48} className="text-black" />
                                </div>
                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none mb-4">Pilot <br /> <span className="text-accent text-outline">On-Site.</span></h2>
                                <p className="text-[10px] text-accent font-black uppercase tracking-[0.4em] mb-10 italic">Verify Decryption Key Below</p>
                                
                                <div className="bg-[#050505] p-10 rounded-[3.5rem] border border-white/10 shadow-2xl relative group">
                                    <p className="text-[9px] text-gray-700 font-black uppercase tracking-[0.5em] mb-4 italic">Operational OTP</p>
                                    <p className="text-7xl font-black tracking-[0.3em] text-white italic drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">{trip.otp}</p>
                                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                </div>
                            </motion.div>
                        )}

                        {trip.status === 'in_progress' && (
                            <motion.div key="in_progress" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-green-500/5 p-10 rounded-[3.5rem] border border-green-500/20 text-center relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                                    <Navigation size={100} className="rotate-45" />
                                </div>
                                <Navigation size={60} className="text-green-500 mx-auto mb-8 animate-pulse rotate-45" />
                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Mission <br /> <span className="text-green-500">In Progress.</span></h2>
                                <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] mt-6 italic">Secure transit established. Continuous telemetry feed active.</p>
                            </motion.div>
                        )}

                        {trip.status === 'completed' && (
                            <motion.div key="completed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0d0d0d] p-10 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {paymentStep === 'summary' && (
                                        <motion.div key="summary" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                                            <div className="w-20 h-20 bg-accent/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl border border-accent/20">
                                                <Receipt size={48} className="text-accent" />
                                            </div>
                                            <h2 className="text-4xl font-black text-white uppercase tracking-tighter text-center italic leading-none mb-4">Mission <br /> <span className="text-accent">Finalized.</span></h2>
                                            <div className="mt-12 space-y-6 pt-10 border-t border-white/[0.05]">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em] italic">Base Protocol Fee</span>
                                                    <span className="text-base font-black text-gray-500 italic">LKR 2,500</span>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <span className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em] italic">Total Due</span>
                                                    <span className="text-4xl font-black text-accent tracking-tighter leading-none italic">LKR {trip.calculatedFare.toLocaleString()}</span>
                                                </div>
                                                <button 
                                                    onClick={() => setPaymentStep('payment')}
                                                    className="w-full bg-accent hover:bg-white text-black font-black py-7 rounded-[2.5rem] mt-10 transition-all active:scale-95 uppercase tracking-[0.3em] text-xs italic shadow-[0_20px_40px_rgba(250,204,21,0.2)]"
                                                >
                                                    Establish Settlement
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {paymentStep === 'payment' && (
                                        <motion.div key="payment" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter text-center italic leading-none mb-10">Select <span className="text-accent">Channel.</span></h2>
                                            <div className="space-y-4">
                                                <button 
                                                    onClick={() => setPaymentMethod('cash')}
                                                    className={`w-full p-8 rounded-[2.5rem] border-2 transition-all text-left flex items-center justify-between group ${paymentMethod === 'cash' ? 'border-accent bg-accent/5' : 'border-white/5 bg-white/[0.02] hover:border-white/10'}`}
                                                >
                                                    <div className="flex items-center space-x-6">
                                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 group-hover:text-accent transition-colors">💵</div>
                                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] italic text-white">Direct Cash Settlement</span>
                                                    </div>
                                                    {paymentMethod === 'cash' && <div className="w-3 h-3 bg-accent rounded-full shadow-[0_0_15px_#facc15]" />}
                                                </button>
                                                <button 
                                                    onClick={() => setPaymentMethod('card')}
                                                    className={`w-full p-8 rounded-[2.5rem] border-2 transition-all text-left flex items-center justify-between group ${paymentMethod === 'card' ? 'border-accent bg-accent/5' : 'border-white/5 bg-white/[0.02] hover:border-white/10'}`}
                                                >
                                                    <div className="flex items-center space-x-6">
                                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 group-hover:text-accent transition-colors">💳</div>
                                                        <span className="text-[11px] font-black uppercase tracking-[0.2em] italic text-white">Digital Secured Link</span>
                                                    </div>
                                                    {paymentMethod === 'card' && <div className="w-3 h-3 bg-accent rounded-full shadow-[0_0_15px_#facc15]" />}
                                                </button>
                                            </div>
                                            <button 
                                                onClick={() => { setIsProcessing(true); setTimeout(() => { setIsProcessing(false); setPaymentStep('rating'); }, 2000); }}
                                                disabled={isProcessing}
                                                className="w-full bg-white text-black font-black py-7 rounded-[2.5rem] mt-12 transition-all active:scale-95 uppercase tracking-[0.3em] text-xs flex items-center justify-center space-x-4 shadow-2xl"
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <div className="w-5 h-5 border-3 border-black border-t-transparent rounded-full animate-spin" />
                                                        <span className="italic">AUTHORIZING TRANSIT...</span>
                                                    </>
                                                ) : (
                                                    <span className="italic">CONFIRM LKR {trip.calculatedFare.toLocaleString()}</span>
                                                )}
                                            </button>
                                        </motion.div>
                                    )}

                                    {paymentStep === 'rating' && (
                                        <motion.div key="rating" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="text-center">
                                            <div className="w-24 h-24 bg-green-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-green-500 shadow-2xl border border-green-500/20">
                                                <ShieldCheck size={56} />
                                            </div>
                                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none mb-4">Payment <br /> <span className="text-green-500">Confirmed.</span></h2>
                                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.4em] mt-4 italic">Rate Your Pilot Unit</p>
                                            
                                            <div className="flex justify-center space-x-4 my-10">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button 
                                                        key={star} 
                                                        onClick={() => setRating(star)}
                                                        className={`text-4xl transition-all duration-500 ${star <= rating ? 'text-accent scale-125 drop-shadow-[0_0_10px_#facc15]' : 'text-gray-900'}`}
                                                    >
                                                        ★
                                                    </button>
                                                ))}
                                            </div>

                                            <button 
                                                onClick={() => navigate('/customer/dashboard')}
                                                className="w-full bg-accent text-black font-black py-7 rounded-[2.5rem] transition-all active:scale-95 uppercase tracking-[0.3em] text-xs italic shadow-2xl"
                                            >
                                                Archive Mission Log
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {trip.status === 'cancelled' && (
                            <motion.div key="cancelled" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-700/10 p-10 rounded-[4rem] border border-red-700/20 text-center shadow-2xl">
                                <ShieldAlert size={60} className="text-red-700 mx-auto mb-8 animate-pulse" />
                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none mb-6">Mission <br /> <span className="text-red-700">Aborted.</span></h2>
                                <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] mt-6 leading-relaxed italic">Tactical link severed by command. Returning to operational base.</p>
                                <button 
                                    onClick={() => navigate('/customer/dashboard')}
                                    className="w-full bg-white hover:bg-red-700 hover:text-white text-black font-black py-7 rounded-[2.5rem] mt-12 transition-all active:scale-95 uppercase tracking-[0.3em] text-[11px] italic shadow-2xl"
                                >
                                    Return to HQ
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Operational Entities Section */}
                    {trip.status !== 'completed' && trip.status !== 'cancelled' && (
                        <div className="space-y-10 mt-auto">
                            <div className="bg-white/[0.03] border border-white/[0.05] p-8 rounded-[3.5rem] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                    <User size={80} />
                                </div>
                                <div className="flex items-center space-x-6 relative z-10">
                                    <div className="w-16 h-16 bg-accent/20 rounded-[1.5rem] flex items-center justify-center text-accent font-black text-2xl italic border border-accent/20 shadow-2xl">
                                        {trip.driverId.fullName.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[9px] text-gray-700 font-black uppercase tracking-[0.4em] mb-2 italic">Unit Identifier</p>
                                        <h3 className="font-black text-xl uppercase italic text-white truncate leading-none">{trip.driverId.fullName}</h3>
                                        <div className="flex items-center space-x-3 mt-3">
                                            <Star size={12} className="text-accent fill-accent" />
                                            <span className="text-[11px] text-accent font-black italic tracking-widest leading-none">ELITE_RATING: 4.9</span>
                                        </div>
                                    </div>
                                    <a href={`tel:${trip.driverId.phoneNumber}`} className="w-14 h-14 bg-white/5 hover:bg-accent text-gray-600 hover:text-black rounded-[1.5rem] flex items-center justify-center transition-all border border-white/10 shadow-2xl group active:scale-90">
                                        <Phone size={32} />
                                    </a>
                                </div>
                            </div>

                            {/* Logistics Grid */}
                            <div className="grid grid-cols-1 gap-6 px-4">
                                <div className="flex items-start space-x-5 group">
                                    <div className="mt-1.5 w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_#facc15] transition-all group-hover:scale-150" />
                                    <div className="flex-1">
                                        <p className="text-[9px] text-gray-700 font-black uppercase tracking-[0.4em] italic mb-2 group-hover:text-white transition-colors">Target Extraction</p>
                                        <p className="text-xs font-black text-gray-500 italic uppercase leading-relaxed tracking-tight line-clamp-1">{trip.pickupLocation.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-5 group">
                                    <div className="mt-1.5 w-3 h-3 rounded-full bg-red-700 shadow-[0_0_10px_#dc2626] transition-all group-hover:scale-150" />
                                    <div className="flex-1">
                                        <p className="text-[9px] text-gray-700 font-black uppercase tracking-[0.4em] italic mb-2 group-hover:text-white transition-colors">Mission Objective</p>
                                        <p className="text-xs font-black text-gray-500 italic uppercase leading-relaxed tracking-tight line-clamp-1">{trip.dropoffLocation.address}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Termination Protocol */}
                            <div className="pt-10 border-t border-white/[0.05]">
                                <button 
                                    onClick={handleCancelTrip}
                                    disabled={isCancelling}
                                    className="w-full py-5 rounded-[2rem] bg-red-700/5 border border-red-700/20 text-red-700 text-[10px] font-black uppercase tracking-[0.4em] italic hover:bg-red-700 hover:text-white transition-all disabled:opacity-50 active:scale-95 shadow-2xl"
                                >
                                    {isCancelling ? 'SYNCHRONIZING ABORT...' : 'ABORT STRATEGIC MISSION'}
                                </button>
                                <p className="text-[8px] text-gray-800 font-black uppercase tracking-[0.3em] text-center mt-6 italic leading-relaxed px-8">
                                    Caution: Intentional mission termination may trigger protocol de-merits in Colombo HQ.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
            {/* Chat Terminal Overlay */}
            <ChatTerminal tripId={id} currentUser={user} messages={trip.messages || []} />
        </div>
    );
};

export default CustomerActiveTrip;
