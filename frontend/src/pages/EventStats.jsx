import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, Link } from "react-router-dom";
import { Download, TrendingUp, Users, DollarSign, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

const EventStats = () => {
    const { id } = useParams();
    const [attendees, setAttendees] = useState([]);
    const [stats, setStats] = useState({ totalRevenue: 0, ticketsSold: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendees = async () => {
            try {
                const { data } = await api.get(`/events/getAttendeesByEventId/${id}`);
                if (data.success) {
                    setAttendees(data.data);
                    
                    const totalRev = data.data.reduce((acc, curr) => acc + (curr.ticket?.price || 0), 0);
                    setStats({
                        totalRevenue: totalRev,
                        ticketsSold: data.data.length
                    });
                }
            } catch (error) {
                toast.error("Failed to fetch statistics");
            } finally {
                setLoading(false);
            }
        };
        fetchAttendees();
    }, [id]);

    const handleExportCSV = async () => {
        try {
            const response = await api.get(`/events/exportCSV/${id}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `attendees-${id}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success("CSV downloaded successfully");
        } catch (error) {
             toast.error("Failed to download CSV");
        }
    }

    if(loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen py-16 px-4 max-w-7xl mx-auto bg-gradient-to-b from-background via-primary/5 to-background">
            <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground transition mb-6 text-sm">
                <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
            </Link>
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                <div>
                    <h1 className="text-5xl font-bold text-foreground mb-2">Event Statistics</h1>
                    <p className="text-muted-foreground">Track your event performance</p>
                </div>
                <button onClick={handleExportCSV} className="bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/30 px-5 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium transition-all hover:border-green-500/50">
                    <Download size={16} /> Export Data
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-3xl hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/30">
                            <DollarSign size={20} className="text-primary" />
                        </div>
                        <h3 className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Total Revenue</h3>
                    </div>
                    <p className="text-4xl font-bold text-foreground">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-3xl hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/30">
                            <Users size={20} className="text-blue-500" />
                        </div>
                        <h3 className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Tickets Sold</h3>
                    </div>
                    <p className="text-4xl font-bold text-foreground">{stats.ticketsSold}</p>
                </div>
                 <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-3xl hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                            <TrendingUp size={20} className="text-green-500" />
                        </div>
                        <h3 className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Status</h3>
                    </div>
                    <p className="text-4xl font-bold text-green-500">Active</p>
                </div>
            </div>

            {/* Attendees Table */}
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-2xl font-bold text-foreground">Attendees List</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-muted-foreground">
                        <thead className="bg-muted/30 text-muted-foreground uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Attendee Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Ticket Type</th>
                                <th className="px-6 py-4">Check-in Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {attendees.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-12 text-muted-foreground">No attendees found.</td>
                                </tr>
                            ) : (
                                attendees.map((attendee) => (
                                    <tr key={attendee._id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4 font-medium text-foreground">{attendee.name}</td>
                                        <td className="px-6 py-4">{attendee.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-primary/10 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-medium">
                                                {attendee.ticket?.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-500/10 text-green-500 border border-green-500/30 px-3 py-1 rounded-full text-xs font-medium capitalize">
                                                {attendee.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EventStats;
