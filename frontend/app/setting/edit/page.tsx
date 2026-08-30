"use client"

import axios, { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
    profilePic?: string;
    username?: string;
    fullName?: string;
    bio?: string
}

const Edit = () => {
    const [user, setUser] = useState<User | null>(null)
    const [message, setMessage] = useState("")
    const router = useRouter()
    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
                    withCredentials: true
                });
                setUser(res?.data?.user);

            } catch (error) {
                console.error("Sidebar user fetch error:", error);
            }
        };

        fetchItem(); // ✅ फ़ंक्शन को कॉल करना ज़रूरी है
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const formData = new FormData(e.currentTarget)

            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/userEdit`,
                formData,
                { withCredentials: true }
            )

            setMessage(response?.data?.errors?.[0]?.msg)
            console.log(response?.data?.errors?.[0]?.msg);

            const username = response?.data?.username
            console.log(username);

            router.push(`/${username}`)
        } catch (error) {
            const axiosError = error as AxiosError<{
                message?: string
                errors?: { msg?: string }[]
            }>

            setMessage(
                axiosError.response?.data?.message ||
                axiosError.response?.data?.errors?.[0]?.msg ||
                "Something went wrong"
            )
        }

    }
    return (
        <div
            className="min-h-screen lg:px-20 pt-16 bg-slate-950"
        >

            <form
                onSubmit={handleSubmit}
                className="px-14 flex flex-col gap-3"
            >
                <h1
                    className="text-white font-semibold text-2xl pb-4"
                >Edit Profile</h1>

                <div
                    className="hidden md:flex justify-between bg-slate-800 items-center lg:px-3 py-3 rounded"
                >
                    <div
                        className="flex gap-2"
                    >
                        <img
                            src={user?.profilePic}
                            alt="logo"
                            className="w-13 h-13 object cover rounded-full"
                        />
                        <div
                            className="text-white flex flex-col"

                        >
                            <h1
                                className="font-bold"
                            >{user?.username}</h1>
                            <h2>{user?.fullName}</h2>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="profileUpdate"
                            className="bg-blue-600 text-white px-2 py-1 rounded"
                        >upload Image</label>
                        <input type="file"
                            id="profileUpdate"
                            className="hidden"
                            name="file"
                        />
                    </div>
                </div>

                <div 
                className="flex md:hidden justify-center items-center py-3">
                    <div className="relative w-30 h-30">
                        <img
                            src={user?.profilePic}
                            alt="logo"
                            className="w-full h-full object-cover rounded-full"
                        />

                        {/* Plus Icon: ab ye avatar ke bottom-right se calculate hoga */}
                        <div className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full p-1 cursor-pointer">
                            <label htmlFor="profileUpdate" className="cursor-pointer">
                                <Plus size={18} color="white" />
                            </label>
                            <input
                                type="file"
                                id="profileUpdate"
                                className="hidden"
                                name="file"
                            />
                        </div>
                    </div>
                </div>

                <div
                >
                    <label
                        className="font-bold text-white pb-5 text-lg"
                    >
                        Bio
                    </label>
                    <textarea
                        name="bio"
                        className="border-slate-800 pl-3 py-2 border text-white w-full rounded"
                        defaultValue={user?.bio}
                    />
                </div>

                <div
                >
                    <label
                        className="font-bold text-white pb-5 text-lg"
                    >
                        username
                    </label>
                    <input
                        name="username"
                        className="border-slate-800 px-4 py-3 border text-white w-full rounded"
                        defaultValue={user?.username}
                    />
                </div>

                <div
                >
                    <label
                        className="font-bold text-white pb-5 text-lg"
                    >
                        Full Name
                    </label>
                    <input
                        name="fullName"
                        className="border-slate-800 px-4 py-3 border text-white w-full rounded"
                        defaultValue={user?.fullName}
                    />

                </div>

                <select
                    name="gender"
                    className="border border-slate-800 text-white bg-slate-800 p-3"
                >
                    <option value="male">male</option>
                    <option value="female">female</option>
                    <option value="custom">custom</option>
                    <option value="prefer_not_to_say">prefer_not_to_say</option>
                </select>

                {message && (
                    <p className="text-lg text-red-500">{message}</p>
                )}

                <button
                    className="bg-red-700 rounded p-2 text-lg text-white"
                >
                    Submit
                </button>
            </form>
        </div>
    )
}
export default Edit;