import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, MapPin, DollarSign, Calendar, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import axios from 'axios';

const DriverHistory = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/trips', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                // Filter trips where user is the driver
                setTrips(res.data.filter(t => t.driver === user._id));
            } catch (err) { console.error(err); }
        };
        fetchHistory();
    }, [user]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12 font-sans relative overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-16">
                    <button onClick={() => navigate('/driver/radar')} className="flex items-center space-x-2 text-gray-500 hover:text-accent transition-colors group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Return to Radar</span>
                    </button>
                    <div className="text-right">
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Mission <span className="text-accent">Logs</span></h1>
                        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-1">Completed Operations</p>
                    </div>
                </header>

                <div className="space-y-6">
                    {trips.length === 0 ? (
                        <div className="text-center py-24 bg-[#111] rounded-[3.5rem] border border-white/[0.03]">
                            <Navigation size={64} className="mx-auto text-gray-800 mb-6" />
                            <p className="text-gray-500 font-black uppercase tracking-widest text-sm">No missions logged yet</p>
                            <button onClick={() => navigate('/driver/radar')} className="mt-8 text-accent text-xs font-black uppercase tracking-widest hover:underline">Go Online Now</button>
                        </div>
                    ) : (
                        trips.map((trip) => (
                            <motion.div 
                                key={trip._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-[#111] p-10 rounded-[3rem] border border-white/[0.03] flex flex-col md:flex-row md:items-center justify-between group hover:border-accent/30 transition-all shadow-xl"
                            >
                                <div className="flex items-center space-x-8 mb-6 md:mb-0">
                                    <div className="w-16 h-16 bg-accent rounded-[1.5rem] flex items-center justify-center text-black shadow-lg shadow-accent/10">
                                        <Calendar size={28} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{new Date(trip.createdAt).toLocaleDateString()}</p>
                                        <p className="text-xl font-black uppercase italic tracking-tight">{trip.tripType.replace('_', ' ')} Hire</p>
                                    </div>
                                </div>

                                <div className="flex-1 md:px-12 space-y-3 mb-8 md:mb-0">
                                    <div className="flex items-center space-x-4 text-sm text-gray-400 font-bold">
                                        <div className="w-2 h-2 rounded-full bg-accent" />
                                        <span className="truncate max-w-[200px] italic">{trip.pickupLocation.address}</span>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-400 font-bold">
                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                        <span className="truncate max-w-[200px] italic">{trip.dropoffLocation.address}</span>
                                    </div>
                                </div>

                                <div className="text-right bg-white/[0.02] p-6 rounded-[1.8rem] border border-white/[0.03] min-w-[150px]">
                                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Earnings</p>
                                    <p className="text-2xl font-black text-accent italic">LKR {trip.calculatedFare?.toLocaleString()}</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DriverHistory;
