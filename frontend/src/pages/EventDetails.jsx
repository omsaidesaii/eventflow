import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Calendar, MapPin, Share2, Clock, Ticket as TicketIcon, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const EventDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [hasBooked, setHasBooked] = useState(false);

    useEffect(() => {
        const fetchEventAndStatus = async () => {
            try {
                // Parallel fetch: Event and User Bookings (if logged in)
                const eventPromise = api.get(`/events/getEventById/${id}`);
                const bookingPromise = user ? api.get("/user/myBookings") : Promise.resolve({ data: { success: false } });

                const [eventRes, bookingRes] = await Promise.all([eventPromise, bookingPromise]);

                if (eventRes.data.success) {
                    setEvent(eventRes.data.data);
                    if(eventRes.data.data.tickets.length > 0) setSelectedTicket(eventRes.data.data.tickets[0]);
                }

                if (user && bookingRes.data?.data) {
                    const bookings = bookingRes.data.data;
                    // Check if any booking matches current event ID
                    // booking.event.id is the weird structure from getMyBookings controller
                    const isBooked = bookings.some(b => b.event?.id === id || b.eventId?._id === id); 
                    if(isBooked) setHasBooked(true);
                }

            } catch (error) {
                console.error(error);
                if (error.response?.status === 401) {
                    toast.error("Please login to view details", { id: "auth-error" });
                    navigate("/login");
                } else {
                    toast.error("Failed to load event data", { id: "load-error" });
                    navigate("/");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchEventAndStatus();
    }, [id, navigate, user]);

    const handleBooking = () => {
        if (!user) {
            toast.error("Please login to book tickets");
            navigate("/login");
            return;
        }

        if(!selectedTicket) return;
        
        // Navigate to payment page with booking details
        navigate("/payment", {
            state: {
                event,
                selectedTicket,
                quantity
            }
        });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-foreground">Loading...</div>;
    if (!event) return null;

    return (
        <div className="min-h-screen pb-20 bg-gradient-to-b from-background via-primary/5 to-background">
            {/* Banner */}
            <div className="h-[450px] w-full relative">
                 {event.media?.bannerUrl ? (
                     <img src={event.media.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
                 ) : (
                     <div className="w-full h-full bg-neutral-900" />
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <button 
                    onClick={() => navigate("/events")} 
                    className="absolute top-6 left-4 md:left-8 z-20 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all border border-white/10 text-sm font-medium"
                >
                    <ArrowLeft size={16} /> Back to Events
                </button>
                <div className="absolute bottom-0 left-0 w-full p-8 max-w-7xl mx-auto">
                    <span className="bg-white/90 backdrop-blur-md text-black px-4 py-1.5 rounded-full text-xs font-bold mb-4 inline-block uppercase tracking-wider">{event.category}</span>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{event.title}</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Info Pills */}
                    <div className="flex flex-wrap gap-3 text-muted-foreground">
                        <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2.5 rounded-full border border-border text-sm">
                             <Calendar className="text-primary" size={16} />
                             <span>{new Date(event.startDateTime).toLocaleDateString()}</span>
                        </div>
                         <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2.5 rounded-full border border-border text-sm">
                             <Clock className="text-primary" size={16} />
                             <span>{new Date(event.startDateTime).toLocaleTimeString()}</span>
                        </div>
                         <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2.5 rounded-full border border-border text-sm">
                             <MapPin className="text-primary" size={16} />
                             <span>{event.location?.venue}, {event.location?.city}</span>
                        </div>
                    </div>

                    {/* Cancelled Event Notice */}
                    {event.status === 'cancelled' && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                            <h3 className="text-xl font-bold text-red-500 mb-2">⚠️ Event Cancelled</h3>
                            <p className="text-red-400">This event has been cancelled by the organizer. Tickets are no longer available for purchase.</p>
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <h3 className="text-3xl font-bold text-foreground mb-4">About Event</h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{event.description || "No description provided."}</p>
                    </div>

                    {/* Gallery if any */}
                    {event.media?.gallery?.length > 0 && (
                        <div>
                             <h3 className="text-3xl font-bold text-foreground mb-4">Gallery</h3>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {event.media.gallery.map((img, i) => (
                                    <img key={i} src={img} className="rounded-2xl hover:scale-105 transition-transform cursor-pointer border border-border" />
                                ))}
                             </div>
                        </div>
                    )}
                </div>

                {/* Booking Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-6 sticky top-24">
                        <h3 className="text-2xl font-bold text-foreground mb-6">Select Tickets</h3>
                        
                        <div className="mb-6">
                            <label className="block text-muted-foreground text-xs mb-2 ml-1">Select Ticket Type</label>
                            <select
                                value={selectedTicket?._id || ""}
                                onChange={(e) => {
                                    const ticket = event.tickets.find(t => t._id === e.target.value);
                                    setSelectedTicket(ticket);
                                }}
                                disabled={hasBooked}
                                className="w-full bg-background border border-border rounded-full px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {event.tickets.map(ticket => (
                                    <option key={ticket._id} value={ticket._id}>
                                        {ticket.type} - ₹{ticket.price}
                                    </option>
                                ))}
                            </select>
                            
                            {selectedTicket && (
                                <p className="text-xs text-muted-foreground mt-2 text-right">
                                    {selectedTicket.maxQuantity - selectedTicket.soldCount} seats left
                                </p>
                            )}
                        </div>

                        {!hasBooked && (
                            <>
                                <div className="flex items-center justify-between mb-6 bg-muted/30 p-4 rounded-2xl">
                                    <span className="text-muted-foreground text-sm">Quantity</span>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-background text-foreground border border-border flex items-center justify-center hover:bg-muted text-sm font-medium">-</button>
                                        <span className="text-foreground font-bold min-w-[20px] text-center">{quantity}</span>
                                        <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-8 h-8 rounded-full bg-background text-foreground border border-border flex items-center justify-center hover:bg-muted text-sm font-medium">+</button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-6 text-foreground text-xl font-bold">
                                    <span>Total</span>
                                    <span>₹{(selectedTicket?.price || 0) * quantity}</span>
                                </div>
                            </>
                        )}

                        {hasBooked ? (
                            <button 
                                onClick={() => navigate("/my-bookings")}
                                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] text-sm"
                            >
                                Already Booked (View Ticket)
                            </button>
                        ) : event.status === 'cancelled' ? (
                            <button 
                                disabled
                                className="w-full py-3 bg-red-500/20 text-red-400 font-medium rounded-full cursor-not-allowed text-sm border border-red-500/30"
                            >
                                Event Cancelled - Booking Unavailable
                            </button>
                        ) : (
                            <button 
                                onClick={handleBooking}
                                disabled={!selectedTicket}
                                className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-sm"
                            >
                                Book Tickets
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
