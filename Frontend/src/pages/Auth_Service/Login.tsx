import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../../Supabase/Supabase";
import { GoogleLogin } from "../../Supabase/Auth";

const Login = () => {
    const navigator = useNavigate();

    const [FormData, setFormData] = useState<{
        Email: string;
        Password: string;
    }>({
        Email: "",
        Password: ""
    });

    const handleLogin = async () => {
        try {
            if (!FormData.Email.trim() || !FormData.Password) {
                throw new Error("Fill all fields");
            }

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

            navigator(`/planner/${data.user.id}`);

            console.log(data);

        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Login failed"
            );
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await GoogleLogin();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Google authentication failed"
            );
        }
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center">

                <input
                    type="email"
                    placeholder="Email"
                    className="w-10vw h-5vh bg-amber-50 text-black p-2 mt-2 rounded-2xl"
                    value={FormData.Email}
                    onChange={(e) => {
                        setFormData({
                            ...FormData,
                            Email: e.target.value
                        });
                    }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-10vw h-5vh bg-amber-50 text-black p-2 mt-2 rounded-2xl"
                    value={FormData.Password}
                    onChange={(e) => {
                        setFormData({
                            ...FormData,
                            Password: e.target.value
                        });
                    }}
                />

                <button
                    className="w-fit bg-white text-black p-3 mt-20 rounded-2xl hover:bg-gray-600 cursor-pointer"
                    onClick={handleLogin}
                >
                    Login
                </button>

                <div className="flex items-center gap-3 w-64 my-5">
                    <div className="flex-1 h-px bg-gray-400"></div>
                    <span className="text-gray-400">OR</span>
                    <div className="flex-1 h-px bg-gray-400"></div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center gap-3 w-64 bg-white text-black p-3 rounded-2xl hover:bg-gray-200 cursor-pointer"
                >
                    <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-5 h-5"
                    />

                    Continue with Google
                </button>

            </div>
        </>
    );
};

export default Login;