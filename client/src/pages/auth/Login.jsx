import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, loading, error, clearError } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(phoneNumber, password);
            // Route based on role
            if (user.role === 'customer') navigate('/customer/dashboard');
            else if (user.role === 'driver') navigate('/driver/radar');
            else if (user.role === 'admin') navigate('/admin/dashboard');
        } catch (err) {
            // Error is handled by store
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md glass p-8 rounded-3xl shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-2xl mb-4 shadow-lg shadow-accent/20">
                        <ShieldCheck className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to your designated driver account</p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm flex justify-between items-center"
                    >
                        <span>{error}</span>
                        <button onClick={clearError} className="text-red-500 hover:text-red-400 font-bold">✕</button>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Phone Number</label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent transition-colors" />
                            <input 
                                type="tel" 
                                required
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full bg-primary-light/50 border border-white/10 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-gray-600"
                                placeholder="07XXXXXXXX"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-accent transition-colors" />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-primary-light/50 border border-white/10 text-white pl-12 pr-12 py-4 rounded-2xl focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-gray-600"
                                placeholder="••••••••"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm px-1">
                        <label className="flex items-center space-x-2 text-gray-400 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-primary text-accent focus:ring-accent" />
                            <span>Remember me</span>
                        </label>
                        <Link to="/forgot-password" size="sm" className="text-accent hover:text-accent-hover font-medium transition-colors">
                            Forgot password?
                        </Link>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-accent hover:bg-accent-hover text-primary font-bold py-4 rounded-2xl shadow-lg shadow-accent/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-accent font-bold hover:underline underline-offset-4">
                            Join the Crew
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
