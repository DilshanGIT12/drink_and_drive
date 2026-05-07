import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Bot, Sparkles, User, ChevronRight, Zap, ShieldAlert, Cpu, Headset } from 'lucide-react';
import socketService from '../services/socketService';
import useAuthStore from '../store/useAuthStore';

const SupportBot = ({ positionClasses = "bottom-32 right-36" }) => {
    const { user } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isLiveChat, setIsLiveChat] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Greetings, Operational Agent. I am the DriveSafe Neural Assistant. Scanning mission parameters...", isBot: true }
    ]);
    const [inputText, setInputText] = useState('');
    const scrollRef = useRef(null);

    const faqs = [
        { q: "RATES", a: "Standard rates start at LKR 2500 for the first 10km, then LKR 100 per km. Hourly/Long Tour packages vary." },
        { q: "BOOKING", a: "Enter pickup/dropoff on your dashboard and initialize the mission. A pilot will be dispatched." },
        { q: "SAFETY", a: "All pilots are verified and missions are tracked live via encrypted tactical links." },
        { q: "DRIVER", a: "Register with the 'Driver' role and upload credentials for HQ verification." }
    ];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    useEffect(() => {
        if (isLiveChat) {
            socketService.on('new-support-message', (data) => {
                // If message is from admin and meant for this user
                if (data.isAdmin && data.userId === user?._id) {
                    setMessages(prev => [...prev, { text: data.text, isBot: true, isAdmin: true }]);
                }
            });
            return () => socketService.off('new-support-message');
        }
    }, [isLiveChat, user?._id]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = { text: inputText, isBot: false };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');

        if (isLiveChat) {
            socketService.emit('send-support-message', {
                text: inputText,
                senderName: user?.fullName,
                isAdmin: false
            });
        } else {
            // Simulate AI Response
            setTimeout(() => {
                let response = "I'm analyzing your request. For immediate tactical support, please contact HQ at +94 11 234 5678 or switch to Live Protocol.";
                
                const lowerInput = inputText.toLowerCase();
                if (lowerInput.includes('rate') || lowerInput.includes('price') || lowerInput.includes('cost')) {
                    response = faqs[0].a;
                } else if (lowerInput.includes('book') || lowerInput.includes('how')) {
                    response = faqs[1].a;
                } else if (lowerInput.includes('safe') || lowerInput.includes('security')) {
                    response = faqs[2].a;
                } else if (lowerInput.includes('driver') || lowerInput.includes('join')) {
                    response = faqs[3].a;
                }

                setMessages(prev => [...prev, { text: response, isBot: true }]);
            }, 800);
        }
    };

    const handleQuickAction = (q, a) => {
        setMessages(prev => [...prev, { text: q, isBot: false }, { text: a, isBot: true }]);
    };

    const toggleLiveSupport = () => {
        setIsLiveChat(true);
        setMessages(prev => [...prev, { text: "INITIALIZING DIRECT HQ LINK... STANDBY.", isBot: true, system: true }]);
        setTimeout(() => {
            setMessages(prev => [...prev, { text: "Protocol Established. An HQ Operator will be with you shortly. State your mission objective.", isBot: true, isAdmin: true }]);
        }, 1500);
    };

    return (
        <div className={`fixed ${positionClasses} z-[3000]`}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 50, x: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50, x: 50 }}
                        className="bg-[#0d0d0d]/95 backdrop-blur-3xl border border-white/10 w-96 md:w-[420px] h-[550px] rounded-[3.5rem] shadow-[0_50px_150px_rgba(0,0,0,1)] flex flex-col overflow-hidden mb-6"
                    >
                        {/* Header */}
                        <div className="p-10 bg-gradient-to-br from-accent/10 to-transparent border-b border-white/[0.05] flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.05]">
                                {isLiveChat ? <Headset size={80} /> : <Cpu size={80} />}
                            </div>
                            <div className="flex items-center space-x-5 relative z-10">
                                <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-black shadow-2xl border transition-all ${isLiveChat ? 'bg-red-600 border-red-600/20' : 'bg-accent border-accent/20'}`}>
                                    {isLiveChat ? <Headset size={32} /> : <Bot size={32} />}
                                </div>
                                <div>
                                    <h4 className="text-lg font-black uppercase tracking-tighter italic text-white leading-none">
                                        DriveSafe <span className={isLiveChat ? 'text-red-600' : 'text-accent'}>{isLiveChat ? 'HQ' : 'AI'}</span>
                                    </h4>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_#22c55e] ${isLiveChat ? 'bg-red-600 shadow-red-600/50' : 'bg-green-500 shadow-green-500/50'}`} />
                                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.4em] italic leading-none">
                                            {isLiveChat ? 'Direct Secure Link' : 'Neural Link Active'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-white transition-colors p-2 bg-white/5 rounded-xl border border-white/10">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar relative">
                            <div className="absolute inset-0 opacity-[0.01] pointer-events-none flex items-center justify-center">
                                <Zap size={300} />
                            </div>
                            
                            {messages.map((msg, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={i} 
                                    className={`flex items-start space-x-4 ${msg.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}
                                >
                                    <div className={`w-10 h-10 rounded-[1.2rem] flex items-center justify-center flex-shrink-0 shadow-2xl border ${msg.isBot ? 'bg-white/5 text-accent border-white/5' : 'bg-accent text-black border-accent/20'}`}>
                                        {msg.isBot ? (msg.isAdmin ? <Headset size={18} className="text-red-600" /> : <Bot size={18} />) : <User size={18} />}
                                    </div>
                                    <div className={`p-6 rounded-[2.5rem] text-[12px] font-black leading-relaxed shadow-2xl italic tracking-tight ${
                                        msg.isBot 
                                        ? `bg-white/[0.03] text-gray-400 border border-white/[0.05] rounded-tl-none uppercase tracking-widest ${msg.isAdmin ? 'border-red-600/20 text-white' : ''}` 
                                        : 'bg-accent text-black rounded-tr-none'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            
                            {/* Suggested Protocols or Live Switch */}
                            {!isLiveChat && (
                                <div className="pt-6 space-y-4">
                                    <p className="text-[9px] text-gray-700 font-black uppercase tracking-[0.5em] mb-4 italic ml-2">Tactical Protocols</p>
                                    <div className="flex flex-wrap gap-3">
                                        {faqs.map((f, i) => (
                                            <button 
                                                key={i}
                                                onClick={() => handleQuickAction(f.q, f.a)}
                                                className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-all italic"
                                            >
                                                {f.q}
                                            </button>
                                        ))}
                                        <button 
                                            onClick={toggleLiveSupport}
                                            className="px-6 py-3 bg-red-600/10 border border-red-600/40 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-red-500 hover:bg-red-600 hover:text-white transition-all italic flex items-center space-x-3"
                                        >
                                            <Headset size={14} />
                                            <span>Live Protocol</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-8 bg-black/40 border-t border-white/[0.05]">
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    placeholder={isLiveChat ? "TRANSMIT MESSAGE TO HQ..." : "SYNCHRONIZE QUERY..."}
                                    className={`w-full bg-[#050505] border border-white/10 rounded-[2rem] py-6 pl-8 pr-20 text-[11px] font-black uppercase italic outline-none transition-all text-white placeholder:text-gray-900 ${isLiveChat ? 'focus:border-red-600/40' : 'focus:border-accent/40'}`}
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                />
                                <button 
                                    type="submit"
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 rounded-[1.4rem] flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all shadow-2xl ${isLiveChat ? 'bg-red-600 shadow-red-600/30' : 'bg-accent shadow-accent/30'}`}
                                >
                                    <Send size={24} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button 
                drag
                dragConstraints={{ left: -1000, right: 0, top: -1000, bottom: 0 }}
                dragElastic={0.1}
                dragMomentum={false}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9, cursor: 'grabbing' }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-20 h-20 rounded-[2.2rem] flex items-center justify-center shadow-[0_30px_60px_rgba(0,0,0,0.8)] transition-all border-2 border-black relative group cursor-grab active:cursor-grabbing ${isOpen ? 'bg-white text-black border-white/20' : isLiveChat ? 'bg-red-600 text-white animate-pulse' : 'bg-accent text-black animate-gold-pulse shadow-accent/20'}`}
            >
                {isOpen ? <X size={44} /> : isLiveChat ? <Headset size={44} /> : <Bot size={44} />}
                {!isOpen && (
                    <div className="absolute -top-16 right-0 bg-white text-black px-6 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.3em] italic opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-2xl whitespace-nowrap">
                        {isLiveChat ? 'HQ Link Active' : 'Neural Support Active'}
                    </div>
                )}
            </motion.button>
        </div>
    );
};

export default SupportBot;
