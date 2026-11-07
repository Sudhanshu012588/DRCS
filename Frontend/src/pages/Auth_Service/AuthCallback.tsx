import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../Supabase/Supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error || !data.session) {
                toast.error("Google authentication failed");
                // Redirect back to login page if auth fails
                navigate("/Auth/Login", { replace: true });
                return;
            }
            const userId = data.session.user.id;
            toast.success("Google login successful!");
            navigate(`/planner/${userId}`, { replace: true });
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center space-y-4">
            <Loader2 size={24} className="animate-spin text-white" />
            <div className="text-xs uppercase tracking-widest text-neutral-400">
                Authenticating with Google...
            </div>
        </div>
    );
};

export default AuthCallback;