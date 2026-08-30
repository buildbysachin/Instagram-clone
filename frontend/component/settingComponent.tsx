import { Logout } from "@/component/logout"
import { ChevronLeft } from "lucide-react";
import { redirect } from "next/navigation";

const Setting = () => {
    return (
        <div
            className="bg-slate-950 h-screen px-3 lg:w-96 md:w-80 pt-4"
        >
            <div>
                <div className="relative">
                    <h1
                        className="text-center text-white border-b pb-3 border-slate-600 font-semibold text-lg"
                    >
                        setting and privacy
                    </h1>

                    <button
                        className="md:hidden absolute top-0"
                    >
                        <ChevronLeft color="white" size={35} />
                    </button>
                </div>
                <div className="flex md:hidden flex-col text-lg text-white justify-center items-center hover:bg-slate-500">
                    <Logout />
                </div>
            </div>

        </div>
    )
}

export default Setting;