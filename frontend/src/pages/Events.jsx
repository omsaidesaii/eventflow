import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Search, ArrowRight, Loader, Ticket } from "lucide-react";
import PixelCard from "../components/PixelCard";

const Events = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await api.get("/user/getAllEvents");
                if (data.success) {
                    setEvents(data.data);
                    setFilteredEvents(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch events");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        let result = events;

        // Filter by Search
        if (searchTerm) {
            result = result.filter(event => 
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location?.city.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by Category
        if (selectedCategory !== "All") {
            result = result.filter(event => event.category === selectedCategory);
        }

        setFilteredEvents(result);
    }, [searchTerm, selectedCategory, events]);

    const categories = ["All", "concert", "workshop", "sports", "hackathon"];

    return (
        <div className="min-h-screen py-16 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
                    Explore Events
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Discover amazing events happening around you
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-12 bg-gradient-to-b from-background to-primary/5 p-6 rounded-3xl border border-border">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search events, cities..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-background border border-border rounded-full py-2.5 pl-12 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground"
                    />
                </div>
                
                <div className="flex items-center overflow-x-auto gap-2 pb-2 md:pb-0 no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                                selectedCategory === cat 
                                ? "bg-primary border-primary text-primary-foreground shadow-[0_0_20px_rgba(255,255,255,0.15)]" 
                                : "bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:border-primary/50"
                            }`}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Event Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                     <Loader className="animate-spin text-primary" size={40} />
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-3xl border border-border border-dashed">
                    <Ticket size={48} className="mx-auto mb-4 opacity-50 text-muted-foreground"/>
                    <p className="text-muted-foreground text-lg">No events found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {filteredEvents.map(event => (
                        <Link to={`/event/${event._id}`} key={event._id} className="block">
                            <PixelCard variant="default" className="w-[100%] h-[440px] border-none bg-transparent">
                                <div className="absolute inset-0 z-0">
                                   {event.media?.bannerUrl ? (
                                        <img src={event.media.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-muted-foreground">
                                            <Ticket size={40} className="opacity-20"/>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                </div>
                                
                                <div className="absolute top-4 right-4 z-10">
                                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-black uppercase tracking-wider">
                                        {event.category}
                                    </span>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col gap-2">
                                     <h3 className="text-2xl font-bold text-white leading-tight line-clamp-2">{event.title}</h3>
                                     
                                     <div className="flex items-center text-gray-300 text-sm gap-2 mt-1">
                                        <MapPin size={16} className="text-white"/>
                                        <span className="truncate max-w-[200px]">{event.location?.city || "Online"}, {event.location?.state}</span>
                                     </div>

                                     <div className="flex items-center justify-between mt-4 border-t border-white/10 pt-4">
                                        <div className="flex flex-col">
                                            <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">Starting from</span>
                                            <span className="text-white font-bold text-xl">{event.tickets?.[0]?.price ? `₹${event.tickets[0].price}` : 'Free'}</span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                            <ArrowRight size={20} className="-rotate-45"/>
                                        </div>
                                     </div>
                                </div>
                            </PixelCard>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Events;
