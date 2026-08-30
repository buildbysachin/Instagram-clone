"use client"
import { Home, Menu, Search } from "lucide-react"
import Link from "next/link"
import Upload from "./upload"
import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

interface User {
    username?: string;
    profilePic?: string;
}

const Slidebar = () => {
    const [username, setUsername] = useState("")
    const [user, setUser] = useState<User | null>(null)
    let isUnauthorized = false;
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter()

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
                    withCredentials: true
                });
                setUser(res?.data?.user);
                setUsername(res?.data?.user?.username || "");
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    isUnauthorized = true;
                } else {
                    console.error("API Error:", error);
                }
            } finally {
                setLoading(false);
            }

            if (isUnauthorized) {
                router.push("/signin");
            }
        };

        fetchItem(); // ✅ फ़ंक्शन को कॉल करना ज़रूरी है
    }, [username, user]);

    return (
        <div className="flex flex-col px-2 h-screen items-center gap-6 justify-center border-r border-slate-800">
            <Link href="/" className="font-bold hover:text-slate-300 transition">
                <Home className="w-6 h-6" />
            </Link>

            <Link href="/explore" className="font-bold hover:text-slate-300 transition">
                <Search className="w-6 h-6" />
            </Link>

            <Upload />

            <Link href="/setting/edit" className="font-bold hover:text-slate-300 transition">
                <Menu className="w-6 h-6" />
            </Link>

            <Link href={`/${username || ""}`}>
                <img
                    src={user?.profilePic || "/placeholder.png"}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover border border-slate-700 hover:border-slate-500 transition"
                />
            </Link>
        </div>
    )
}

export default Slidebar;