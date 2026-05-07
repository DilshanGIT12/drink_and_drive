import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, MessageSquare, X } from 'lucide-react';
import socketService from '../services/socketService';

const ChatTerminal = ({ tripId, currentUser, messages: initialMessages = [] }) => {
    const [messages, setMessages] = useState(initialMessages);
    const [inputText, setInputText] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        // Listen for new messages
        socketService.on('new-message', (data) => {
            if (data.tripId === tripId) {
                setMessages(prev => [...prev, data.message]);
            }
        });

        return () => socketService.off('new-message');
    }, [tripId]);

    useEffect(() => {
        // Scroll to bottom
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        socketService.emit('send-message', {
            tripId,
            text: inputText,
            senderName: currentUser.fullName
        });

        setInputText('');
    };

    return (
        <div className="fixed bottom-10 right-10 z-[3000]">
            <AnimatePresence>
                {isOpen ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-[#0f0f0f] border border-white/10 w-80 md:w-96 h-[500px] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-accent rounded-xl flex items-center justify-center text-black">
                                    <MessageSquare size={16} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-white">Mission Comms</h4>
                                    <p className="text-[8px] text-gray-500 font-bold uppercase tracking-tighter mt-0.5">Secure Encryption Active</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
                        >
                            {messages.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-700 opacity-50">
                                    <MessageSquare size={40} strokeWidth={1} className="mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Secure line established</p>
                                    <p className="text-[8px] uppercase mt-1">Start communication with pilot/client</p>
                                </div>
                            )}
                            
                            {messages.map((msg, i) => {
                                const isMe = msg.senderId === currentUser._id || msg.senderName === currentUser.fullName;
                                return (
                                    <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-bold ${
                                            isMe 
                                            ? 'bg-accent text-black rounded-tr-none shadow-lg shadow-accent/10' 
                                            : 'bg-white/5 text-gray-300 rounded-tl-none border border-white/5'
                                        }`}>
                                            {msg.text}
                                        </div>
                                        <span className="text-[8px] text-gray-600 font-black uppercase tracking-tighter mt-1 px-1">
                                            {isMe ? 'Me' : msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-black/40">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="TYPE COMMAND OR MESSAGE..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-[10px] font-black uppercase outline-none focus:border-accent/30 transition-all placeholder:text-gray-700"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                />
                                <button 
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.button 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 bg-accent rounded-[1.5rem] flex items-center justify-center text-black shadow-2xl shadow-accent/20 border-2 border-black relative"
                    >
                        <MessageSquare size={24} />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-[#0a0a0a] animate-pulse" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatTerminal;
