import { useNavigate } from "react-router-dom";
import { ArrowUpRight, LogIn, UserPlus } from "lucide-react";

const Auth = () => {
    const navigator = useNavigate();
    const Signup = async () => {
        navigator("/Auth/Signup");
    };
    const Login = async () => {
        navigator("/Auth/Login");
    };

    return (
        <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-neutral-950 border border-neutral-800 p-8 text-center space-y-6">
                <div className="space-y-2">
                    <div className="w-10 h-10 bg-white text-black font-black text-sm flex items-center justify-center mx-auto mb-4">
                        BIM
                    </div>
                    <h1 className="text-xl font-bold tracking-widest text-white uppercase">
                        STRUCT<span className="text-neutral-500">.ARCH</span>
                    </h1>
                    <p className="text-xs text-neutral-400 font-sans">
                        Select an option to access the structural generator.
                    </p>
                </div>

                <div className="space-y-3 pt-2">
                    <button
                        className="w-full py-3 bg-white text-black hover:bg-neutral-200 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                        onClick={Login}
                    >
                        <LogIn size={14} /> Log In <ArrowUpRight size={14} />
                    </button>
                    <button
                        className="w-full py-3 bg-black border border-neutral-800 text-white hover:border-neutral-500 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                        onClick={Signup}
                    >
                        <UserPlus size={14} /> Create Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;