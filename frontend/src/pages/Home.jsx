import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import SpotlightCard from "../components/SpotlightCard";
import PixelCard from "../components/PixelCard";
import BlurText from "../components/BlurText";
import {
  Calendar,
  MapPin,
  ArrowRight,
  Loader,
  Music,
  Code,
  Briefcase,
  Users,
  Search,
  Ticket,
  CheckCircle,
  Play
} from "lucide-react";
import heroBg from "../assets/hero-bg.png";
import Squares from "../components/Squares";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get("/user/getAllEvents");
        if (data.success) {
          setEvents(data.data.slice(0, 6));
        }
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const categories = [
    { name: "Music", icon: Music, desc: "Live Concerts & Gigs" },
    { name: "Tech", icon: Code, desc: "Hackathons & Meetups" },
    { name: "Business", icon: Briefcase, desc: "Networking & Summits" },
    { name: "Social", icon: Users, desc: "Parties & Gatherings" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 -mt-20">
      
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4 overflow-hidden border-b border-border">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
            <Squares 
              speed={0.17} 
              squareSize={200}
              direction='diagonal'
              borderColor='#ffffff'
              hoverFillColor='#ffffff'
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10 pointer-events-none"></div>
        </div>

        <div className="relative z-20 text-center max-w-5xl mx-auto space-y-8 mt-10">

          <BlurText
            text="Live the Moment."
            delay={150}
            animateBy="words"
            direction="top"
            className="text-5xl md:text-7xl font-black text-foreground tracking-tight leading-none drop-shadow-2xl justify-center"
          />
          
          <BlurText
            text="Discover and host events that create memories."
            delay={150}
            animateBy="words"
            direction="top"
            className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto font-light leading-relaxed drop-shadow-md justify-center"
          />

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link 
                to="/events" 
                className="group relative px-6 py-2.5 bg-primary text-primary-foreground font-medium text-sm rounded-full hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] active:scale-95"
            >
                Explore Events
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
                to="/register" 
                className="px-6 py-2.5 bg-secondary/50 border border-border theme-blur text-foreground font-medium text-sm rounded-full hover:bg-secondary transition-all backdrop-blur-md flex items-center justify-center gap-2 hover:border-primary/50"
            >
                Create Event
            </Link>
          </div>
        </div>
      </section>




      {/* Categories Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Find Your Vibe</h2>
            <p className="text-muted-foreground text-lg">Browse events by category to find exactly what moves you.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                <Link 
                    to="/events" 
                    key={cat.name} 
                    className="block h-full"
                >
                    <SpotlightCard className="custom-spotlight-card h-full pt-10 pl-8 pr-8 pb-8" spotlightColor="#ffffff54">
                        <div className="relative z-10 h-full flex flex-col items-start text-left">
                            <div className="mb-6 p-3 rounded-full border border-white/10 bg-white/5 inline-flex">
                                <Icon size={32} className="text-white" strokeWidth={1.5} />
                            </div>
                            
                            <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
                            <p className="text-neutral-400 mb-8 max-w-sm">{cat.desc}</p>
                            
                            <div className="mt-auto inline-flex items-center text-sm font-bold text-white uppercase tracking-wider gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                Explore <ArrowRight size={16} />
                            </div>
                        </div>
                    </SpotlightCard>
                </Link>
            )})}
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-primary/5">
        <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">Trending <br/>Experiences</h2>
                </div>
                <Link to="/events" className="hidden md:flex items-center gap-2 text-foreground border border-border px-6 py-3 rounded-full hover:bg-foreground hover:text-background transition-all group">
                    View all <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader className="animate-spin text-primary" size={40} />
                </div>
            ) : events.length === 0 ? (
                <div className="text-center text-muted-foreground py-20 bg-muted/30 rounded-3xl border border-border border-dashed">
                    <Ticket size={48} className="mx-auto mb-4 opacity-50"/>
                    <p>No upcoming events found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <Link to={`/event/${event._id}`} key={event._id} className="block">
                            <PixelCard variant="default" className="w-[100%] h-[400px] border-none bg-transparent">
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
            
            <div className="mt-12 text-center md:hidden">
                <Link to="/events" className="inline-flex items-center gap-2 text-foreground border border-border px-8 py-3 rounded-full hover:bg-foreground hover:text-background transition-all">
                    View all Events <ArrowRight size={18}/>
                </Link>
            </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 border-y border-border bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 text-center">
             <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-16">How EventFlow Works</h2>
             <div className="grid md:grid-cols-3 gap-12 relative">
                 {/* Connecting Line (Desktop) */}
                 <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                 
                 {[
                    { icon: <Search size={32}/>, title: "Discover", desc: "Browse thousands of authentic events curated just for you." },
                    { icon: <Ticket size={32}/>, title: "Book", desc: "Secure your spot instantly with our seamless checkout process." },
                    { icon: <CheckCircle size={32}/>, title: "Enjoy", desc: "Get your digital ticket and make memories that last forever." }
                 ].map((step, i) => {
                    const stepRef = useRef(null);
                    
                    useEffect(() => {
                      const element = stepRef.current;
                      if (!element) return;

                      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                      if (prefersReducedMotion) {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                        return;
                      }

                      const observer = new IntersectionObserver(
                        (entries) => {
                          entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                              setTimeout(() => {
                                entry.target.style.opacity = '1';
                                entry.target.style.transform = 'translateY(0)';
                              }, i * 120);
                              observer.unobserve(entry.target);
                            }
                          });
                        },
                        { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
                      );

                      observer.observe(element);
                      return () => observer.unobserve(element);
                    }, []);

                    return (
                      <div 
                        key={i} 
                        ref={stepRef}
                        className="relative z-10 flex flex-col items-center"
                        style={{
                          opacity: 0,
                          transform: 'translateY(25px)',
                          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
                        }}
                      >
                          <div className="w-24 h-24 rounded-full bg-card border border-border flex items-center justify-center text-primary mb-6 shadow-2xl group hover:scale-110 transition-transform duration-300 hover:border-primary/50">
                              {step.icon}
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                          <p className="text-muted-foreground max-w-xs">{step.desc}</p>
                      </div>
                    );
                 })}
             </div>
          </div>
      </section>

      {/* Organizer CTA */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background border-y border-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
            <BlurText
              text="Ready to host?"
              delay={100}
              animateBy="words"
              direction="top"
              className="text-5xl md:text-7xl font-bold text-foreground mb-8 tracking-tight justify-center"
            />
            <BlurText
              text="Join thousands of organizers who use EventFlow to create unforgettable experiences."
              delay={150}
              animateBy="words"
              direction="top"
              className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto justify-center"
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="px-6 py-2.5 bg-primary text-primary-foreground font-medium text-sm rounded-full hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] active:scale-95">
                    Start Hosting Free
                </Link>
                <Link to="/login" className="px-6 py-2.5 bg-secondary/50 border border-border text-foreground font-medium text-sm rounded-full hover:bg-secondary transition-all backdrop-blur-md flex items-center justify-center gap-2 hover:border-primary/50">
                    <Play size={16} className="fill-foreground"/> Watch Demo
                </Link>
            </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
