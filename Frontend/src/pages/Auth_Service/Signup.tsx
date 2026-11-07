import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../../Supabase/Supabase";
import { GoogleLogin } from "../../Supabase/Auth";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
    const navigate = useNavigate();
    const [FormData, setFormData] = useState({
        UserName: "",
        Email: "",
        Password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        try {
            if (!FormData.UserName.trim() || !FormData.Email.trim() || !FormData.Password) {
                toast.error("Please fill in all fields");
                return;
            }

            setLoading(true);
            const { data, error } = await supabase.auth.signUp({
                email: FormData.Email,
                password: FormData.Password,
                options: {
                    emailRedirectTo: `${window.location.origin}/Auth/Login`,
                    data: {
                        username: FormData.UserName,
                        full_name: FormData.UserName
                    }
                }
            });

            if (error) throw error;

            toast.success("Signup successful! Check your email for verification.");
            if (data.session && data.user) {
                navigate(`/planner/${data.user.id}`);
            }
        } catch (error: any) {
            toast.error(error instanceof Error ? error.message : "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            await GoogleLogin();
        } catch (error: any) {
            toast.error(error instanceof Error ? error.message : "Google authentication failed");
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-white text-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-6 py-6">
                {/* Header */}
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Create an account
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">
                        Get started with <span className="text-gray-900 font-semibold">DRCS</span> by CypherLabs
                    </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="username"
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                            value={FormData.UserName}
                            onChange={(e) => setFormData({ ...FormData, UserName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="business@mail.com"
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                            value={FormData.Email}
                            onChange={(e) => setFormData({ ...FormData, Email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors pr-10"
                                value={FormData.Password}
                                onChange={(e) => setFormData({ ...FormData, Password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Primary Blue Action Button */}
                    <button
                        disabled={loading}
                        onClick={handleSignup}
                        className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-60"
                    >
                        {loading ? "Creating account..." : "Sign up"}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-normal">Already have an account?</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Log In Navigation Button */}
                    <button
                        type="button"
                        onClick={() => navigate("/Auth/Login")}
                        className="w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium rounded-xl text-sm transition-all"
                    >
                        Log in
                    </button>

                    {/* Google Signup */}
                    <button
                        type="button"
                        onClick={handleGoogleSignup}
                        className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-xl text-xs flex items-center justify-center gap-2.5 transition-all mt-3"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                        Continue with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Signup;