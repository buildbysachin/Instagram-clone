"use client"
import axios, { AxiosError } from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

const RegisterUser = () => {
    const [message, setMessage] = useState("")
    const router = useRouter()
    const [isPhone, setIsPhone] = useState(false)
    const [isEmail, setisEmail] = useState(true)

    const handleUserRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
                formData,
                { withCredentials: true }
            )

            if (response?.data?.token) {
                localStorage.setItem("token", response.data.token)
            }

            setMessage(response?.data?.message)
            router.push('/')

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
            className=" bg-slate-950  hidden w-1/2 md:flex flex-col gap-7 justify-center"
        >
            <h1
                className="text-white text-center text-4xl font-bold"
            >
                Create Account
            </h1>

            <form
                className="flex flex-col gap-8"
                onSubmit={handleUserRegister}
            >



                {isEmail && (
                    <div
                        className="flex flex-col gap-2"
                    >
                        <button
                            type="button"
                            onClick={() => {
                                setIsPhone(true)
                                setisEmail(false)
                            }}
                            className="bg-amber-400 text-lg rounded active:scale-98 hover:bg-amber-500 text-black py-3"
                        >
                            sign in with Phone
                        </button>

                        <label
                            className="text-white text-lg"
                        >
                            Email address
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="border-slate-600 border rounded h-15 text-white pl-4 text-lg w-full"
                        />
                    </div>
                )}

                {isPhone && (
                    <div
                        className="flex flex-col gap-2"
                    >
                        <button
                            type="button"
                            onClick={() => {
                                setIsPhone(false)
                                setisEmail(true)
                            }}
                            className="bg-amber-400 text-lg rounded active:scale-98 hover:bg-amber-500 text-black py-3"
                        >
                            sign in with email
                        </button>

                        <label
                            className="text-white text-lg"
                        >
                            Phone no.
                        </label>
                        <input
                            type="text"
                            name="phone"
                            className="border-slate-600 border rounded h-15 text-white pl-4 text-lg w-full"
                        />
                    </div>
                )}

                <div
                    className="flex flex-col gap-2"
                >
                    <label
                        className="text-white text-lg"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        className="border-slate-600 border rounded h-15 text-white pl-4 text-lg w-full"
                    />
                </div>

                <div
                    className="flex flex-col gap-2"
                >
                    <label
                        className="text-white text-lg"
                    >
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        className="border-slate-600 border rounded h-15 text-white pl-4 text-lg w-full"
                    />
                </div>

                <div
                    className="flex flex-col gap-2"
                >
                    <label
                        className="text-white text-lg"
                    >
                        username
                    </label>
                    <input
                        type="text"
                        name="username"
                        className="border-slate-600 border rounded h-15 text-white pl-4 text-lg w-full"
                    />
                </div>

                {message && (
                    <p
                    className="text-red-300"
                    >{message}</p>
                )}

                <button
                    className="bg-green-600 rounded w-full p-2 text-white hover:bg-green-700 text-lg font-bold"
                >
                    Submit
                </button>

                <Link
                    href="/login"
                    className="bg-slate-900 text-center rounded w-full p-2 text-white hover:bg-slate-800 text-lg font-bold"
                >
                    I already have an account
                </Link>

            </form>

        </div>
    )
}
export default RegisterUser;