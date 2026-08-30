import { Home, Search } from "lucide-react"
import Link from "next/link"
import Upload from "./upload"

const MobileBottomBar = () => {
    return (
        <div
            className="flex px-4 py-2 w-screen text-white items-center gap-3 justify-between"
        >
            <Link
                href="/"
                className="font-bold"
            >
                <Home/>
            </Link>
            <Link
                href="/explore"
                className="font-bold"
            >
                <Search/>
            </Link>
            <Upload />
        </div>
    )
}
export default MobileBottomBar