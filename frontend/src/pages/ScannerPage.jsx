import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, ScanLine } from "lucide-react";

const ScannerPage = () => {
    const navigate = useNavigate();
    const [scanResult, setScanResult] = useState(null);
    const [scannerInstance, setScannerInstance] = useState(null);

    useEffect(() => {
        // Use a local variable to capture the scanner instance for cleanup
        // This avoids the closure stale state issue
        let scanner = null;

        const initScanner = () => {
             scanner = new Html5QrcodeScanner(
                "reader", 
                { 
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                    showTorchButtonIfSupported: true,
                    // rememberLastUsedCamera: true // Sometimes causes issues on mobile if permissions change
                },
                /* verbose= */ false
            );
            
            setScannerInstance(scanner);

            const onScanSuccess = async (decodedText, decodedResult) => {
                try {
                    const data = JSON.parse(decodedText);
                    
                    // Pause the scanner to prevent multiple triggers for the same code
                    if (scanner) {
                        try {
                             scanner.pause(true); 
                        } catch (e) { console.warn("Pause failed", e); }
                    }

                    await processCheckIn(data);
                } catch (err) {
                    console.error("QR Parse Error", err);
                    toast.error("Invalid QR Code format");
                    // If parsing fails, resume scanning might be needed? 
                    // Usually we just let it keep scanning until a valid one is found or user resets
                }
            };
            
            const onScanFailure = (error) => {
                // console.warn(`Code scan error = ${error}`);
            };

            scanner.render(onScanSuccess, onScanFailure);
        };

        // Small delay to ensure DOM is ready
        const timer = setTimeout(initScanner, 100);

        return () => {
            clearTimeout(timer);
            if(scanner) {
                // Critical: clear() returns a promise. We strictly catch errors to prevent unmount crashes.
                scanner.clear().catch(error => {
                    console.warn("Failed to clear html5-qrcode scanner during unmount.", error);
                });
            }
        };
    }, []);

    const processCheckIn = async (data) => {
        try {
            const { ticketId, attendeeId } = data;
            const res = await api.post("/events/check-in", { ticketId, attendeeId });
            
            if(res.data.success) {
                setScanResult({
                    status: 'success',
                    message: "Checked In Successfully!",
                    details: res.data.data
                });
                toast.success(`Welcome, ${res.data.data.attendeeName}!`);
            }
        } catch (error) {
             setScanResult({
                status: 'error',
                message: error.response?.data?.message || "Check-in failed"
            });
            toast.error(error.response?.data?.message || "Check-in failed");
        }
    };

    const handleReset = () => {
        setScanResult(null);
        if(scannerInstance) {
            scannerInstance.resume();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background text-foreground py-16 px-4 flex flex-col items-center">
            
            {/* Header */}
            <div className="w-full max-w-2xl mb-12">
                <button onClick={() => navigate('/dashboard')} className="flex items-center text-muted-foreground hover:text-foreground transition mb-6 text-sm">
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </button>
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                            <ScanLine className="text-primary" size={28} />
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold text-foreground mb-2">Ticket Scanner</h1>
                    <p className="text-muted-foreground">Scan QR codes to check-in attendees</p>
                </div>
            </div>

            <div className="w-full max-w-2xl bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border shadow-xl">
                
                {/* Result View */}
                {scanResult ? (
                    <div className="text-center py-12">
                        {scanResult.status === 'success' ? (
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                                <CheckCircle size={48} className="text-green-500" />
                            </div>
                        ) : (
                            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                                <XCircle size={48} className="text-red-500" />
                            </div>
                        )}
                        
                        <h2 className="text-3xl font-bold mb-3 text-foreground">
                            {scanResult.status === 'success' ? "Verified!" : "Error"}
                        </h2>
                        
                        <p className={`text-lg mb-8 ${scanResult.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                            {scanResult.message}
                        </p>

                        {scanResult.details && (
                             <div className="bg-muted/30 rounded-2xl p-6 mb-8 text-left max-w-md mx-auto border border-border">
                                <p className="text-muted-foreground text-xs mb-1 uppercase tracking-wider">Attendee</p>
                                <p className="text-foreground font-semibold text-xl mb-4">{scanResult.details.attendeeName}</p>
                                <p className="text-muted-foreground text-xs mb-1 uppercase tracking-wider">Status</p>
                                <span className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-full">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-green-500 capitalize text-sm font-medium">{scanResult.details.ticketStatus}</span>
                                </span>
                             </div>
                        )}

                        <button 
                            onClick={handleReset}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-8 rounded-full transition flex items-center gap-2 mx-auto shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] active:scale-95 text-sm"
                        >
                            <RefreshCw size={16} /> Scan Next Ticket
                        </button>
                    </div>
                ) : (
                    /* Scanner View */
                    <div className="overflow-hidden rounded-2xl">
                        <div id="reader" className="w-full"></div>
                        <p className="text-center text-muted-foreground mt-6 text-sm">Position the QR code within the frame to scan</p>
                    </div>
                )}

            </div>
            
            {/* UI Tweaks for Scanner */}
            <style>{`
                #reader__scan_region img {
                    display: none;
                }
                #reader__dashboard_section_csr span { 
                    display: none !important; 
                }
                #reader button {
                    color: hsl(var(--primary-foreground));
                    background-color: hsl(var(--primary));
                    border-radius: 9999px;
                    padding: 0.625rem 1.5rem;
                    border: none;
                    margin-top: 16px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                #reader button:hover {
                    background-color: hsl(var(--primary) / 0.9);
                    box-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
                }
                #reader__dashboard_section_swaplink {
                    text-decoration: none;
                    color: hsl(var(--primary));
                    margin-top: 12px;
                    display: inline-block;
                    font-size: 0.875rem;
                }
                #reader__dashboard_section_csr span:last-child {
                    display: none;
                }
                #reader video {
                    border-radius: 1rem;
                }
            `}</style>
        </div>
    );
};

export default ScannerPage;
