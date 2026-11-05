import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../Supabase/Supabase";
import { toast } from "sonner";

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error || !data.session) {
                toast.error("Google authentication failed");
                navigate("/login", { replace: true });
                return;
            }
            const userId = data.session.user.id;
            toast.success("Google login successful!");
            navigate(`/planner/${userId}`, { replace: true });
        };

        handleAuthCallback();
    }, [navigate]);

    return <div>Authenticating with Google...</div>;
};

export default AuthCallback;