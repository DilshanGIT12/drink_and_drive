import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, ShieldCheck, MapPin, Star, ChevronLeft, Send, CheckCircle2, Zap, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/useAuthStore';
import socketService from '../../services/socketService';
import { useNavigate } from 'react-router-dom';

const SpecialPackages = () => {
    const { user, token } = useAuthStore();
    const navigate = useNavigate();
    const [packages, setPackages] = useState([
        { _id: '1', name: 'Strategic Hourly', basePrice: 4000, baseIncludedHours: 1, extraHourRate: 1200, description: 'High-response units for multi-stop city maneuvers and rapid extraction.' },
        { _id: '2', name: 'Elite Long Tour', basePrice: 8000, baseIncludedHours: 10, extraHourRate: 700, description: 'Sustained presence for long-duration missions, weddings, or coastal transits.' }
    ]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [pickupAddress, setPickupAddress] = useState('');
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/packages', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.length > 0) setPackages(res.data);
            } catch (err) { console.error('Using tactical local packages'); }
        };
        fetchPackages();
        if (token) socketService.connect(token);
    }, [token]);

    const handleBookPackage = async () => {
        if (!pickupAddress) return;
        setIsBooking(true);
        
        const tripData = {
            pickupLocation: { address: pickupAddress, coordinates: [0,0] },
            tripType: selectedPackage.name.toLowerCase().includes('hourly') ? 'hourly' : 'long_tour',
            packageId: selectedPackage._id,
            vehicleType: 'both',
            estimatedFare: selectedPackage.basePrice,
            customerName: user.fullName,
            customerPhone: user.phoneNumber
        };

        socketService.emit('request-ride', tripData);
        
        socketService.on('ride-accepted', (data) => {
            navigate(`/customer/active-trip/${data.tripId}`);
        });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 md:p-16 font-sans relative overflow-hidden">
            
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
                <img src="/colombo_night_luxury_ride_1778020489434.png" alt="" className="w-full h-full object-cover blur-3xl scale-125" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-24">
                    <div className="flex items-center space-x-8">
                        <button onClick={() => navigate('/customer/dashboard')} className="p-4 bg-white/5 border border-white/10 rounded-[1.5rem] hover:bg-white/10 transition-all group">
                            <ArrowLeft size={30} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none mb-4">Tactical <span className="text-accent">Hire.</span></h1>
                            <p className="text-gray-600 font-black text-[10px] uppercase tracking-[0.6em] ml-1 italic">Extended Mission Deployment Packages</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
                    {packages.map((pkg) => (
                        <motion.div 
                            key={pkg._id}
                            whileHover={{ y: -10, scale: 1.02 }}
                            onClick={() => setSelectedPackage(pkg)}
                            className={`cursor-pointer p-12 rounded-[4rem] border-2 transition-all duration-700 relative overflow-hidden group ${selectedPackage?._id === pkg._id ? 'border-accent bg-accent/10 shadow-[0_40px_100px_rgba(250,204,21,0.15)]' : 'border-white/[0.05] bg-[#0d0d0d]/80 backdrop-blur-3xl hover:border-white/20'}`}
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                {pkg.name.toLowerCase().includes('hourly') ? <Clock size={120} /> : <Calendar size={120} />}
                            </div>

                            <div className="flex justify-between items-start mb-12">
                                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all ${selectedPackage?._id === pkg._id ? 'bg-accent text-black shadow-2xl' : 'bg-white/5 text-gray-500'}`}>
                                    {pkg.name.toLowerCase().includes('hourly') ? <Clock size={48} /> : <Calendar size={48} />}
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em] mb-2 italic">Base Protocol Rate</p>
                                    <p className="text-5xl font-black tracking-tighter italic text-white leading-none">LKR {pkg.basePrice.toLocaleString()}</p>
                                </div>
                            </div>

                            <h3 className="text-4xl font-black uppercase tracking-tight mb-6 italic text-white leading-none">{pkg.name}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed font-black uppercase tracking-widest italic opacity-70 group-hover:opacity-100 transition-opacity">{pkg.description}</p>
                            
                            <div className="mt-12 pt-10 border-t border-white/[0.05] flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.3em] italic">Mission Window</p>
                                    <p className="text-2xl font-black text-white italic leading-none">{pkg.baseIncludedHours} Hours</p>
                                </div>
                                <div className="space-y-2 text-right">
                                    <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.3em] italic">Over-Time Rate</p>
                                    <p className="text-2xl font-black text-accent italic leading-none">{pkg.extraHourRate} <span className="text-[10px] tracking-widest text-gray-600">/ Hr</span></p>
                                </div>
                            </div>

                            {selectedPackage?._id === pkg._id && (
                                <div className="absolute top-10 right-12 text-accent">
                                    <div className="w-4 h-4 bg-accent rounded-full animate-pulse shadow-[0_0_20px_#facc15]" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                <AnimatePresence>
                    {selectedPackage && (
                        <motion.div 
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="bg-[#0d0d0d]/90 backdrop-blur-3xl p-16 rounded-[5rem] border border-accent/20 shadow-[0_50px_150px_rgba(0,0,0,1)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                                <div>
                                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-10 italic text-white leading-none">Initialization <span className="text-accent">Protocol.</span></h2>
                                    <div className="space-y-10">
                                        <div className="space-y-4 group">
                                            <label className="text-[11px] font-black text-gray-700 uppercase tracking-[0.5em] ml-2 italic group-focus-within:text-accent transition-colors">Extraction Coordinates</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-800 group-focus-within:text-accent transition-colors" />
                                                <input 
                                                    type="text" 
                                                    placeholder="LOCATING EXTRACTION POINT..."
                                                    className="w-full bg-[#050505] border border-white/10 text-white pl-20 pr-10 py-8 rounded-[3rem] focus:border-accent/40 focus:bg-white/[0.05] outline-none transition-all font-black text-sm uppercase italic placeholder:text-gray-900"
                                                    value={pickupAddress}
                                                    onChange={(e) => setPickupAddress(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center p-10 bg-accent/5 rounded-[4rem] border border-accent/20 border-dashed">
                                    <p className="text-[10px] text-accent font-black uppercase tracking-[0.6em] mb-10 italic">Strategic Summary</p>
                                    <div className="text-center space-y-4 mb-12">
                                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest italic">{selectedPackage.name}</p>
                                        <p className="text-6xl font-black text-white italic tracking-tighter leading-none">LKR {selectedPackage.basePrice.toLocaleString()}</p>
                                    </div>
                                    <button 
                                        onClick={handleBookPackage}
                                        disabled={isBooking || !pickupAddress}
                                        className={`w-full font-black py-8 rounded-[3rem] shadow-2xl flex items-center justify-center space-x-6 transition-all active:scale-95 group ${isBooking || !pickupAddress ? 'bg-white/5 text-gray-800' : 'bg-accent hover:bg-white text-black shadow-accent/20 shadow-[0_20px_50px_rgba(250,204,21,0.2)]'}`}
                                    >
                                        {isBooking ? (
                                            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span className="tracking-[0.4em] uppercase text-sm italic">Authorize Deployment</span>
                                                <ShieldCheck size={36} className="group-hover:scale-110 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SpecialPackages;
