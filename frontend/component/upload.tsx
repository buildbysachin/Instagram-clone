"use client"
import axios from "axios";
import { Film, Image, Loader2, Plus, Video } from "lucide-react";
import { useRef, useState } from "react";

const Upload = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [caption, setCaption] = useState("");
    const [isCaptionShow, setIsCaptionShow] = useState(false);
    const [isUploading, setIsUploading] = useState(false); // 👈 Loading state

    const handleTypeSelect = (type: "image" | "video" | "reel") => {
        setSelectedType(type);
        setIsOpen(false);

        if (fileInputRef.current) {
            fileInputRef.current.accept = type === "image" ? "image/*" : "video/*";
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            setIsCaptionShow(true);
        }
    };

    const handlePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!file || !selectedType || !caption) {
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("postType", selectedType);
        formData.append("caption", caption);

        // Click hote hi modal band hoga aur loading start hogi
        setIsCaptionShow(false);
        setIsUploading(true);

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/post/upload`,
                formData,
                {
                    withCredentials: true,
                }
            );
            console.log(response?.data?.message);
        } catch (error) {
            console.error("API ERROR:", error);
        } finally {
            // Upload complete ya fail hone par loading band
            setIsUploading(false);
            setFile(null);
            setCaption("");
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <form>
            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center p-3 text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition"
            >
                <Plus />
            </button>

            {/* Uploading Spinner Overlay / Notification */}
            {isUploading && (
                <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                    <span className="text-sm font-medium">Your post is uploading...</span>
                </div>
            )}

            {isOpen && (
                <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-50 flex flex-col p-2 space-y-1">
                    <button
                        type="button"
                        onClick={() => handleTypeSelect("image")}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition"
                    >
                        <Image className="w-4 h-4 text-emerald-500" />
                        <span>Image</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTypeSelect("video")}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition"
                    >
                        <Video className="w-4 h-4 text-emerald-500" />
                        <span>Video</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTypeSelect("reel")}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition"
                    >
                        <Film className="w-4 h-4 text-purple-500" />
                        <span>Reel</span>
                    </button>
                </div>
            )}

            {isCaptionShow && file && (
                <div className="bg-black/40 inset-0 fixed flex justify-center items-center z-50 text-white min-h-screen">
                    <div className="w-min-3/4 bg-white h-3/4 flex rounded-lg overflow-hidden shadow-2xl">
                        {selectedType === "image" && (
                            <img
                                className="w-1/2 object-cover"
                                src={URL.createObjectURL(file)} 
                                alt="post" 
                            />
                        )}

                        {(selectedType === "video" || selectedType === "reel") && (
                            <video src={URL.createObjectURL(file)} controls className="w-1/2 object-cover" />
                        )}

                        <div className="flex flex-col w-96 gap-3 p-4">
                            <label className="text-black font-semibold">Caption</label>
                            <textarea
                                value={caption}
                                className="border border-gray-300 p-2 rounded text-black outline-none focus:border-blue-500 resize-none h-32"
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Write a caption..."
                            />
                            <button
                                type="button"
                                className="bg-red-700 active:bg-red-500 text-white rounded py-2 px-1 font-medium transition mt-auto"
                                onClick={handlePost}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
};

export default Upload;