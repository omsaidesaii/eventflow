import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sheet, SheetContent, SheetFooter, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { Ticket, Calendar, User, LogOut, Menu, X, Home, Compass } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        setOpen(false);
        navigate('/login');
    }

    return (
        <header className="fixed z-50 top-4 md:top-6 left-1/2 -translate-x-1/2 w-[96%] md:w-[90%] lg:w-[85%] max-w-6xl rounded-full border border-white/10 bg-background/5 backdrop-blur-md shadow-lg text-foreground">
            <nav className="flex h-14 md:h-16 w-full items-center justify-between px-4 md:px-8">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-xl md:text-2xl font-bold ">
                            EventFlow
                        </span>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden items-center gap-2 lg:flex">
                    <Link to="/">
                        <Button 
                            variant="ghost" 
                            className={`rounded-full ${location.pathname === '/' ? "bg-accent" : ""}`}
                        >
                            Home
                        </Button>
                    </Link>
                    <Link to="/events">
                        <Button 
                            variant="ghost" 
                            className={`rounded-full ${location.pathname === '/events' ? "bg-accent" : ""}`}
                        >
                            Events
                        </Button>
                    </Link>
                    
                     {user && (
                        <>
                             <Link to="/my-bookings">
                                <Button 
                                    variant="ghost" 
                                    className={`rounded-full ${location.pathname === '/my-bookings' ? "bg-accent" : ""}`}
                                >
                                    <Ticket className="mr-2 h-4 w-4" /> My Tickets
                                </Button>
                             </Link>
                             {user.role === 'organizer' && (
                                <Link to="/dashboard">
                                    <Button 
                                        variant="ghost" 
                                        className={`rounded-full ${location.pathname === '/dashboard' ? "bg-accent" : ""}`}
                                    >
                                       <Calendar className="mr-2 h-4 w-4" /> Dashboard
                                    </Button>
                                </Link>
                             )}
                        </>
                    )}


                    {!user ? (
                        <>
                            <Link to="/login">
                                <Button variant="ghost" className="rounded-full">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button className="rounded-full">Get Started</Button>
                            </Link>
                        </>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-primary">
                                    <img 
                                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                                        alt="User" 
                                        className="h-full w-full object-cover"
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate('/profile')}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:text-red-500 focus:text-red-500">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                <div className="flex items-center gap-2 lg:hidden">
                    
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button size="icon" variant="ghost" className="lg:hidden text-white hover:bg-white/10">
                                {open ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            className="bg-black/60 supports-[backdrop-filter]:bg-black/40 border-l border-white/10 w-[85vw] sm:w-[350px] backdrop-blur-xl text-white pt-10"
                            showClose={false}
                            side="left"
                        >
                            <VisuallyHidden>
                                <SheetTitle>Navigation Menu</SheetTitle>
                                <SheetDescription>
                                    Access all pages and account settings from this menu
                                </SheetDescription>
                            </VisuallyHidden>
                            <div className="flex flex-col h-full">
                                <div className="px-4 pb-6 border-b border-white/10">
                                     <span className="text-2xl font-bold bg-clip-text text-white">
                                        EventFlow
                                    </span>
                                </div>
                                <div className="grid gap-y-2 overflow-y-auto px-4 pt-8 pb-5 flex-1 content-start">
                                    <Link
                                        to="/"
                                        className={buttonVariants({ variant: 'ghost', className: 'justify-start text-lg rounded-full hover:bg-white/10 hover:text-white' })}
                                        onClick={() => setOpen(false)}
                                    >
                                        <Home className="mr-2 h-5 w-5" /> Home
                                    </Link>
                                    <Link
                                        to="/events"
                                        className={buttonVariants({ variant: 'ghost', className: 'justify-start text-lg rounded-full hover:bg-white/10 hover:text-white' })}
                                        onClick={() => setOpen(false)}
                                    >
                                        <Compass className="mr-2 h-5 w-5" /> Events
                                    </Link>
                                    {user && (
                                        <>
                                            <Link to="/my-bookings" className={buttonVariants({ variant: 'ghost', className: 'justify-start text-lg rounded-full hover:bg-white/10 hover:text-white' })} onClick={() => setOpen(false)}>
                                                <Ticket className="mr-2 h-5 w-5" /> My Tickets
                                            </Link>
                                            {user.role === 'organizer' && (
                                                <Link to="/dashboard" className={buttonVariants({ variant: 'ghost', className: 'justify-start text-lg rounded-full hover:bg-white/10 hover:text-white' })} onClick={() => setOpen(false)}>
                                                    <Calendar className="mr-2 h-5 w-5" /> Dashboard
                                                </Link>
                                            )}
                                        </>
                                    )}
                                </div>
                                <SheetFooter className="p-4 border-t border-white/10 gap-2 sm:flex-col bg-transparent">
                                    {!user ? (
                                        <>
                                            <Link to="/login" onClick={() => setOpen(false)} className="w-full">
                                                <Button variant="ghost" className="w-full border border-white/10 hover:bg-white/10 hover:text-white">Sign In</Button>
                                            </Link>
                                            <Link to="/register" onClick={() => setOpen(false)} className="w-full">
                                                <Button className="w-full bg-white text-black hover:bg-gray-200">Get Started</Button>
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-3 mb-4 px-2">
                                                 <img 
                                                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                                                    alt="User" 
                                                    className="h-10 w-10 rounded-full border border-white/20"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-white">{user.name}</span>
                                                    <span className="text-xs text-neutral-400">{user.email}</span>
                                                </div>
                                            </div>
                                            <Link to="/profile" onClick={() => setOpen(false)} className="w-full">
                                                  <Button variant="ghost" className="w-full justify-start hover:bg-white/10 hover:text-white">
                                                    <User className="mr-2 h-4 w-4" /> Profile
                                                  </Button>
                                            </Link>
                                            <Button variant="destructive" className="w-full justify-start mt-2" onClick={handleLogout}>
                                                <LogOut className="mr-2 h-4 w-4" /> Sign Out
                                            </Button>
                                        </>
                                    )}
                                </SheetFooter>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
