"use client"

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ChatUser {
    _id?: string,
    profilePic?: string,
    username?: string,
    fullName?: string
}

const MessageUsers = () => {
    const [user, setUser] = useState<ChatUser[]>([])
    const router = useRouter()

    useEffect(() => {
        const fetchedUser = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
                    { withCredentials: true }
                )

                setUser(res?.data?.user?.following)

            } catch (error) {
                console.error(error);
            }
        }
        fetchedUser()
    }, [])

    const handleMessage = async (messageUser: string)=>{

        const resChat = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/chats`,
            {messageUser},
            {withCredentials: true}
        )

        const conservationId = resChat?.data?.user?._id
        console.log(conservationId);
        

        router.push(`/message/t/${conservationId}`)
        
    }

    return (
        <div
            className="bg-slate-950 p-3 border-r border-slate-400 min-h-screen"
        >
            <div
            className="flex flex-col gap-3"
            >
                {user.map((elem: any) => {
                    return (
                        <div key={elem._id}
                            className="flex justify-start gap-2 items-center"
                            onClick={()=>{
                                handleMessage(elem._id)
                            }}
                        >
                            <img
                                src={elem.profilePic}
                                alt={elem.username}
                                className="w-15 h-15 object-cover rounded-full" />

                                <h1
                                className="text-white text-lg"
                                >
                                    {elem.fullName}
                                </h1>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
export default MessageUsers;