import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await login(formData.email, formData.password);
        setIsLoading(false);
        if (success) {
            navigate("/");
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 bg-gradient-to-b from-background via-primary/5 to-background">
            <div className="max-w-md w-full bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
                {/* Subtle Background Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                    <h2 className="text-4xl font-bold text-foreground mb-2 text-center">Welcome Back</h2>
                    <p className="text-muted-foreground text-center mb-8 text-sm">Sign in to continue to EventFlow</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-2 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-background border border-border text-foreground text-sm rounded-full focus:ring-1 focus:ring-primary focus:border-primary block pl-11 pr-4 py-2.5 outline-none transition-all placeholder-muted-foreground"
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-2 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-background border border-border text-foreground text-sm rounded-full focus:ring-1 focus:ring-primary focus:border-primary block pl-11 pr-4 py-2.5 outline-none transition-all placeholder-muted-foreground"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                            <div className="flex justify-end mt-2">
                                 <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80 hover:underline">
                                     Forgot password?
                                 </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full text-primary-foreground bg-primary hover:bg-primary/90 font-medium rounded-full text-sm px-6 py-2.5 text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] active:scale-95"
                        >
                            {isLoading ? (
                               <>
                                 <Loader2 className="animate-spin" size={16}/> Signing In...
                               </>
                            ) : "Sign In"}
                        </button>
                        
                        <p className="text-xs text-muted-foreground text-center pt-2">
                            Don't have an account yet?{" "}
                            <Link to="/register" className="font-medium text-primary hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
