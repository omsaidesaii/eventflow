import { Twitter, Instagram, Linkedin, Github, LinkedinIcon } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-background to-primary/5 text-foreground border-t border-border mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="md:col-span-6 space-y-4">
                        <h3 className="text-2xl font-bold text-foreground">
                            EventFlow
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                            A student project for discovering and hosting events. Built with passion to create memorable experiences.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <a href="https://x.com/omsaidesai" className="w-9 h-9 rounded-full bg-secondary/50 border border-border flex items-center justify-center hover:bg-secondary hover:border-primary/50 transition-all">
                                <Twitter size={16} />
                            </a>
                            <a href="https://www.linkedin.com/in/omsai-desai" className="w-9 h-9 rounded-full bg-secondary/50 border border-border flex items-center justify-center hover:bg-secondary hover:border-primary/50 transition-all">
                                <LinkedinIcon size={16} />
                            </a>
                            <a href="https://github.com/omsaidesaii" className="w-9 h-9 rounded-full bg-secondary/50 border border-border flex items-center justify-center hover:bg-secondary hover:border-primary/50 transition-all">
                                <Github size={16} />
                            </a>
                        </div>
                    </div>
                    
                    {/* Quick Links */}
                    <div className="md:col-span-3">
                        <h4 className="font-semibold text-sm text-foreground mb-4 uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-3 text-muted-foreground text-sm">
                            <li><a href="/events" className="hover:text-foreground transition-colors">Browse Events</a></li>
                            <li><a href="/create-event" className="hover:text-foreground transition-colors">Create Event</a></li>
                            <li><a href="/about" className="hover:text-foreground transition-colors">About</a></li>
                        </ul>
                    </div>

                    <div className="md:col-span-3">
                        <h4 className="font-semibold text-sm text-foreground mb-4 uppercase tracking-wider">Support</h4>
                        <ul className="space-y-3 text-muted-foreground text-sm">
                            <li><a href="/help-center" className="hover:text-foreground transition-colors">Help Center</a></li>
                            <li><a href="mailto:omsaidesai9@gmail.com" className="hover:text-foreground transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                </div>
                
                {/* Bottom Bar */}
                <div className="border-t border-border pt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} EventFlow -  Project. Made with ❤️ by <span className="font-bold hover:text-foreground transition-colors"><a href="https://github.com/omsaidesaii" target="_blank" rel="noopener noreferrer">Omsai Desai</a></span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
