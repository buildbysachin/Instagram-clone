"use client"

import { useState } from "react"

interface Props {
    initialEmail: string;
    initialPhone: string;
    onSuccess: (data: { email: string; phone: string }) => void;
    onBack: () => void
}

export const Contact = ({ initialEmail, initialPhone, onSuccess, onBack }: Props) => {
    const [email, setEmail] = useState(initialEmail)
    const [phone, setPhone] = useState(initialPhone)
    const [message, setMessage] = useState("")

    const validateEmail = (val: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    };

    const validatePhone = (val: string) => {
        return /^[0-9]{10}$/.test(val.trim());
    };

    const handleNext =()=>{
        setMessage("")

        if(!email && !phone){
            setMessage("pls enter either email or phone number")
            return;
        }

        if(email.trim() && !validateEmail(email.trim())){
            setMessage("invalid email address")
            return;
        }

        if(phone.trim() && !validatePhone(phone.trim())){
            setMessage("pls enter a valid 10 digit mobile number")
            return;
        }

        onSuccess({
            email:email.trim(),
            phone:phone.trim()
        })
    }

    return (
        <div className="w-full flex flex-col gap-3 items-center">
      <h2 className="text-lg font-semibold text-slate-800">Add contact info</h2>

      <input
        type="email"
        placeholder="Enter email address"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (message) setMessage("");
        }}
        className="bg-slate-200 px-3 w-3/4 py-2 text-base rounded outline-none focus:ring-2 focus:ring-slate-400"
      />

      <div className="flex items-center gap-2 w-3/4">
        <div className="h-[1px] bg-slate-300 flex-1" />
        <span className="text-xs text-slate-400 uppercase">OR</span>
        <div className="h-[1px] bg-slate-300 flex-1" />
      </div>

      <input
        type="tel"
        placeholder="Enter 10-digit mobile number"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          if (message) setMessage("");
        }}
        className="bg-slate-200 px-3 w-3/4 py-2 text-base rounded outline-none focus:ring-2 focus:ring-slate-400"
      />

      {message && (
        <p className="text-sm font-medium text-red-500 text-center w-3/4">
          {message}
        </p>
      )}

      <div className="flex w-3/4 gap-2 mt-2">
        <button
          type="button"
          onClick={onBack}
          className="w-1/3 rounded border border-slate-300 py-2 font-medium text-slate-700 active:scale-95 transition"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="w-2/3 bg-red-600 active:scale-95 py-2 text-white font-medium rounded transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};