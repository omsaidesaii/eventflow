import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider"

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import EventDetails from "./pages/EventDetails";
import MyBookings from "./pages/MyBookings";
import Events from "./pages/Events";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import EventStats from "./pages/EventStats";
import Profile from "./pages/Profile";
import ScannerPage from "./pages/ScannerPage";
import PaymentPage from "./pages/PaymentPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import ProtectedRoute from "./components/ProtectedRoute";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <AuthProvider>
       <Router>
          <ScrollToTop />
          <div className="bg-background min-h-screen text-foreground flex flex-col font-sans selection:bg-primary/30">
             <Navbar />
             <main className="flex-grow pt-20">
                <Routes>
                   <Route path="/" element={<Home />} />
                   <Route path="/login" element={<RedirectIfLoggedIn><Login /></RedirectIfLoggedIn>} />
                   <Route path="/register" element={<RedirectIfLoggedIn><Register /></RedirectIfLoggedIn>} />
                   <Route path="/verify-email" element={<RedirectIfLoggedIn><VerifyEmail /></RedirectIfLoggedIn>} />
                   <Route path="/forgot-password" element={<RedirectIfLoggedIn><ForgotPassword /></RedirectIfLoggedIn>} />
                   <Route path="/reset-password" element={<RedirectIfLoggedIn><ResetPassword /></RedirectIfLoggedIn>} />
                   <Route path="/event/:id" element={<EventDetails />} />
                   <Route path="/events" element={<Events />} /> 
                   
                   {/* Protected Routes for Authenticated Users */}
                   <Route element={<ProtectedRoute allowedRoles={['user', 'attendee', 'organizer', 'admin']} />}>
                        <Route path="/my-bookings" element={<MyBookings />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/payment" element={<PaymentPage />} />
                   </Route>

                   {/* Organizer Only Routes */}
                   <Route element={<ProtectedRoute allowedRoles={['organizer']} />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/create-event" element={<CreateEvent />} />
                        <Route path="/edit-event/:id" element={<EditEvent />} />
                        <Route path="/event-stats/:id" element={<EventStats />} />
                        <Route path="/scan" element={<ScannerPage />} />
                   </Route>
                </Routes>
             </main>
             <Footer />
          </div>
          <Toaster 
            position="bottom-right"
            toastOptions={{
                style: {
                    background: '#333',
                    color: '#fff',
                },
            }}
          />
       </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
