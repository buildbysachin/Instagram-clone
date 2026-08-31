"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SearchForm = () => {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [accounts, setAccounts] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        if (!username.trim()) {
        setAccounts([]);
        return;
    }
        const timer = setTimeout(async () => {
            setLoading(true)
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/explore/${username}`,
                    { withCredentials: true }
                )
                setAccounts(res?.data?.user)
                console.log(res?.data?.message);
                console.log(res?.data);
            } catch (error: any) {
                console.error(error);
                console.log(error.res?.data?.message);

            } finally {
                setLoading(false)
            }
        }, 500)

        return () => clearTimeout(timer);
    }, [username])

    const handleClick = (username: string) => {
        router.push(`/${username}`)
    }
    return (
        <form
            className="w-full max-w-2xl px-4 py-8 flex flex-col gap-4"
        >
            <div
                className="relative w-full"
            >
                <input
                    type="text"
                    value={username}
                    placeholder="Search creators, friends, accounts..."
                    className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 text-base py-3.5 pl-4 pr-12 rounded-xl border border-slate-800 shadow-inner focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
                    onChange={(e) => { setUsername(e.target.value) }}
                />
                {loading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {accounts.map((elem: any, idx: number) => {
                return (
                    <div
                        key={idx}
                        onClick={() => { handleClick(elem.username) }}
                        className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 p-3.5 rounded-xl flex items-center gap-4 transition-all duration-200 cursor-pointer shadow-sm group"
                    >
                        <img
                            src={elem.profilePic}
                            alt="logo"
                            className="w-13 h-13 min-w-13 min-h-13 object-cover rounded-full border border-slate-700 ring-2 ring-slate-800 group-hover:ring-indigo-500/50 transition-all duration-200"
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-semibold text-slate-100 truncate group-hover:text-indigo-400 transition-colors">
                                    @{elem.username}
                                </h2>
                            </div>
                            <p
                                className="text-sm text-slate-400 font-normal truncate"
                            >{elem.fullName}</p>
                            <p
                                className="text-xs text-slate-500 line-clamp-1 mt-0.5"
                            >{elem.bio}</p>
                        </div>
                    </div>
                )
            })}
        </form>
    )
}
export default SearchForm;