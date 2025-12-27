import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  XCircle,
  ScanLine
} from "lucide-react";

const ScannerPage = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    if (scanResult) return;

    const html5QrCode = new Html5Qrcode("reader");
    let isMounted = true;
    let isProcessing = false;

    const startScanner = async () => {
      try {
        const qrBoxSize = window.innerWidth < 400 ? 200 : 250;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: qrBoxSize, height: qrBoxSize },
            aspectRatio: 1
          },
          async (decodedText) => {
            if (!isMounted || isProcessing) return;

            isProcessing = true;
            html5QrCode.pause(true);

            try {
              const data = JSON.parse(decodedText);
              await processCheckIn(data);
            } catch (err) {
              console.error("Invalid QR", err);
              toast.error("Invalid QR Code");
              isProcessing = false;
              html5QrCode.resume();
            }
          },
          () => {}
        );
      } catch (err) {
        if (isMounted) {
          console.error("Scanner start failed", err);
          toast.error("Camera access failed");
        }
      }
    };

    const timer = setTimeout(startScanner, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);

      // ✅ SAFE CLEANUP (NO .catch() on clear)
      Promise.resolve()
        .then(async () => {
          if (html5QrCode.isScanning) {
            await html5QrCode.stop();
          }
        })
        .catch(() => {})
        .finally(() => {
          try {
            html5QrCode.clear();
          } catch {}
        });
    };
  }, [scanResult]);

  const processCheckIn = async (data) => {
    try {
      const { ticketId, attendeeId } = data;

      const res = await api.post("/events/check-in", {
        ticketId,
        attendeeId
      });

      if (res.data.success) {
        setScanResult({
          status: "success",
          message: "Checked In Successfully!",
          details: res.data.data
        });
        toast.success(`Welcome, ${res.data.data.attendeeName}!`);
      }
    } catch (error) {
      setScanResult({
        status: "error",
        message:
          error.response?.data?.message || "Check-in failed"
      });
      toast.error(
        error.response?.data?.message || "Check-in failed"
      );
    }
  };

  const handleReset = () => {
    setScanResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background text-foreground py-16 px-4 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-2xl mb-12">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-muted-foreground hover:text-foreground transition mb-6 text-sm"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </button>

        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
              <ScanLine className="text-primary" size={28} />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-2">
            Ticket Scanner
          </h1>
          <p className="text-muted-foreground">
            Scan QR codes to check-in attendees
          </p>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-card/50 backdrop-blur-sm rounded-3xl p-8 border border-border shadow-xl">
        {scanResult ? (
          <div className="text-center py-12">
            {scanResult.status === "success" ? (
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                <CheckCircle
                  size={48}
                  className="text-green-500"
                />
              </div>
            ) : (
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                <XCircle
                  size={48}
                  className="text-red-500"
                />
              </div>
            )}

            <h2 className="text-3xl font-bold mb-3">
              {scanResult.status === "success"
                ? "Verified!"
                : "Error"}
            </h2>

            <p
              className={`text-lg mb-8 ${
                scanResult.status === "success"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {scanResult.message}
            </p>

            {scanResult.details && (
              <div className="bg-muted/30 rounded-2xl p-6 mb-8 text-left max-w-md mx-auto border border-border">
                <p className="text-muted-foreground text-xs mb-1 uppercase">
                  Attendee
                </p>
                <p className="font-semibold text-xl mb-4">
                  {scanResult.details.attendeeName}
                </p>
                <span className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-500 text-sm font-medium">
                    {scanResult.details.ticketStatus}
                  </span>
                </span>
              </div>
            )}

            <button
              onClick={handleReset}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-8 rounded-full flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={16} /> Scan Next Ticket
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl">
            <div
              id="reader"
              className="w-full min-h-[300px] bg-black rounded-lg"
            />
            <p className="text-center text-muted-foreground mt-6 text-sm">
              Position the QR code within the frame
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScannerPage;
