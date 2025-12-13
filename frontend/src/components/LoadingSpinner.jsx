import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ fullScreen = true, size = 48, className = "" }) => {
    if (fullScreen) {
        return (
            <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-4">
                <Loader2 className={`animate-spin text-white ${className}`} size={size} />
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center p-4">
            <Loader2 className={`animate-spin text-white ${className}`} size={size} />
        </div>
    );
};

export default LoadingSpinner;
