import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Users, Download, Eye, Scan, Calendar, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchMyEvents = async () => {
        try {
            const { data } = await api.get("/events/getAllEventByManagerId");
            if (data.success) {
                setEvents(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch events");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const handleDelete = async (eventId) => {
        if(!window.confirm("Are you sure you want to cancel this event? Attendees will be notified.")) return;
        
        try {
            await api.post(`/events/deleteEvent/${eventId}`);
            toast.success("Event cancelled successfully");
            // Refresh events to show updated status
            fetchMyEvents();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel event");
        }
    }

    const handleExportCSV = async (eventId) => {
        try {
            const response = await api.get(`/events/exportCSV/${eventId}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `attendees-${eventId}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
             toast.error("Failed to download CSV");
        }
    }

    if(loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen py-16 px-4 max-w-7xl mx-auto bg-gradient-to-b from-background via-primary/5 to-background">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
                <div>
                    <h1 className="text-5xl font-bold text-foreground mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">Manage your events and attendees</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/scan" className="bg-secondary/50 hover:bg-secondary text-foreground px-5 py-2.5 rounded-full flex items-center gap-2 font-medium transition-all border border-border text-sm hover:border-primary/50">
                        <Scan size={16} /> Scan Tickets
                    </Link>
                    <Link to="/create-event" className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full flex items-center gap-2 font-medium transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] text-sm active:scale-95">
                        <Plus size={16} /> Create Event
                    </Link>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="text-center text-muted-foreground py-20 bg-muted/30 rounded-3xl border border-border border-dashed">
                    <p className="text-lg mb-4">You haven't created any events yet.</p>
                    <Link to="/create-event" className="text-primary hover:underline font-medium">Create your first event</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {events.map((event) => (
                        <div key={event._id} className="bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-6 flex flex-col lg:flex-row gap-6 items-start lg:items-center hover:border-primary/30 transition-colors">
                            <div className="w-full lg:w-56 h-36 rounded-2xl overflow-hidden flex-shrink-0 bg-neutral-900 border border-border">
                                {event.media?.bannerUrl ? (
                                    <img src={event.media.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No Image</div>
                                )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <h3 className="text-2xl font-bold text-foreground mb-3 truncate">{event.title}</h3>
                                <div className="text-muted-foreground text-sm space-y-2">
                                    <p className="flex items-center gap-2">
                                        <Calendar size={14} className="text-primary"/>
                                        {new Date(event.startDateTime).toLocaleDateString()}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <MapPin size={14} className="text-primary"/>
                                        {event.location?.venue}, {event.location?.city}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        Status: 
                                        <span className={`capitalize px-3 py-1 rounded-full text-xs font-medium ${
                                            event.status === 'published' ? 'bg-green-500/10 text-green-500 border border-green-500/30' : 
                                            event.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/30' :
                                            'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
                                        }`}>
                                            {event.status}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                                <Link to={`/event/${event._id}`} className="p-2.5 bg-muted/50 hover:bg-muted rounded-full text-muted-foreground border border-border hover:border-primary/50 transition-all" title="View Event">
                                    <Eye size={16} />
                                </Link>
                                <Link 
                                    to={event.status === 'cancelled' ? '#' : `/edit-event/${event._id}`} 
                                    className={`p-2.5 rounded-full border transition-all ${
                                        event.status === 'cancelled' 
                                        ? 'bg-muted/30 text-muted-foreground/30 border-border cursor-not-allowed' 
                                        : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/30 hover:border-blue-500/50'
                                    }`} 
                                    title={event.status === 'cancelled' ? 'Cannot edit cancelled event' : 'Edit Event'}
                                    onClick={(e) => event.status === 'cancelled' && e.preventDefault()}
                                >
                                    <Edit size={16} />
                                </Link>
                                <Link to={`/event-stats/${event._id}`} className="p-2.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30 hover:border-purple-500/50 transition-all" title="Attendees">
                                    <Users size={16} />
                                </Link>
                                <button onClick={() => handleExportCSV(event._id)} className="p-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-full border border-green-500/30 hover:border-green-500/50 transition-all" title="Export CSV">
                                    <Download size={16} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(event._id)} 
                                    disabled={event.status === 'cancelled'}
                                    className={`p-2.5 rounded-full border transition-all ${
                                        event.status === 'cancelled'
                                        ? 'bg-muted/30 text-muted-foreground/30 border-border cursor-not-allowed'
                                        : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30 hover:border-red-500/50'
                                    }`} 
                                    title={event.status === 'cancelled' ? 'Event already cancelled' : 'Cancel Event'}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
