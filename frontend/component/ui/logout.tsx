"use client"
import axios from "axios";
import { useRouter } from "next/navigation";

export const Logout =()=> {
    const router = useRouter()
    const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>)=> {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
                {},
                {
                    withCredentials: true,
                }
            );
            console.log(response?.data?.message);
            router.push('/signin')
        } catch (error) {
            console.error("API ERROR:", error);
        }
    }

    return (
        <div className="p-3">
            <button
            className=" active:scale-98 text-white/90 rounded font-light"
            onClick={handleLogout}>
                Logout
            </button>
        </div>
    )
}