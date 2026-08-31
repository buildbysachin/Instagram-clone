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
    const [isUploading, setIsUploading] = useState(false);

    const handleTypeSelect = (type: "image" | "video" | "reel") => {
        setSelectedType(type);
        setIsOpen(false);

        if (fileInputRef.current) {
            fileInputRef.current.accept = type === "image" ? "image/*" : "video/*";
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (uploadedFile) {
            setFile(uploadedFile);
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
            setIsUploading(false);
            setFile(null);
            setCaption("");
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <form>
            {/* Hidden Input */}
            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            <div className="relative">
                <button
                    type="button"
                    onClick={() => {
                        setIsOpen(!isOpen)
                        console.log("opened");

                    }}
                    className="flex relative items-center active:bg-blue-400 justify-center p-3 text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition"
                >
                    <Plus />
                </button>

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

                {isOpen && (
                    <div className="md:hidden flex fixed inset-0 z-15 justify-center items-end bottom-22 ">
                        <div
                            className="bg-white h-fit w-fit rounded flex gap-3 p-2"
                        >
                            <button
                                type="button"
                                onClick={() => handleTypeSelect("image")}
                                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition"
                            >
                                <Image className="w-4 h-4 hover:bg-slate-200 text-emerald-500" />
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
                    </div>
                )}
            </div>

            {/* Uploading Spinner Overlay */}
            {isUploading && (
                <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                    <span className="text-sm font-medium">Your post is uploading...</span>
                </div>
            )}

            {/* Responsive Caption Modal */}
            {isCaptionShow && file && (
                <div className="bg-black/60 inset-0 fixed flex justify-center items-center z-50 p-4">
                    <div className="bg-white w-full max-w-xl flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl max-h-[90vh]">

                        {/* Media Preview (Responsive) */}
                        <div className="w-full md:w-1/2 bg-black flex items-center justify-center overflow-hidden">
                            {selectedType === "image" && (
                                <img
                                    className="w-full h-full object-contain max-h-[300px] md:max-h-[400px]"
                                    src={URL.createObjectURL(file)}
                                    alt="post preview"
                                />
                            )}

                            {(selectedType === "video" || selectedType === "reel") && (
                                <video
                                    src={URL.createObjectURL(file)}
                                    controls
                                    className="w-full h-auto object-contain max-h-[350px]"
                                />
                            )}
                        </div>

                        {/* Caption & Post Section */}
                        <div className="flex flex-col w-full md:w-1/2 gap-3 p-4 justify-between">
                            <div className="flex flex-col gap-2">
                                <label className="text-black font-semibold text-sm">Write a Caption</label>
                                <textarea
                                    value={caption}
                                    className="border border-gray-300 p-2 rounded text-black outline-none focus:border-blue-500 resize-none h-28 md:h-32 text-sm"
                                    onChange={(e) => setCaption(e.target.value)}
                                    placeholder="What's on your mind?"
                                />
                            </div>
                            <button
                                type="button"
                                className="bg-red-700 active:bg-red-500 text-white rounded py-2 px-4 font-medium transition w-full"
                                onClick={handlePost}
                            >
                                Share Post
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </form>
    );
};

export default Upload;