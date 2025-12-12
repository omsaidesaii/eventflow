import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, Trash } from "lucide-react";
import toast from "react-hot-toast";

const CreateEvent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "concert",
        startDateTime: "",
        endDateTime: "",
        venue: "",
        city: "",
        state: "",
        banner: null, // File
        streamingLink: "", // Added
    });

    const [tickets, setTickets] = useState([
        { type: "General", price: 500, maxQuantity: 1 }
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if(e.target.files[0]) {
            setFormData(prev => ({ ...prev, banner: e.target.files[0] }));
        }
    };

    const handleTicketChange = (index, field, value) => {
        const newTickets = [...tickets];
        newTickets[index][field] = value;
        setTickets(newTickets);
    };

    const addTicket = () => {
        setTickets([...tickets, { type: "General", price: 500, maxQuantity: 1 }]);
    };

    const removeTicket = (index) => {
        setTickets(tickets.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("category", formData.category);
            data.append("startDateTime", formData.startDateTime);
            data.append("endDateTime", formData.endDateTime);
            data.append("tickets", JSON.stringify(tickets));
            data.append("streamingLink", formData.streamingLink);

            // Location
            const location = {
                venue: formData.venue,
                city: formData.city,
                state: formData.state
            };
            data.append("location", JSON.stringify(location));

            if (formData.banner) {
                data.append("banner", formData.banner);
            }

            const res = await api.post("/events/add-event", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if(res.data.success) {
                toast.success("Event Created Successfully!");
                navigate("/dashboard");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to create event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-16 px-4 max-w-4xl mx-auto bg-gradient-to-b from-background via-primary/5 to-background">
            <div className="mb-12">
                <h1 className="text-5xl font-bold text-foreground mb-2">Create New Event</h1>
                <p className="text-muted-foreground">Fill in the details to create your event</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-card/50 backdrop-blur-sm p-8 rounded-3xl border border-border">
                
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-foreground mb-4">Basic Details</h3>
                    
                    <div>
                        <label className="block text-muted-foreground text-xs mb-2 ml-1">Event Title</label>
                        <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" placeholder="e.g. Summer Music Festival" />
                    </div>

                    <div>
                        <label className="block text-muted-foreground text-xs mb-2 ml-1">Description</label>
                        <textarea name="description" rows="4" value={formData.description} onChange={handleInputChange} className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Tell people what your event is about..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-muted-foreground text-xs mb-2 ml-1">Category</label>
                            <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary">
                                <option value="concert">Concert</option>
                                <option value="workshop">Workshop</option>
                                <option value="sports">Sports</option>
                                <option value="hackathon">Hackathon</option>
                            </select>
                        </div>
                        <div>
                             <label className="block text-muted-foreground text-xs mb-2 ml-1">Banner Image</label>
                             <input type="file" accept="image/*" onChange={handleFileChange} className="w-full bg-background border border-border rounded-full px-4 py-2 text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
                        </div>
                    </div>
                </div>

                {/* Date & Time */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-foreground mb-4">Date & Time</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-muted-foreground text-xs mb-2 ml-1">Start Date & Time</label>
                            <input type="datetime-local" name="startDateTime" required value={formData.startDateTime} onChange={handleInputChange} className="w-full bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-muted-foreground text-xs mb-2 ml-1">End Date & Time</label>
                            <input type="datetime-local" name="endDateTime" required value={formData.endDateTime} onChange={handleInputChange} className="w-full bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-foreground mb-4">Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-3">
                            <label className="block text-muted-foreground text-xs mb-2 ml-1">Venue Name</label>
                            <input type="text" name="venue" required value={formData.venue} onChange={handleInputChange} className="w-full bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" placeholder="e.g. Grand Hall, Convention Center" />
                        </div>
                        <div>
                            <label className="block text-muted-foreground text-xs mb-2 ml-1">City</label>
                            <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="w-full bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Mumbai" />
                        </div>
                        <div>
                            <label className="block text-muted-foreground text-xs mb-2 ml-1">State</label>
                            <input type="text" name="state" required value={formData.state} onChange={handleInputChange} className="w-full bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Maharashtra" />
                        </div>

                         <div className="md:col-span-3">
                            <label className="block text-muted-foreground text-xs mb-2 ml-1">Streaming Link (Optional)</label>
                            <input type="url" name="streamingLink" value={formData.streamingLink} onChange={handleInputChange} className="w-full bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" placeholder="e.g. YouTube Live Link" />
                        </div>
                    </div>
                </div>

                {/* Tickets */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-semibold text-foreground">Tickets</h3>
                        <button type="button" onClick={addTicket} className="text-xs bg-secondary/50 hover:bg-secondary text-foreground px-4 py-2 rounded-full flex items-center gap-1 transition-colors border border-border">
                            <Plus size={14} /> Add Ticket Type
                        </button>
                    </div>
                    
                    {tickets.map((ticket, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end bg-muted/30 p-4 rounded-2xl border border-border">
                            <div className="md:col-span-3">
                                <label className="block text-muted-foreground text-xs mb-2 ml-1">Ticket Type</label>
                                <select 
                                    value={ticket.type} 
                                    onChange={(e) => {
                                        const type = e.target.value;
                                        let price = 0;
                                        if (type === "General") price = 500;
                                        else if (type === "VIP") price = 1500;
                                        else if (type === "Early Bird") price = 300;
                                        else if (type === "Student") price = 200;

                                        const newTickets = [...tickets];
                                        newTickets[index].type = type;
                                        newTickets[index].price = price;
                                        setTickets(newTickets);
                                    }} 
                                    className="w-full bg-background border border-border rounded-full px-4 py-2 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                >
                                    <option value="General">General</option>
                                    <option value="VIP">VIP</option>
                                    <option value="Early Bird">Early Bird</option>
                                    <option value="Student">Student</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-muted-foreground text-xs mb-2 ml-1">Price (₹)</label>
                                <input 
                                    type="number" 
                                    value={ticket.price} 
                                    onChange={(e) => handleTicketChange(index, 'price', Number(e.target.value))} 
                                    className="w-full bg-background border border-border rounded-full px-4 py-2 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
                                />
                            </div>
                             <div className="md:col-span-1">
                                <label className="block text-muted-foreground text-xs mb-2 ml-1">Qty</label>
                                <input 
                                    type="number" 
                                    value={ticket.maxQuantity} 
                                    onChange={(e) => handleTicketChange(index, 'maxQuantity', Number(e.target.value))} 
                                    className="w-full bg-background border border-border rounded-full px-4 py-2 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
                                    placeholder="1"
                                />
                            </div>
                            <div className="md:col-span-1 flex justify-end">
                                {tickets.length > 1 && (
                                    <button type="button" onClick={() => removeTicket(index)} className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-full transition-colors border border-red-500/30">
                                        <Trash size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-sm active:scale-95">
                     {loading ? <Loader2 className="animate-spin" size={16} /> : "Publish Event"}
                </button>

            </form>
        </div>
    );
};

export default CreateEvent;
