import { useNavigate } from "react-router-dom"

const Auth = ()=>{
    const navigator = useNavigate();
    const Signup=async()=>{
        navigator("/Auth/Signup")
    }
    const Login=async()=>{
        navigator("/Auth/Login")
    }
    return(
        <>
        <div className="flex flex-col justify-center items-center">
            <button className="w-fit h-fit bg-white text-black p-3 mt-20 rounded-2xl hover:bg-gray-600 cursor-pointer"
                onClick={Signup}
                >
                Signup
            </button>
            <button className="w-fit h-fit bg-white text-black p-3 mt-20 rounded-2xl hover:bg-gray-600 cursor-pointer"
                onClick={Login}
                >
                Login
            </button>
        </div>
        </>
    )
}
export default Auth;