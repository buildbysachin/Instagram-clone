"use client"
import axios from "axios";
import { Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface chatUser {
    profilePic?: string,
    username?: string,
    fullName?: string
}

interface messageUser {
    text?: string
}

const MessageForm = () => {
    const params = useParams<{ conversationId: string }>();
    const conversationId = params.conversationId;
    const [otherPerson, setotherPerson] = useState<chatUser | null>(null)
    const [chat, setChat] = useState("")
    const [isChat, setIsChat] = useState(false)
    const [message, setMessage] = useState<messageUser[]>([])

    const handleClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/message`,
            { conversationId, text: chat },
            { withCredentials: true }
        )

        console.log(res?.data?.message);
        setChat("")
    }

    useEffect(() => {
        const fetchedItem = async () => {

            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/chats/${conversationId}`,
                    { withCredentials: true }
                )
                setotherPerson(res?.data?.otherPerson);
            } catch (error) {
                console.error(error)
            }

            try {
                const resMessage = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/messages/${conversationId}`,
                    { withCredentials: true }
                )

                setMessage(resMessage?.data?.userMessage);


            } catch (error) {
                console.error(error)
            }
        }
        fetchedItem()
    }, [handleClicked])

    return (
        <div className="flex flex-col h-screen bg-slate-950 pb-15 md:pb-0 overflow-hidden">
            {/* Header - Fixed height */}
            <header className="flex items-center gap-3 text-white p-4 border-b border-slate-700 bg-slate-950 z-10">
                <img
                    src={otherPerson?.profilePic}
                    alt={otherPerson?.username}
                    className="w-12 object-cover h-12 rounded-full"
                />
                <div>
                    <h1 className="font-bold text-lg">{otherPerson?.fullName}</h1>
                    <p className="text-slate-300 text-sm">{otherPerson?.username}</p>
                </div>
            </header>

            {/* Chat Messages Area (Middle Space) */}
            <div className="flex-1 overflow-y-auto p-4 text-white">
                {/* Yahan aapke chat messages map honge */}
                {message.length === 0 && (
                    <p className="text-slate-500 text-center">No messages yet...</p>
                )}

                <div
                className="flex flex-col gap-2"
                >
                    {message.map((elem: any) => {
                        return (
                            <div
                                key={elem._id}
                            >
                                <p
                                    className="bg-red-600 w-fit text-white p-2 rounded"
                                >{elem.text}</p>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Footer / Input Box - Bottom fixed inside flex */}
            <div className="p-4 bg-slate-900 border-t border-slate-700 relative flex items-center">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 outline-none focus:border-blue-500 pr-12"
                    value={chat}
                    onChange={(e) => {
                        setChat(e.target.value)
                        setIsChat(e.target.value.length > 0)
                    }}
                />

                {isChat && (
                    <button className="absolute right-7 text-blue-500 hover:text-blue-400"
                        onClick={handleClicked}
                    >
                        <Send size={20} />
                    </button>
                )}
            </div>
        </div>
    )
}
export default MessageForm;