"use client"
import { Home, Search } from "lucide-react"
import Link from "next/link"
import Upload from "./upload"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
    username?: string;
    profilePic?: string;
}

const MobileBottomBar = () => {
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
        <div
            className="flex px-4 py-2 w-screen text-white items-center gap-3 justify-between"
        >
            <Link
                href="/"
                className="font-bold"
            >
                <Home/>
            </Link>
            <Link
                href="/explore"
                className="font-bold"
            >
                <Search/>
            </Link>
            <Upload />
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
export default MobileBottomBar