import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../../Supabase/Supabase";
import { GoogleLogin } from "../../Supabase/Auth";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

const Login = () => {
    const navigate = useNavigate();

    const [FormData, setFormData] = useState({
        Email: "",
        Password: ""
    });
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setErrorMsg(null);
            if (!FormData.Email.trim() || !FormData.Password) {
                setErrorMsg("Please fill in all required fields.");
                return;
            }

            setLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({
                email: FormData.Email,
                password: FormData.Password
            });

            if (error) {
                throw error;
            }

            if (!data.user) {
                throw new Error("User authentication failed");
            }

            toast.success("Login successful!");
            navigate(`/planner/${data.user.id}`);
        } catch (error: any) {
            const message = error instanceof Error ? error.message : "Login failed";
            if (message.toLowerCase().includes("invalid credentials") || message.toLowerCase().includes("password")) {
                setErrorMsg("Incorrect password. Please check and try again.");
            } else {
                setErrorMsg(message);
            }
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
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
                        Welcome back!
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">
                        Log in to your <span className="text-gray-900 font-semibold">DRCS</span> account
                    </p>
                </div>

                {/* Inline Red Error Banner */}
                {errorMsg && (
                    <div className="flex items-center justify-center gap-1.5 text-xs text-red-500 font-medium text-center">
                        <AlertCircle size={14} className="flex-shrink-0" />
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* Form Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="business@mail.com"
                            className={`w-full px-3.5 py-2.5 border ${
                                errorMsg ? "border-red-300 bg-red-50/20" : "border-gray-300 focus:border-blue-500"
                            } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors`}
                            value={FormData.Email}
                            onChange={(e) => {
                                setErrorMsg(null);
                                setFormData({ ...FormData, Email: e.target.value });
                            }}
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
                                className={`w-full px-3.5 py-2.5 border ${
                                    errorMsg ? "border-red-300 bg-red-50/20" : "border-gray-300 focus:border-blue-500"
                                } rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors pr-10`}
                                value={FormData.Password}
                                onChange={(e) => {
                                    setErrorMsg(null);
                                    setFormData({ ...FormData, Password: e.target.value });
                                }}
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

                    <div className="text-xs text-gray-500">
                        Forgot your password?{" "}
                        <button type="button" className="text-blue-600 hover:underline font-semibold">
                            Reset
                        </button>
                    </div>

                    {/* Primary Blue Action Button */}
                    <button
                        disabled={loading}
                        onClick={handleLogin}
                        className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Log in"}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-normal">New to DRCS?</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Sign Up Navigation Button */}
                    <button
                        type="button"
                        onClick={() => navigate("/Auth/Signup")}
                        className="w-full py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium rounded-xl text-sm transition-all"
                    >
                        Sign up
                    </button>

                    {/* Google Login */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
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

export default Login;