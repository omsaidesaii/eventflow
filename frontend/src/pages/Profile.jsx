import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { User, Phone, Upload, Loader2, Camera } from "lucide-react";

// Simplified Profile Page for User Updates
const Profile = () => {
    const { user, updateProfile } = useAuth(); // Assuming updateProfile exists in context or we implement local
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

    if(!user) return <div className="min-h-screen flex items-center justify-center text-foreground">Please login...</div>;

    return (
        <div className="min-h-screen py-20 px-4 max-w-2xl mx-auto">
             <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Your Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-border flex items-center justify-center bg-background shadow-lg">
                                {preview ? (
                                    <img src={preview} alt="Avatar" className="w-full h-full object-cover"/>
                                ) : (
                                    <Camera className="text-muted-foreground" size={40} />
                                )}
                            </div>
                            <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                                <Upload className="text-foreground" size={24} />
                            </label>
                            <input 
                                id="avatar-upload" 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleFileChange}
                            />
                        </div>
                        <span className="text-sm text-muted-foreground mt-3">{user.email}</span>
                        <span className="text-xs text-primary uppercase tracking-widest font-semibold mt-1">{user.role}</span>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-background border border-border text-foreground text-sm rounded-lg focus:ring-ring focus:border-ring block pl-10 p-3 outline-none transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    type="tel"
                                    className="w-full bg-background border border-border text-foreground text-sm rounded-lg focus:ring-ring focus:border-ring block pl-10 p-3 outline-none transition-all"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-primary-foreground bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-ring font-medium rounded-lg text-sm px-5 py-3 text-center transition-all disabled:opacity-50 flex justify-center items-center gap-2 mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20}/> : "Save Changes"}
                    </button>
                </form>
             </div>
        </div>
    );
};

export default Profile;
