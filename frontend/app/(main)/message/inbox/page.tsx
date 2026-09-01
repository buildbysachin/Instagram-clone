import MessageUsers from "@/component/modals/messageUser";
import { Send } from "lucide-react"

const Inbox = () => {
    return (
        <>
            <div
                className="hidden bg-slate-950 min-h-screen text-white md:flex flex-col justify-center items-center"
            >
                <Send size={70} />
                <h1
                    className="font-bold text-xl"
                >
                    welcome on zylomog message
                </h1>
            </div>

            <div
            className="md:hidden"
            >
                <MessageUsers/>
            </div>
        </>
    )
}
export default Inbox;