"use client"

import axios from "axios"
import type { AxiosError } from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Username } from "./username"
import { Contact } from "./contact"

const SignIn = () => {
    const [message, setMessage] = useState("")
    const router = useRouter()

    // Step state tracking (1 se 7)
    const [step, setStep] = useState(0)

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [dp, setDp] = useState<File | null>(null)
    const [gender, setGender] = useState("male")
    const [bio, setBio] = useState("")

    const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append("username", username)
        formData.append("email", email)
        formData.append("phone", phone)
        formData.append("password", password)
        formData.append("fullName", name)
        if (dp) {
            formData.append("profilePic", dp)
        }
        formData.append("gender", gender)
        formData.append("bio", bio)

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

    const validPassword = (password: string) => {
        if (password.length < 8) {
            setMessage("password must be atleast 8 character long")
            return;
        }
        if (!/[A-Z]/.test(password)) {
            setMessage("password must be atleast 1 capital character")
            return;
        }
        if (!/[a-z]/.test(password)) {
            setMessage("password must be atleast 1 small character")
            return;
        }
        if (!/[0-9]/.test(password)) {
            setMessage("password must be atleast 1 number")
            return;
        }

        const symbolMatch = password.match(/[^A-Za-z0-9]/g);
        const symbolCount = symbolMatch ? symbolMatch.length : 0

        if (symbolCount < 4) {
            setMessage("password must be atleast 4 special character")
            return;
        }

        setMessage("")
        setStep(4)
        return;

    }

    return (
        <div className=" bg-slate-950 md:p-6 min-h-screen px-3 flex justify-center items-center">
            <form
                className="md:hidden bg-white p-6 w-full max-w-md rounded-xl flex flex-col justify-center gap-4 items-center"
            >
                {/* Initial Screen */}
                {step === 0 && (
                    <div className="w-full flex flex-col gap-3 items-center">
                        <button
                            type="button"
                            className="bg-red-600 active:scale-95 p-2 text-white w-3/4 rounded"
                            onClick={() => setStep(1)}
                        >
                            Create Account
                        </button>

                        <Link
                            href="/login"
                            className="bg-red-500 active:scale-95 p-2 text-center text-white w-3/4 rounded"
                        >
                            Login
                        </Link>
                    </div>
                )}

                {/* Step 1: Username */}
                {step === 1 && (
                    <Username
                        initialValue={username}
                        onSuccess={(validUsername: string) => {
                            setUsername(validUsername)
                            setStep(2)
                        }

                        }
                    />
                )}

                {/* Step 2: Contact */}
                {step === 2 && (
                    <Contact
                        initialEmail={email}
                        initialPhone={phone}
                        onBack={() => setStep(1)}
                        onSuccess={({ email: validEmail, phone: validPhone }) => {
                            setEmail(validEmail)
                            setPhone(validPhone)
                            setStep(3)
                        }}
                    />
                )}

                {/* Step 3: Password */}
                {step === 3 && (
                    <div className="w-full flex flex-col gap-3 items-center">
                        <input
                            type="password"
                            placeholder="Enter a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-slate-200 px-3 w-3/4 py-2 text-lg rounded outline-none"
                        />

                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="w-1/3 rounded border border-slate-300 py-2 font-medium text-slate-700 active:scale-95 transition"
                        >
                            Back
                        </button>

                        {message && <p className="text-sm text-red-500">{message}</p>}

                        <button
                            type="button"
                            className="bg-red-600 active:scale-95 p-2 text-white w-3/4 rounded"
                            onClick={() => {
                                validPassword(password)
                            }}
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Step 4: Full Name */}
                {step === 4 && (
                    <div className="w-full flex flex-col gap-3 items-center">
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-slate-200 px-3 w-3/4 py-2 text-lg rounded outline-none"
                        />

                        {message && <p className="text-sm text-red-500">{message}</p>}

                        <button
                            type="button"
                            className="bg-red-600 active:scale-95 p-2 text-white w-3/4 rounded"
                            onClick={() => {
                                if (!name) {
                                    setMessage("name is must, Enter your full name")
                                    return;
                                }
                                setStep(5)
                            }}
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Step 5: Profile Picture */}
                {step === 5 && (
                    <div className="w-full flex flex-col gap-3 items-center">
                        <label
                            htmlFor="profiledp"
                            className="bg-slate-200 px-3 w-3/4 py-2 text-center rounded cursor-pointer"
                        >
                            {dp ? dp.name : "Upload Image"}
                        </label>
                        <input
                            type="file"
                            id="profiledp"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    setDp(e.target.files[0])
                                }
                            }}
                        />
                        <button
                            type="button"
                            className="bg-red-600 active:scale-95 p-2 text-white w-3/4 rounded"
                            onClick={() => setStep(6)}
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Step 6: Gender */}
                {step === 6 && (
                    <div className="w-full flex flex-col gap-3 items-center">
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="bg-slate-200 px-3 w-3/4 py-2 text-lg rounded outline-none"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="custom">Custom</option>
                            <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                        <button
                            type="button"
                            className="bg-red-600 active:scale-95 p-2 text-white w-3/4 rounded"
                            onClick={() => setStep(7)}
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Step 7: Bio & Final Submit */}
                {step === 7 && (
                    <div className="w-full flex flex-col gap-3 items-center">
                        <input
                            type="text"
                            placeholder="Enter bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="bg-slate-200 px-3 w-3/4 py-2 text-lg rounded outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-red-600 active:scale-95 p-2 text-white w-3/4 rounded"
                            onClick={handleRegister}
                        >
                            Complete Registration
                        </button>
                    </div>
                )}
            </form>

            <div
                className="hidden md:flex flex-col gap-4 w-2/5 justify-center items-center"
            >
                <Link
                    href="/signin/createAccount"
                    className="bg-red-600 text-center text-lg font-bold active:scale-95 p-2 text-white w-full rounded"
                    
                >
                    Create Account
                </Link>

                <Link
                    href="/login"
                    className="bg-green-600 text-center text-lg font-bold active:scale-95 p-2 text-white w-full rounded"
                    
                >
                    Login
                </Link>
            </div>
        </div>
    )
}

export default SignIn