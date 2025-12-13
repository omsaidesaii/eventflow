import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Loader2, Plus, Trash, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
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
        streamingLink: "", 
    });

    const [tickets, setTickets] = useState([]);
    const [existingBanner, setExistingBanner] = useState("");

    // Fetch existing event data
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/getEventById/${id}`);
                if (data.success) {
                    const e = data.data;
                    setFormData({
                        title: e.title,
                        description: e.description,
                        category: e.category,
                        // Format dates to YYYY-MM-DDTHH:MM for input[type=datetime-local]
                        startDateTime: new Date(e.startDateTime).toISOString().slice(0, 16),
                        endDateTime: new Date(e.endDateTime).toISOString().slice(0, 16),
                        venue: e.location.venue,
                        city: e.location.city,
                        state: e.location.state,
                        streamingLink: e.media?.streamingLink || "",
                        banner: null
                    });
                    setTickets(e.tickets);
                    setExistingBanner(e.media?.bannerUrl);
                }
            } catch (error) {
                toast.error("Failed to load event");
                navigate("/dashboard");
            } finally {
                setFetching(false);
            }
        };
        fetchEvent();
    }, [id, navigate]);


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
            // Append only changed fields or all fields
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("category", formData.category);
            data.append("startDateTime", formData.startDateTime);
            data.append("endDateTime", formData.endDateTime);
            data.append("tickets", JSON.stringify(tickets));
            data.append("media.streamingLink", formData.streamingLink);

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

            const res = await api.post(`/events/edit-event/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if(res.data.success) {
                toast.success("Event Updated Successfully!");
                navigate("/dashboard");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update event");
        } finally {
            setLoading(false);
        }
    };

    if(fetching) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen py-10 px-4 max-w-4xl mx-auto">
            <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground transition mb-6 text-sm gap-2 w-fit">
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-8">Edit Event</h1>

            <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 rounded-2xl border border-border">
                
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary border-b border-border pb-2">Basic Details</h3>
                    
                    <div>
                        <label className="block text-muted-foreground text-sm mb-1">Event Title</label>
                        <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-primary" />
                    </div>

                    <div>
                        <label className="block text-muted-foreground text-sm mb-1">Description</label>
                        <textarea name="description" rows="4" value={formData.description} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-primary" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-muted-foreground text-sm mb-1">Category</label>
                            <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-primary">
                                <option value="concert">Concert</option>
                                <option value="workshop">Workshop</option>
                                <option value="sports">Sports</option>
                                <option value="hackathon">Hackathon</option>
                            </select>
                        </div>
                        <div>
                             <label className="block text-muted-foreground text-sm mb-1">Banner Image</label>
                             <div className="flex gap-4 items-center">
                                 {existingBanner && <img src={existingBanner} alt="Current" className="w-16 h-10 object-cover rounded opacity-50" />}
                                 <input type="file" accept="image/*" onChange={handleFileChange} className="w-full bg-background border border-border rounded-lg p-2 text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
                             </div>
                        </div>
                    </div>
                </div>

                {/* Date & Time */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary border-b border-border pb-2">Date & Time</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-muted-foreground text-sm mb-1">Start Date & Time</label>
                            <input type="datetime-local" name="startDateTime" required value={formData.startDateTime} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-muted-foreground text-sm mb-1">End Date & Time</label>
                            <input type="datetime-local" name="endDateTime" required value={formData.endDateTime} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-primary" />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary border-b border-border pb-2">Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-3">
                            <label className="block text-muted-foreground text-sm mb-1">Venue Name</label>
                            <input type="text" name="venue" required value={formData.venue} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-muted-foreground text-sm mb-1">City</label>
                            <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-muted-foreground text-sm mb-1">State</label>
                            <input type="text" name="state" required value={formData.state} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-primary" />
                        </div>

                         <div className="md:col-span-3">
                            <label className="block text-muted-foreground text-sm mb-1">Streaming Link (Optional)</label>
                            <input type="url" name="streamingLink" value={formData.streamingLink} onChange={handleInputChange} className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-primary" />
                        </div>
                    </div>
                </div>

                {/* Tickets */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-border pb-2">
                        <h3 className="text-xl font-semibold text-primary">Tickets</h3>
                        <button type="button" onClick={addTicket} className="text-sm bg-muted hover:bg-muted/80 text-foreground px-3 py-1 rounded-md flex items-center gap-1 transition-colors">
                            <Plus size={16} /> Add Ticket Type
                        </button>
                    </div>
                    
                    {tickets.map((ticket, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end bg-muted/50 p-4 rounded-lg">
                            <div className="md:col-span-3">
                                <label className="block text-muted-foreground text-xs mb-1">Ticket Type</label>
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
                                        // Only update price if it's 0 (new) or user hasn't customized it? 
                                        // For now, let's auto-update it to match CreateEvent behavior which forces the default price for that type
                                        newTickets[index].price = price;
                                        setTickets(newTickets);
                                    }} 
                                    className="w-full bg-background border border-border rounded-md p-2 text-foreground text-sm focus:outline-none focus:border-primary"
                                >
                                    <option value="General">General</option>
                                    <option value="VIP">VIP</option>
                    
                                    <option value="Early Bird">Early Bird</option>
                                    <option value="Student">Student</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-muted-foreground text-xs mb-1">Price (₹)</label>
                                <input 
                                    type="number" 
                                    value={ticket.price} 
                                    onChange={(e) => handleTicketChange(index, 'price', Number(e.target.value))} 
                                    className="w-full bg-background border border-border rounded-md p-2 text-foreground text-sm" 
                                />
                            </div>
                             <div className="md:col-span-1">
                                <label className="block text-muted-foreground text-xs mb-1">Qty</label>
                                <input 
                                    type="number" 
                                    value={ticket.maxQuantity} 
                                    onChange={(e) => handleTicketChange(index, 'maxQuantity', Number(e.target.value))} 
                                    className="w-full bg-background border border-border rounded-md p-2 text-foreground text-sm" 
                                    placeholder="1"
                                />
                            </div>
                            <div className="md:col-span-1 flex justify-end">
                                {tickets.length > 1 && (
                                    <button type="button" onClick={() => removeTicket(index)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors">
                                        <Trash size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                     {loading ? <Loader2 className="animate-spin" /> : "Update Event"}
                </button>

            </form>
        </div>
    );
};

export default EditEvent;
