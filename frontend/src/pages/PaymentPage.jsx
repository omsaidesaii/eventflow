import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { loadRazorpay } from "../utils/loadRazorpay";
import { useAuth } from "../context/AuthContext";
import { 
    CreditCard, 
    ShieldCheck, 
    ArrowLeft, 
    Ticket as TicketIcon,
    Calendar,
    MapPin,
    Clock,
    User,
    Mail,
    Phone
} from "lucide-react";
import toast from "react-hot-toast";

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    
    const { event, selectedTicket, quantity } = location.state || {};
    
    const [processing, setProcessing] = useState(false);
    const [attendeeDetails, setAttendeeDetails] = useState([]);

    useEffect(() => {
        if (!event || !selectedTicket || !quantity) {
            toast.error("Invalid booking data");
            navigate("/events");
            return;
        }

        const initialAttendees = Array.from({ length: quantity }).map((_, idx) => ({
            name: idx === 0 ? user?.name || "" : "",
            email: idx === 0 ? user?.email || "" : "",
            phone: idx === 0 ? user?.phone || "" : "",
            ticketType: selectedTicket.type,
            price: selectedTicket.price
        }));
        setAttendeeDetails(initialAttendees);
    }, [event, selectedTicket, quantity, user, navigate]);

    const handleAttendeeChange = (index, field, value) => {
        const updated = [...attendeeDetails];
        updated[index][field] = value;
        setAttendeeDetails(updated);
    };

    const validateAttendees = () => {
        for (let i = 0; i < attendeeDetails.length; i++) {
            const attendee = attendeeDetails[i];
            if (!attendee.name || !attendee.email) {
                toast.error(`Please fill all details for Attendee ${i + 1}`);
                return false;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(attendee.email)) {
                toast.error(`Invalid email for Attendee ${i + 1}`);
                return false;
            }
        }
        return true;
    };

    const handlePayment = async () => {
        if (!validateAttendees()) return;

        setProcessing(true);
        const res = await loadRazorpay();
        if (!res) {
            toast.error("Razorpay SDK failed to load");
            setProcessing(false);
            return;
        }

        try {
            const orderRes = await api.post("/payment/create-order", {
                attendees: attendeeDetails,
                eventId: event._id
            });

            if (!orderRes.data.success) throw new Error("Order creation failed");

            const { order } = orderRes.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_RqYe4PqPER9K6W",
                amount: order.amount,
                currency: order.currency,
                name: "EventFlow",
                description: `Booking for ${event.title}`,
                image: "https://your-logo-url.com/logo.png",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await api.post("/payment/verify-payment", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            eventId: event._id,
                            attendees: attendeeDetails
                        });

                        if (verifyRes.data.success) {
                            toast.success("Booking Successful!");
                            navigate("/my-bookings");
                        }
                    } catch (err) {
                        toast.error("Payment verification failed");
                        setProcessing(false);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone || ""
                },
                theme: {
                    color: "#9333ea"
                },
                modal: {
                    ondismiss: function() {
                        setProcessing(false);
                        toast.error("Payment cancelled");
                    }
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Payment failed");
            setProcessing(false);
        }
    };

    if (!event || !selectedTicket) {
        return null;
    }

    const totalAmount = selectedTicket.price * quantity;

    return (
        <div className="min-h-screen py-16 px-4 bg-gradient-to-b from-background via-primary/5 to-background">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 text-sm"
                    >
                        <ArrowLeft size={16} />
                        Back to Event
                    </button>
                    <h1 className="text-5xl font-bold text-foreground mb-2">Complete Your Booking</h1>
                    <p className="text-muted-foreground">Review your order and proceed to payment</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Attendee Details Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-6">
                            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <User className="text-primary" size={20} />
                                Attendee Information
                            </h2>
                            
                            {attendeeDetails.map((attendee, index) => (
                                <div key={index} className="mb-8 pb-8 border-b border-border last:border-b-0 last:mb-0 last:pb-0">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">
                                        Attendee {index + 1}
                                        {index === 0 && <span className="text-xs text-primary ml-2 bg-primary/10 px-2 py-1 rounded-full">(Primary)</span>}
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-muted-foreground text-xs mb-2 ml-1">Full Name *</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                                <input
                                                    type="text"
                                                    value={attendee.name}
                                                    onChange={(e) => handleAttendeeChange(index, 'name', e.target.value)}
                                                    placeholder="Enter full name"
                                                    className="w-full bg-background border border-border rounded-full px-4 pl-11 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-muted-foreground"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-muted-foreground text-xs mb-2 ml-1">Email Address *</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                                <input
                                                    type="email"
                                                    value={attendee.email}
                                                    onChange={(e) => handleAttendeeChange(index, 'email', e.target.value)}
                                                    placeholder="Enter email"
                                                    className="w-full bg-background border border-border rounded-full px-4 pl-11 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-muted-foreground"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="md:col-span-2">
                                            <label className="block text-muted-foreground text-xs mb-2 ml-1">Phone Number (Optional)</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                                <input
                                                    type="tel"
                                                    value={attendee.phone}
                                                    onChange={(e) => handleAttendeeChange(index, 'phone', e.target.value)}
                                                    placeholder="Enter phone number"
                                                    className="w-full bg-background border border-border rounded-full px-4 pl-11 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-muted-foreground"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Security Badge */}
                        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-3xl p-6">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="text-primary" size={28} />
                                <div>
                                    <h3 className="text-foreground font-semibold">Secure Payment</h3>
                                    <p className="text-muted-foreground text-sm">Your payment information is encrypted and secure</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
                            
                            {/* Event Details */}
                            <div className="mb-6 pb-6 border-b border-border">
                                {event.media?.bannerUrl && (
                                    <img 
                                        src={event.media.bannerUrl} 
                                        alt={event.title}
                                        className="w-full h-32 object-cover rounded-2xl mb-4 border border-border"
                                    />
                                )}
                                <h3 className="text-lg font-bold text-foreground mb-3">{event.title}</h3>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-primary" />
                                        <span>{new Date(event.startDateTime).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} className="text-primary" />
                                        <span>{new Date(event.startDateTime).toLocaleTimeString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-primary" />
                                        <span>{event.location?.venue}, {event.location?.city}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Details */}
                            <div className="mb-6 pb-6 border-b border-border space-y-3">
                                <div className="flex justify-between text-muted-foreground text-sm">
                                    <span>Ticket Type</span>
                                    <span className="text-foreground font-semibold">{selectedTicket.type}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground text-sm">
                                    <span>Price per Ticket</span>
                                    <span className="text-foreground">₹{selectedTicket.price}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground text-sm">
                                    <span>Quantity</span>
                                    <span className="text-foreground">{quantity}</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center text-xl font-bold">
                                    <span className="text-foreground">Total Amount</span>
                                    <span className="text-primary">₹{totalAmount}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">Inclusive of all taxes</p>
                            </div>

                            {/* Payment Button */}
                            <button
                                onClick={handlePayment}
                                disabled={processing}
                                className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm active:scale-95"
                            >
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={16} />
                                        Proceed to Payment
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-muted-foreground text-center mt-4">
                                By proceeding, you agree to our Terms & Conditions
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
