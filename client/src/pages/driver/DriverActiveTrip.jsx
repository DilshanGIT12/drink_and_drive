import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, User, CheckCircle, Clock, Phone, Navigation, Shield, ChevronRight, AlertCircle, ShieldAlert, Zap, Cpu, Activity } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/useAuthStore';
import socketService from '../../services/socketService';
import Map from '../../components/Map';
import ChatTerminal from '../../components/ChatTerminal';

const DriverActiveTrip = () => {
    const { id } = useParams();
    const { user, token } = useAuthStore();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [otp, setOtp] = useState('');
    const [distance, setDistance] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrip = async () => {
            if (!token) return;
            try {
                const res = await axios.get(`http://localhost:5000/api/trips/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrip(res.data);
            } catch (err) {
                console.error('Fetch trip error:', err);
                setError(err.response?.data?.message || 'Failed to load mission data');
            }
        };
        fetchTrip();

        if (token) {
            socketService.connect(token);
        }
    }, [id, token]);

    // Simulated Location Tracking
    useEffect(() => {
        if (trip && trip.status !== 'completed' && trip.status !== 'cancelled' && token) {
            const interval = setInterval(() => {
                if (trip.pickupLocation?.coordinates) {
                    socketService.emit('update-location', {
                        tripId: id,
                        location: {
                            lat: trip.pickupLocation.coordinates[1],
                            lng: trip.pickupLocation.coordinates[0]
                        }
                    });
                }
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [trip, id, token]);

    const handleStatusUpdate = async (endpoint, data, isFile = false) => {
        setLoading(true);
        try {
            const config = {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': isFile ? 'multipart/form-data' : 'application/json'
                }
            };
            const res = await axios.put(`http://localhost:5000/api/trips/${id}/${endpoint}`, data, config);
            const updatedTrip = res.data.trip || res.data;
            setTrip(updatedTrip);
            
            socketService.emit('update-trip-status', {
                tripId: id,
                status: updatedTrip.status
            });

            setImage(null); 
            setOtp('');
        } catch (error) {
            alert(error.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelTrip = async () => {
        if (!window.confirm("Abort this mission? You must report to HQ regarding this tactical withdrawal.")) return;
        setLoading(true);
        try {
            await axios.put(`http://localhost:5000/api/trips/${id}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            socketService.emit('update-trip-status', { tripId: id, status: 'cancelled' });
            navigate('/driver/radar');
        } catch (err) {
            alert(err.response?.data?.message || 'Cancellation failed');
        } finally {
            setLoading(false);
        }
    };

    if (error) return (
        <div className="h-screen bg-[#050505] flex flex-col items-center justify-center p-10 text-center">
            <ShieldAlert size={80} className="text-red-700 mb-8 animate-pulse" />
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Terminal Error.</h2>
            <p className="text-gray-600 font-black text-[10px] uppercase tracking-[0.4em] mt-4 italic">{error}</p>
            <button onClick={() => navigate('/driver/radar')} className="mt-12 bg-white/5 border border-white/10 text-white px-12 py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] italic hover:bg-white/10 transition-all">Return to Radar HQ</button>
        </div>
    );

    if (!trip) return (
        <div className="h-screen bg-[#050505] flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_20px_#facc15]" />
            <p className="text-[10px] font-black text-gray-800 uppercase tracking-[0.6em] italic animate-pulse">Initializing Field Terminal...</p>
        </div>
    );

    const pickupCoords = trip.pickupLocation?.coordinates ? {
        lat: trip.pickupLocation.coordinates[1],
        lng: trip.pickupLocation.coordinates[0]
    } : { lat: 6.9271, lng: 79.8612 }; 
    
    const dropoffCoords = trip.dropoffLocation?.coordinates ? {
        lat: trip.dropoffLocation.coordinates[1],
        lng: trip.dropoffLocation.coordinates[0]
    } : { lat: 6.9271, lng: 79.8612 };

    return (
        <div className="h-screen w-full bg-[#050505] text-white font-sans flex flex-col md:flex-row overflow-hidden relative">
            
            {/* Tactical Map View */}
            <div className="flex-1 relative z-10 border-r border-white/[0.05]">
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent z-20 pointer-events-none"></div>
                <Map 
                    pickup={pickupCoords} 
                    dropoff={dropoffCoords} 
                    showSearch={false}
                />
                
                <div className="absolute top-10 left-10 z-30">
                    <div className="bg-[#0d0d0d]/90 backdrop-blur-3xl border border-white/10 px-8 py-4 rounded-[2rem] flex items-center space-x-4 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_12px_#dc2626]" />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white italic">Field Operation Live</span>
                    </div>
                </div>

                {/* Live Distance Info Overlay */}
                <div className="absolute bottom-10 left-10 z-30">
                    <div className="bg-[#0d0d0d]/90 backdrop-blur-3xl border border-white/10 p-8 rounded-[3rem] shadow-2xl flex items-center space-x-8 group">
                        <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-accent border border-white/10 group-hover:bg-accent group-hover:text-black transition-all">
                            <Activity size={36} className="animate-pulse" />
                        </div>
     <div>
                            <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.5em] mb-2 italic">Unit Status</p>
                            <p className="text-xl font-black text-white italic tracking-widest leading-none">TELEMETRY_NOMINAL</p>
                            <div className="flex items-center space-x-3 mt-3">
                                <span className="text-[8px] font-black bg-red-700/20 text-red-700 px-2 py-0.5 rounded italic">SIG_LOCKED</span>
                                <span className="text-[8px] text-gray-700 font-black uppercase italic">Freq: 8.4 GHz</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Field Control Terminal */}
            <div className="w-full md:w-[480px] bg-[#0d0d0d] flex flex-col h-full relative shadow-[-50px_0_100px_rgba(0,0,0,0.8)] z-20 border-l border-white/[0.05]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-700 to-transparent"></div>
                
                {/* Header Module */}
                <div className="p-10 border-b border-white/[0.05] bg-black/20">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Field <span className="text-red-700">Protocol.</span></h1>
                            <p className="text-[9px] text-gray-700 font-black uppercase tracking-[0.4em] mt-2 italic text-outline">MISSION_ARCHIVE: {trip._id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center space-x-3">
                            <div className="w-2 h-2 bg-red-700 rounded-full animate-pulse shadow-[0_0_8px_#dc2626]"></div>
                            <span className="text-[10px] font-black text-white italic">LIVE</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-4 relative">
                        <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-white/5 -translate-y-1/2"></div>
                        {['accepted', 'arrived', 'in_progress', 'completed'].map((status, idx) => {
                            const isCurrent = trip.status === status;
                            const isPast = ['accepted', 'arrived', 'in_progress', 'completed'].indexOf(trip.status) > idx;
                            return (
                                <div key={status} className="relative z-10 flex flex-col items-center">
                                    <div className={`w-5 h-5 rounded-full border-4 transition-all duration-700 ${
                                        isCurrent ? 'bg-red-700 border-red-700 scale-150 shadow-[0_0_20px_#dc2626]' : 
                                        isPast ? 'bg-green-500 border-green-500 shadow-[0_0_15px_#22c55e]' : 'bg-[#0d0d0d] border-white/10'
                                    }`} />
                                    <p className={`text-[7px] font-black uppercase tracking-widest mt-4 italic ${isCurrent ? 'text-red-700' : isPast ? 'text-green-500' : 'text-gray-800'}`}>
                                        {status.replace('_', ' ')}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar relative">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                        <Cpu size={200} />
                    </div>

                    {/* Rider Intelligence Card */}
                    <section>
                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] mb-6 block italic">Client Profile Intel</label>
                        <div className="bg-white/[0.03] border border-white/[0.05] p-8 rounded-[3.5rem] flex items-center space-x-8 shadow-2xl relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                <User size={80} />
                            </div>
                            <div className="w-16 h-16 bg-red-700/20 rounded-[1.5rem] flex items-center justify-center text-red-700 font-black text-2xl italic border border-red-700/20 shadow-2xl group-hover:bg-red-700 group-hover:text-white transition-all">
                                {trip.customerId?.fullName?.charAt(0) || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-black text-white uppercase italic leading-none truncate">{trip.customerId?.fullName || 'Unidentified'}</h3>
                                <p className="text-[11px] text-red-700 font-black italic tracking-widest mt-3">{trip.customerId?.phoneNumber || 'DATA_REDACTED'}</p>
                            </div>
                            {trip.customerId?.phoneNumber && (
                                <a href={`tel:${trip.customerId.phoneNumber}`} className="w-14 h-14 bg-white/5 hover:bg-red-700 text-gray-600 hover:text-white rounded-[1.5rem] flex items-center justify-center transition-all border border-white/10 shadow-2xl active:scale-90 group">
                                    <Phone size={30} />
                                </a>
                            )}
                        </div>
                    </section>

                    {/* Mission Logistics */}
                    <section className="space-y-8 px-2">
                        <div className="flex items-start space-x-6 group">
                            <div className="flex flex-col items-center mt-2">
                                <div className="w-2 h-2 bg-accent rounded-full shadow-[0_0_10px_#facc15] group-hover:scale-150 transition-transform" />
                                <div className="w-[1px] h-12 border-l border-white/10 my-2" />
                                <MapPin size={18} className="text-red-700 group-hover:scale-150 transition-transform" />
                            </div>
                            <div className="flex-1 space-y-8">
                                <div>
                                    <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] italic mb-2">Extraction Node</p>
                                    <p className="text-xs font-black text-gray-400 italic leading-relaxed uppercase group-hover:text-white transition-colors">{trip.pickupLocation?.address || 'Locating...'}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] italic mb-2">Dropoff Objective</p>
                                    <p className="text-xs font-black text-gray-400 italic leading-relaxed uppercase group-hover:text-white transition-colors">{trip.dropoffLocation?.address || 'Locating...'}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Active Phase Operations */}
                    <AnimatePresence mode="wait">
                        {trip.status === 'arrived' && (
                            <motion.section 
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                                className="bg-red-700/5 border border-red-700/20 p-10 rounded-[4rem] space-y-10 shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-red-700"></div>
                                <div className="text-center">
                                    <label className="text-[11px] font-black text-red-700 uppercase tracking-[0.5em] block mb-6 italic">Strategic OTP Decryption</label>
                                    <input 
                                        type="text" maxLength="4" placeholder="0 0 0 0"
                                        className="w-full bg-[#050505] border border-white/10 text-center text-7xl font-black tracking-[0.5em] py-8 rounded-[3rem] focus:border-red-700 outline-none text-white italic shadow-2xl placeholder:text-gray-900 transition-all"
                                        value={otp} onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="flex items-center justify-between bg-white/5 p-8 rounded-[2.5rem] cursor-pointer hover:bg-white/10 transition-all border border-white/5 group">
                                        <div className="flex items-center space-x-5">
                                            <Camera size={36} className="text-red-700 group-hover:scale-110 transition-transform" />
                                            <span className="text-[11px] font-black uppercase tracking-[0.3em] italic text-white">{image ? 'METER_RECORDED_SUCCESS' : 'START_METER_SCAN'}</span>
                                        </div>
                                        {image && <CheckCircle size={20} className="text-green-500" />}
                                        <input type="file" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
                                    </label>
                                </div>
                            </motion.section>
                        )}

                        {trip.status === 'in_progress' && (
                            <motion.section 
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                                className="bg-green-500/5 border border-green-500/20 p-10 rounded-[4rem] space-y-10 text-center shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                                <div className="w-20 h-20 bg-green-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-2xl">
                                    <Navigation size={48} className="text-green-500 animate-pulse rotate-45" />
                                </div>
                                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Unit <span className="text-green-500">In Transit.</span></h3>
                                <div className="space-y-8 text-left mt-10">
                                    <div>
                                        <label className="text-[9px] text-gray-700 font-black uppercase tracking-[0.4em] mb-3 block italic ml-4">Total Mission Distance (KM)</label>
                                        <input 
                                            type="number" placeholder="RECORD_KM_NOMINAL"
                                            className="w-full bg-[#050505] border border-white/10 text-center text-4xl font-black py-8 rounded-[3rem] focus:border-green-500 outline-none text-white italic shadow-2xl placeholder:text-gray-900 transition-all"
                                            value={distance} onChange={(e) => setDistance(e.target.value)}
                                        />
                                    </div>
                                    <label className="flex items-center justify-between bg-white/5 p-8 rounded-[2.5rem] cursor-pointer hover:bg-white/10 transition-all border border-white/5 group">
                                        <div className="flex items-center space-x-5">
                                            <Camera size={36} className="text-green-500 group-hover:scale-110 transition-transform" />
                                            <span className="text-[11px] font-black uppercase tracking-[0.3em] italic text-white">{image ? 'FINAL_METER_RECORDED' : 'END_METER_SCAN'}</span>
                                        </div>
                                        {image && <CheckCircle size={20} className="text-green-500" />}
                                        <input type="file" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
                                    </label>
                                </div>
                            </motion.section>
                        )}

                        {trip.status === 'completed' && (
                            <motion.section 
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-500/10 border border-green-500/20 p-12 rounded-[5rem] text-center shadow-[0_0_100px_rgba(34,197,94,0.1)] relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                                    <Shield size={150} />
                                </div>
                                <div className="w-24 h-24 bg-green-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-[0_30px_60px_rgba(34,197,94,0.3)] border border-green-500/20">
                                    <Shield size={56} className="text-black" />
                                </div>
                                <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4 text-white">Mission <br /> <span className="text-green-500">Success.</span></h2>
                                <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em] mb-12 italic">Target Delivery Confirmed</p>
                                
                                <div className="bg-[#050505] p-10 rounded-[3.5rem] mb-6 shadow-2xl relative group overflow-hidden border border-white/5">
                                    <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.5em] mb-4 italic">Mission Credit</p>
                                    <p className="text-5xl font-black text-accent italic tracking-tighter leading-none drop-shadow-[0_0_20px_#facc15]">LKR {trip.calculatedFare.toLocaleString()}</p>
                                    <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                            </motion.section>
                        )}

                        {trip.status === 'cancelled' && (
                            <motion.section 
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-700/10 border border-red-700/20 p-12 rounded-[5rem] text-center shadow-2xl"
                            >
                                <ShieldAlert size={60} className="text-red-700 mx-auto mb-10 animate-pulse" />
                                <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-6 text-white">Mission <br /> <span className="text-red-700">Severed.</span></h2>
                                <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em] mb-12 italic leading-relaxed">Operation terminated by Command. Return to Operational Base immediately.</p>
                                
                                <button 
                                    onClick={() => navigate('/driver/radar')}
                                    className="w-full bg-white hover:bg-red-700 hover:text-white text-black font-black py-7 rounded-[2.5rem] uppercase tracking-[0.3em] text-[11px] italic transition-all shadow-2xl active:scale-95"
                                >
                                    Establish Radar Link
                                </button>
                            </motion.section>
                        )}
                    </AnimatePresence>
                </div>

                {/* Tactical Action Terminal (Footer) */}
                <div className="p-10 bg-black/40 border-t border-white/[0.05] mt-auto">
                    {trip.status === 'accepted' && (
                        <button 
                            onClick={() => handleStatusUpdate('arrive', {})}
                            disabled={loading}
                            className="w-full bg-accent hover:bg-white text-black font-black py-7 rounded-[2.5rem] flex items-center justify-center space-x-6 transition-all active:scale-95 shadow-[0_25px_50px_rgba(250,204,21,0.2)] group"
                        >
                            <span className="uppercase tracking-[0.4em] italic text-xs">Confirm Extraction Reach</span>
                            <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    )}

                    {trip.status === 'arrived' && (
                        <button 
                            onClick={() => {
                                const formData = new FormData();
                                formData.append('otp', otp);
                                if(image) formData.append('startMeterImage', image);
                                handleStatusUpdate('start', formData, true);
                            }}
                            disabled={!otp || !image || loading}
                            className="w-full bg-accent hover:bg-white text-black font-black py-7 rounded-[2.5rem] disabled:opacity-30 transition-all flex items-center justify-center space-x-6 uppercase tracking-[0.4em] italic text-xs shadow-2xl active:scale-95"
                        >
                            {loading ? 'SYNCHRONIZING...' : 'Initialize Mission Profile'}
                        </button>
                    )}

                    {trip.status === 'in_progress' && (
                        <button 
                            onClick={() => {
                                const formData = new FormData();
                                formData.append('totalDistance', distance);
                                if(image) formData.append('endMeterImage', image);
                                handleStatusUpdate('complete', formData, true);
                            }}
                            disabled={!distance || !image || loading}
                            className="w-full bg-red-700 hover:bg-white text-white hover:text-black font-black py-7 rounded-[2.5rem] disabled:opacity-30 transition-all flex items-center justify-center space-x-6 uppercase tracking-[0.4em] italic text-xs shadow-[0_20px_50px_rgba(185,28,28,0.3)] active:scale-95"
                        >
                            {loading ? 'ARCHIVING...' : 'Terminate & Close Mission'}
                        </button>
                    )}

                    {trip.status === 'completed' && (
                        <button 
                            onClick={() => navigate('/driver/radar')}
                            className="w-full bg-white text-black font-black py-7 rounded-[2.5rem] uppercase tracking-[0.4em] italic text-xs shadow-2xl active:scale-95"
                        >
                            Establish New Radar Link
                        </button>
                    )}

                    {trip.status !== 'completed' && trip.status !== 'cancelled' && (
                        <button 
                            onClick={handleCancelTrip}
                            disabled={loading}
                            className="w-full mt-6 py-4 rounded-[1.5rem] bg-red-700/5 border border-red-700/20 text-red-700 text-[10px] font-black uppercase tracking-[0.4em] italic hover:bg-red-700 hover:text-white transition-all disabled:opacity-50 active:scale-95"
                        >
                            {loading ? 'REPROFILING...' : 'Report Tactical Withdrawal (Cancel)'}
                        </button>
                    )}
                </div>

            </div>
            {/* Tactical Chat Overlay */}
            <ChatTerminal tripId={id} currentUser={user} messages={trip.messages || []} />
        </div>
    );
};

export default DriverActiveTrip;
