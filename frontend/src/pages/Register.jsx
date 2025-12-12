import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Upload, Loader2, Camera } from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "attendee",
  });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("password", formData.password);
    data.append("role", formData.role);
    if (avatar) {
      data.append("avatar", avatar);
    }

    const result = await register(data);
    setIsLoading(false);
    if (result.success) {
      navigate("/verify-email", { state: { email: result.email } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="max-w-xl w-full bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-8 shadow-xl relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-foreground mb-2 text-center">Create Account</h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">Join the community of event enthusiasts</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-4">
               <div className="relative group">
                   <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-border flex items-center justify-center bg-background/50">
                       {preview ? (
                           <img src={preview} alt="Avatar" className="w-full h-full object-cover"/>
                       ) : (
                           <Camera className="text-muted-foreground" size={24} />
                       )}
                   </div>
                   <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                       <Upload className="text-white" size={18} />
                   </label>
                   <input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileChange}
                   />
               </div>
               <span className="text-xs text-muted-foreground mt-2">Upload Profile Picture</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      type="text"
                      required
                      className="w-full bg-background border border-border text-foreground text-sm rounded-full focus:ring-1 focus:ring-primary focus:border-primary block pl-11 pr-4 py-2.5 outline-none transition-all placeholder-muted-foreground"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2 ml-1">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      type="tel"
                      required
                      className="w-full bg-background border border-border text-foreground text-sm rounded-full focus:ring-1 focus:ring-primary focus:border-primary block pl-11 pr-4 py-2.5 outline-none transition-all placeholder-muted-foreground"
                      placeholder="1234567890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
            </div>

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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2 ml-1">I am an</label>
              <div className="grid grid-cols-2 gap-3">
                  <button 
                      type="button" 
                      onClick={() => setFormData({...formData, role: 'attendee'})}
                      className={`py-2.5 rounded-full border text-xs font-medium transition-all ${formData.role === 'attendee' ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_20px_rgba(255,255,255,0.15)]' : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:border-primary/50'}`}
                  >
                      Attendee
                  </button>
                  <button 
                      type="button" 
                      onClick={() => setFormData({...formData, role: 'organizer'})}
                      className={`py-2.5 rounded-full border text-xs font-medium transition-all ${formData.role === 'organizer' ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_20px_rgba(255,255,255,0.15)]' : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:border-primary/50'}`}
                  >
                      Organizer
                  </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-primary-foreground bg-primary hover:bg-primary/90 font-medium rounded-full text-sm px-6 py-2.5 text-center transition-all disabled:opacity-50 mt-4 flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] active:scale-95"
            >
              {isLoading ? (
                  <>
                  <Loader2 className="animate-spin" size={16}/> Creating Account...
                  </>
              ) : "Create Account"}
            </button>

            <p className="text-xs text-muted-foreground text-center pt-2">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
