import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Loader2, ArrowRight, Mail } from "lucide-react";
import { toast } from "react-hot-toast";

const VerifyEmail = () => {
  const { verifyEmail, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
        toast.error("Email not found. Please login or register again.");
        navigate("/login");
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");
    
    setIsLoading(true);
    const success = await verifyEmail(email, otp);
    setIsLoading(false);
    
    if (success) {
      navigate("/");
    }
  };

  const handleResendOtp = async () => {
      setIsResending(true);
      await resendOtp(email);
      setIsResending(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="max-w-md w-full bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
            <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                    <Mail className="text-primary" size={28} />
                </div>
            </div>

            <h2 className="text-4xl font-bold text-foreground mb-2 text-center">Verify Account</h2>
            <p className="text-muted-foreground text-center mb-8 text-sm">
                We sent a code to <span className="text-primary font-medium">{email}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2 ml-1">Verification Code</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    className="w-full bg-background border border-border text-foreground text-lg tracking-widest text-center rounded-full focus:ring-1 focus:ring-primary focus:border-primary block py-3 outline-none transition-all placeholder:tracking-normal"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
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
                    <Loader2 className="animate-spin" size={16}/> Verifying...
                    </>
                ) : (
                    <>
                    Verify Email <ArrowRight size={16} />
                    </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                    Didn't receive the code?{" "}
                    <button 
                        onClick={handleResendOtp} 
                        disabled={isResending}
                        className="text-primary hover:text-primary/80 font-medium hover:underline disabled:opacity-50 ml-1 transition-colors"
                    >
                        {isResending ? "Sending..." : "Resend Code"}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
