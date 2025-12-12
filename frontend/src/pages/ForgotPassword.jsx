import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await api.post("/auth/send-reset-otp", { email });
            if (data.success) {
                toast.success(data.message);
                // Navigate to reset password page carrying the email
                navigate("/reset-password", { state: { email } });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 bg-gradient-to-b from-background via-primary/5 to-background">
            <div className="max-w-md w-full bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="mb-6">
                        <Link to="/login" className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-xs transition-colors">
                            <ArrowLeft size={14} /> Back to Login
                        </Link>
                    </div>

                    <h2 className="text-4xl font-bold text-foreground mb-2 text-center">Forgot Password?</h2>
                    <p className="text-muted-foreground text-center mb-8 text-sm">Enter your email to receive a password reset code</p>

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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full text-primary-foreground bg-primary hover:bg-primary/90 font-medium rounded-full text-sm px-6 py-2.5 text-center transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] active:scale-95"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={16}/> Sending OTP...
                                </>
                            ) : "Send OTP"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
