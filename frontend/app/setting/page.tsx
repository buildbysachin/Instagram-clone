import { Logout } from "@/component/ui/logout"
import { ChevronLeft } from "lucide-react";
import { redirect } from "next/navigation";

const ssetting = () => {
    return (
        <div
            className="bg-slate-950 md:bg-white h-screen px-3 md:flex md:justify-center md:items-center pt-4"
        >
            <div
            className="md:hidden"
            >
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

            <div
            className="hidden md:flex fixed inset-0 z-30 h-screen bg-white justify-center items-center text-5xl font-bold"
            >
                <h1>
                    PAGE NOT FOUND!
                </h1>
            </div>

        </div>
    )
}

export default ssetting;