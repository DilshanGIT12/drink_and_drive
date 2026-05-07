import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Clock, MapPin, DollarSign, Calendar, ArrowLeft, History, FileText, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import axios from 'axios';

const TripHistory = () => {
    const { user, token } = useAuthStore();
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:5000/api/trips', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrips(res.data);
            } catch (err) { 
                console.error('History fetch error:', err); 
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchHistory();
    }, [token]);

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 md:p-16 font-sans relative overflow-hidden">
            
            {/* Background Ambient Glow */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] -z-10"></div>
            
            <div className="max-w-5xl mx-auto relative z-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-24">
                    <div className="flex items-center space-x-8">
                        <button onClick={() => navigate('/customer/dashboard')} className="p-4 bg-white/5 border border-white/10 rounded-[1.5rem] hover:bg-white/10 transition-all group">
                            <ArrowLeft size={30} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none mb-4">Mission <span className="text-accent">Archives.</span></h1>
                            <p className="text-gray-600 font-black text-[10px] uppercase tracking-[0.6em] ml-1 italic text-outline">Historical Operational Logs // Unit-ID: {user?._id?.slice(-8).toUpperCase()}</p>
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-8 shadow-[0_0_20px_#facc15]" />
                        <p className="text-[10px] font-black text-gray-800 uppercase tracking-[0.6em] italic animate-pulse">Decrypting Archival Logs...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {trips.length === 0 ? (
                            <div className="text-center py-32 bg-[#0d0d0d]/80 backdrop-blur-3xl rounded-[4rem] border border-white/[0.05] shadow-2xl relative overflow-hidden">
                                <div className="absolute inset-0 opacity-[0.02] flex items-center justify-center">
                                    <History size={300} />
                                </div>
                                <Clock size={60} className="mx-auto text-gray-800 mb-8 animate-pulse" />
                                <p className="text-gray-500 font-black uppercase tracking-[0.5em] text-sm italic">No Operational Records Found</p>
                                <p className="text-[9px] text-gray-700 font-black uppercase tracking-[0.3em] mt-6 italic">Initialize your first mission to generate logs</p>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {trips.map((trip, idx) => (
                                    <motion.div 
                                        key={trip._id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-[#0d0d0d]/80 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/[0.05] flex flex-col xl:flex-row xl:items-center justify-between group hover:border-accent/30 transition-all shadow-2xl relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-accent/20 group-hover:bg-accent transition-all"></div>
                                        
                                        <div className="flex items-center space-x-8 mb-8 xl:mb-0">
                                            <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-accent border border-white/10 group-hover:bg-accent group-hover:text-black transition-all shadow-2xl">
                                                <Calendar size={36} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em] mb-2 italic">{new Date(trip.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                                <h3 className="text-2xl font-black uppercase italic text-white leading-none tracking-tight">{trip.tripType} Mission</h3>
                                            </div>
                                        </div>

                                        <div className="flex-1 xl:px-16 space-y-4 mb-8 xl:mb-0">
                                            <div className="flex items-center space-x-5 group/loc">
                                                <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_#facc15]" />
                                                <span className="text-xs font-black text-gray-500 italic uppercase tracking-tight truncate max-w-[300px] group-hover/loc:text-white transition-colors">{trip.pickupLocation.address}</span>
                                            </div>
                                            <div className="flex items-center space-x-5 group/loc">
                                                <div className="w-2 h-2 rounded-full bg-red-700 shadow-[0_0_8px_#dc2626]" />
                                                <span className="text-xs font-black text-gray-500 italic uppercase tracking-tight truncate max-w-[300px] group-hover/loc:text-white transition-colors">{trip.dropoffLocation.address}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between xl:justify-end xl:space-x-12">
                                            <div className="text-left xl:text-right">
                                                <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em] mb-2 italic">Settlement Total</p>
                                                <p className="text-3xl font-black text-white italic leading-none tracking-tighter">LKR {trip.calculatedFare?.toLocaleString()}</p>
                                            </div>
                                            <button className="w-14 h-14 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-gray-700 group-hover:text-accent group-hover:bg-white/10 transition-all border border-white/10">
                                                <ChevronRight size={32} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TripHistory;
