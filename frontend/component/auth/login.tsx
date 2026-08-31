"use client"
import axios from "axios"
import type { AxiosError } from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react"

const LoginForm = () => {
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMessage("")
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const payload = {
            identifier: formData.get("identifier"),
            password: formData.get("password"),
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
                payload,
                {
                    withCredentials: true,
                }
            )

            if (response?.data?.token) {
                localStorage.setItem("token", response.data.token)
            }

            setMessage(response?.data?.message)
            router.push("/")
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>
            setMessage(axiosError.response?.data?.message || "Something went wrong. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Welcome Back
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                    Please enter your details to sign in
                </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
                {/* Identifier Field */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600 tracking-wide uppercase">
                        Username / Email / Phone
                    </label>
                    <div className="relative flex items-center">
                        <Mail className="absolute left-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            name="identifier"
                            required
                            placeholder="Enter username, email or phone"
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition duration-200"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-gray-600 tracking-wide uppercase">
                            Password
                        </label>
                    </div>
                    <div className="relative flex items-center">
                        <Lock className="absolute left-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            placeholder="••••••••"
                            className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition duration-200"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none p-1 cursor-pointer"
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {message && (
                    <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                        <p className="text-xs text-red-700 font-medium">{message}</p>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-4 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-medium text-sm rounded-xl shadow-lg shadow-red-600/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Logging in...</span>
                        </>
                    ) : (
                        <>
                            <span>Login</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>

                {/* Divider */}
                <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-xs uppercase font-medium text-gray-400">
                        Don't have an account?
                    </span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* Register Button */}
                <Link
                    href="/signin"
                    className="w-full py-3 px-4 border border-gray-200 hover:bg-gray-50 active:scale-[0.98] text-gray-700 font-medium text-sm rounded-xl text-center transition-all duration-200 block"
                >
                    Create an account
                </Link>
            </form>
        </div>
    )
}

export default LoginForm