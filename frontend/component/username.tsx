"use client"

import axios from "axios";
import { useEffect, useState } from "react"

interface Props {
    initialValue: string;
    onSuccess: (validUsername: string) => void;
}

export const Username = ({ initialValue, onSuccess }: Props) => {
    const [username, setUsername] = useState(initialValue)
    const [message, setMessage] = useState("")
    const [isAvailable, setisAvailable] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!username.trim()) {
            setMessage("");
            setisAvailable(false);
            return
        }

        const timer = setTimeout(async () => {
            try {
                setLoading(true)
                setMessage("")

                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/username`,
                    { username: username.trim() },
                    { withCredentials: true }
                )

                setMessage(response?.data?.message || "Username is available")
                console.log(response?.data);
                
                setisAvailable(true)
            } catch (error: any) {
                setisAvailable(false)
                setMessage(
                    error.response?.data?.message
                )
            } finally {
                setLoading(false)
            }
        }, 500)

        return () => clearTimeout(timer);
    }, [username])

    return (
        <div
            className="w-full flex flex-col gap-3 items-center"
        >
            <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-200 px-3 w-3/4 py-2 text-lg rounded outline-none"
            />
            {loading && <p className="text-sm text-slate-500">Checking...</p>}
            {message && (
                <p className={`text-sm ${isAvailable ? "text-green-600" : "text-red-500"}`}>
                    {message}
                </p>
            )}
            <button
                type="button"
                disabled={!isAvailable || loading}
                onClick={() => { onSuccess(username) }}
                className="bg-red-600 active:scale-95 p-2 text-white w-3/4 rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
    )
}