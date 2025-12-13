import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { User, Phone, Upload, Loader2, Camera, Mail, Shield, ArrowLeft } from "lucide-react";

const Profile = () => {
    const navigate = useNavigate();
    const { user, updateProfile, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
    });
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if(user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || ""
            });
            if(user.avatar) setPreview(user.avatar);
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setAvatar(file);
          setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append("name", formData.name);
        data.append("phone", formData.phone);
        if (avatar) {
            data.append("avatar", avatar);
        }

        await updateProfile(data);
        setLoading(false);
    };

    if (authLoading || !user) {
        return <div className="min-h-screen flex items-center justify-center text-foreground">Loading Profile...</div>;
    }

    return (
        <div className="min-h-screen py-16 px-4 max-w-7xl mx-auto bg-gradient-to-b from-background via-primary/5 to-background">
             
            {/* Header */}
            <div className="mb-12">
                <button onClick={() => navigate(-1)} className="flex items-center text-muted-foreground hover:text-foreground transition mb-6 text-sm gap-2">
                    <ArrowLeft size={16} /> Back
                </button>
                <h1 className="text-5xl font-bold text-foreground mb-4">My Profile</h1>
                <p className="text-muted-foreground text-lg">Manage your personal information and account settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Identity Card */}
                <div className="lg:col-span-1">
                    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-8 flex flex-col items-center text-center shadow-lg sticky top-24">
                        <div className="relative group mb-6">
                            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-background ring-2 ring-border flex items-center justify-center bg-muted/50 shadow-2xl relative">
                                {preview ? (
                                    <img src={preview} alt="Avatar" className="w-full h-full object-cover"/>
                                ) : (
                                    <Camera className="text-muted-foreground" size={48} />
                                )}
                            </div>
                            <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-all duration-300">
                                <Upload className="text-white scale-75 group-hover:scale-100 transition-transform" size={28} />
                            </label>
                            <input 
                                id="avatar-upload" 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleFileChange}
                            />
                        </div>
                        
                        <h2 className="text-2xl font-bold text-foreground mb-1">{user.name}</h2>
                        <p className="text-muted-foreground mb-4">{user.email}</p>
                        
                        <div className="flex flex-wrap gap-2 justify-center">
                            <span className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <Shield size={12}/> {user.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="lg:col-span-2">
                    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-8 shadow-lg">
                        <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                            <User size={20} className="text-primary"/> Personal Details
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-2 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-background border border-border text-foreground text-sm rounded-full focus:ring-1 focus:ring-primary focus:border-primary block pl-11 pr-4 py-3 outline-none transition-all placeholder:text-muted-foreground/50"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground mb-2 ml-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                        <input
                                            type="tel"
                                            className="w-full bg-background border border-border text-foreground text-sm rounded-full focus:ring-1 focus:ring-primary focus:border-primary block pl-11 pr-4 py-3 outline-none transition-all placeholder:text-muted-foreground/50"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>
                                </div>
                            </div>

                             <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-2 ml-1">Email Address</label>
                                <div className="relative opacity-60 cursor-not-allowed">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                    <input
                                        type="email"
                                        readOnly
                                        disabled
                                        className="w-full bg-muted border border-border text-muted-foreground text-sm rounded-full block pl-11 pr-4 py-3 cursor-not-allowed"
                                        value={user.email}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1.5 ml-1">Email address cannot be changed</p>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full text-sm transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18}/> : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
