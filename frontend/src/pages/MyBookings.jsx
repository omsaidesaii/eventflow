import { useEffect, useState } from "react";
import api from "../api/axios";
import { Ticket, Calendar, QrCode, MapPin } from "lucide-react";

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get("/user/myBookings");
                if (data.data) {
                    setBookings(data.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    if(loading) return <div className="min-h-screen text-foreground flex items-center justify-center">Loading tickets...</div>;

    return (
        <div className="min-h-screen py-16 px-4 max-w-6xl mx-auto bg-gradient-to-b from-background via-primary/5 to-background">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-foreground mb-4">My Tickets</h1>
                <p className="text-muted-foreground text-lg">View and manage your event bookings</p>
            </div>
            
            {bookings.length === 0 ? (
                <div className="text-center text-muted-foreground py-20 bg-muted/30 rounded-3xl border border-border border-dashed">
                    <Ticket className="mx-auto mb-4 opacity-50" size={48} />
                    <p className="text-lg">You haven't booked any tickets yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map((booking, idx) => (
                        <div key={idx} className="bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden group hover:border-primary/30 transition-colors">
                            {/* Left Side (Event Info) */}
                            <div className="flex-1">
                                <span className="bg-primary/20 text-primary border border-primary/30 px-4 py-1.5 rounded-full text-xs font-bold mb-3 inline-block uppercase tracking-wider">
                                    {booking.ticketType} Ticket
                                </span>
                                
                                {/* Show event status if cancelled or deleted */}
                                {(booking.event?.status === 'cancelled' || booking.event?.status === 'deleted' || booking.status === 'cancelled') && (
                                    <div className="mb-2">
                                        <span className="bg-red-500/10 text-red-500 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                            Event Cancelled
                                        </span>
                                    </div>
                                )}
                                
                                <h3 className="text-2xl font-bold text-foreground mb-3">{booking.event?.title || "Event Cancelled"}</h3>
                                <div className="text-muted-foreground flex flex-col gap-2 text-sm mb-4">
                                    <span className="flex items-center gap-2">
                                        <Calendar size={16} className="text-primary"/>
                                        {booking.event?.startDateTime ? new Date(booking.event.startDateTime).toLocaleDateString() : "N/A"}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <MapPin size={16} className="text-primary"/>
                                        {booking.event?.location?.venue || "N/A"}
                                    </span>
                                </div>
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
                                    booking.status === 'active' && booking.event?.status !== 'cancelled' && booking.event?.status !== 'deleted' ? 'bg-green-500/10 border border-green-500/30' :
                                    booking.status === 'cancelled' || booking.event?.status === 'cancelled' || booking.event?.status === 'deleted' ? 'bg-red-500/10 border border-red-500/30' :
                                    'bg-blue-500/10 border border-blue-500/30'
                                }`}>
                                    <div className={`w-2 h-2 rounded-full ${
                                        booking.status === 'active' && booking.event?.status !== 'cancelled' && booking.event?.status !== 'deleted' ? 'bg-green-500 animate-pulse' :
                                        booking.status === 'cancelled' || booking.event?.status === 'cancelled' || booking.event?.status === 'deleted' ? 'bg-red-500' :
                                        'bg-blue-500'
                                    }`}></div>
                                    <span className={`capitalize text-xs font-medium ${
                                        booking.status === 'active' && booking.event?.status !== 'cancelled' && booking.event?.status !== 'deleted' ? 'text-green-500' :
                                        booking.status === 'cancelled' || booking.event?.status === 'cancelled' || booking.event?.status === 'deleted' ? 'text-red-500' :
                                        'text-blue-500'
                                    }`}>
                                        {booking.status === 'cancelled' || booking.event?.status === 'cancelled' || booking.event?.status === 'deleted' ? 'cancelled' : booking.status}
                                    </span>
                                </div>
                            </div>

                            {/* Right Side (QR) */}
                            <div className="border-l border-border pl-6 flex flex-col items-center justify-center min-w-[150px]">
                                {booking.qrCode ? (
                                    <div className="bg-white p-3 rounded-2xl shadow-lg">
                                        <img src={booking.qrCode} alt="QR" className="w-28 h-28" />
                                    </div>
                                ) : (
                                    <div className="bg-muted/30 p-6 rounded-2xl">
                                        <QrCode className="text-muted-foreground" size={48} />
                                    </div>
                                )}
                                <div className="mt-4 text-center">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Ticket ID</p>
                                    <p className="text-xs font-mono font-semibold text-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border">{booking.ticketId}</p>
                                </div>
                            </div>

                             {/* Decoration */}
                             <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border-r border-border"></div>
                             <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full border-l border-border"></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
