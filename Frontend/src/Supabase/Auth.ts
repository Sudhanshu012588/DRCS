import { supabase } from "./Supabase";

export const GoogleLogin = async () => {

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${window.location.origin}/auth/callback`
        }
    });

    if (error) {
        throw error;
    }

    return data;
};