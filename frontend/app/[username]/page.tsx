"use client"
import { Logout } from "@/component/logout";
import axios from "axios";
import { Menu, Settings, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ProfileUser = {
    _id: string;
    username?: string;
    fullName?: string;
    bio?: string;
    profilePic?: string;
    following?: string[]
    followers?: string[]
};

type UserPost = {
    media?: {
        thumbnailUrl?: string;
        url?: string;
    }[];
    likes?: unknown[];
    comments?: unknown[];
};

const isNotFoundError = (error: unknown) => {
    return axios.isAxiosError(error) && error.response?.status === 404;
};

const UserProfile = () => {
    const [user, setUser] = useState<ProfileUser | null>(null);
    const [post, setPost] = useState<UserPost[]>([]);
    const [isOwner, setIsOwner] = useState(false);
    const [loading, setLoading] = useState(true);
    const params = useParams<{ username: string }>();
    const username = params.username;
    const [isSetting, setIsSetting] = useState(false)
    const [isFollowing, setisFollowing] = useState(false)
    const [isfollowingShow, setisfollowingShow] = useState(false)
    const [isFollowerShow, setisFollowerShow] = useState(false)
    const [follower, setFollower] = useState<ProfileUser[]>([]);
    const [following, setFollowing] = useState<ProfileUser[]>([]);
    const router = useRouter();
    const [profileUserId, setprofileUserId] = useState("")
    const [isUserFollowing, setIsUserFollowing] = useState(false)

    const getMediaThumbnail = (mediaItem?: { url?: string; thumbnailUrl?: string }) => {
        if (!mediaItem) return "/placeholder.png";

        const url = mediaItem.url || "";
        const thumb = mediaItem.thumbnailUrl || "";

        // 1. Agar backend ne valid image thumbnail diya hai (aur wo video nahi hai)
        if (thumb && !thumb.match(/\.(mp4|webm|mov|mkv)(\?.*)?$/i)) {
            return thumb;
        }

        // 2. Agar video hai to ImageKit ka official /ik-thumbnail.jpg route banayein
        if (url.match(/\.(mp4|webm|mov|mkv)(\?.*)?$/i) || url.includes("/video")) {
            const cleanUrl = url.split("?")[0];
            return `${cleanUrl}/ik-thumbnail.jpg`;
        }

        // 3. Normal image URL
        return url || "/placeholder.png";
    };

    const fetchProfile = async () => {
        setLoading(true);
        try {

            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile/${username}`, {
                    withCredentials: true
                })
                const profileUser = res?.data?.user?.[0] ?? null;
                console.log(res?.data?.user);

                setUser(profileUser)
                setFollower(profileUser?.followers)
                setFollowing(profileUser?.following)

                const userId = profileUser?._id

                if (userId) {
                    try {

                        const res1 = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/post/userPost/${userId}`, {
                            withCredentials: true
                        })
                        setPost(res1?.data?.post ?? [])
                    } catch (error: unknown) {
                        if (isNotFoundError(error)) {
                            setPost([]);
                            return null;
                        }
                    }
                }

            } catch (error: unknown) {
                if (isNotFoundError(error)) {
                    return null;
                }
                throw error;
            }

            try {
                const res2 = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/decode/${username}`, {
                    withCredentials: true
                })
                console.log(res2?.data?.message);
                setIsOwner(res2?.data?.isOwner)
                setprofileUserId(res2?.data?.profileUserId)
            } catch (error: unknown) {
                if (isNotFoundError(error)) {
                    return null;
                }
            }

            try {
                const res4 = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/chackFollow/${username}`,
                    { withCredentials: true }
                )
                setisFollowing(res4?.data?.isFollowing)
            } catch (error) {
                if (isNotFoundError(error)) {
                    return null;
                }
            }

            try {
                const res6 = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/chackUserFollowList/${username}`,
                    { withCredentials: true }
                )
                if (res6?.data?.followers) setFollower(res6.data.followers);
                if (res6?.data?.following) setFollowing(res6.data.following);
            } catch (error) {
                if (isNotFoundError(error)) {
                    return null;
                }
            }

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (username) {
            fetchProfile();
        }
    }, [username])

    const handleFollow = async (username: string) => {
        try {
            const res3 = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/follow`,
                { username },
                { withCredentials: true }
            )
            console.log(res3?.data?.message);

            await fetchProfile()

        } catch (error) {
            console.error
        }
    }

    if (loading) {
        return (
            <div className="bg-slate-950 min-h-screen text-slate-100 flex items-center justify-center">
                <p className="text-slate-400">Loading profile...</p>
            </div>
        )
    }

    return (
        <div className="bg-slate-950 min-h-screen text-slate-100 pl-0 md:pl-20 pb-20 md:pb-10 w-full overflow-x-hidden">
            <header
            className="md:hidden px-2 border-b border-slate-700">
                <button
                className="py-2"
                onClick={()=>{
                    router.push('/setting')
                }}
                >
                    <Menu/>
                </button>
            </header>
            <div className="flex flex-col items-center pt-8 md:pt-16 px-4 max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-10 items-center group w-full">
                    <img
                        src={user?.profilePic || "/placeholder.png"}
                        alt={user?.username || "User profile"}
                        className="object-cover w-24 h-24 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border-2 border-slate-700 ring-4 ring-slate-900 group-hover:ring-indigo-500/50 transition-all duration-300"
                    />
                    <div className="flex flex-col gap-2 text-center sm:text-left flex-1 w-full">
                        <div className="flex items-center justify-center sm:justify-start gap-3">
                            <h1 className="text-white font-bold sm:font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tight">
                                {user?.username}
                            </h1>

                            <div className="hidden md:flex relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSetting(!isSetting)
                                    }}
                                    className="active:scale-95 p-1"
                                >
                                    {isOwner && (
                                        <Settings className="w-5 h-5 text-slate-300 hover:text-white" />
                                    )}
                                </button>
                                {isSetting && (
                                    <div
                                        className="bg-slate-800 hover:bg-slate-700 rounded absolute right-0 top-7 sm:left-0 w-48 text-center shadow-xl shadow-black/60 z-20"
                                    >
                                        <Logout />
                                    </div>
                                )}
                            </div>
                        </div>
                        <h2 className="text-slate-300 text-sm sm:text-base font-medium">{user?.fullName}</h2>

                        {/* Counts (Posts, Followers, Following) */}
                        <div className="flex gap-6 sm:gap-8 text-slate-300 mt-2 justify-center sm:justify-start text-sm sm:text-base">
                            <p><span className="font-semibold text-slate-100">{post?.length || 0}</span> posts</p>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => { setisFollowerShow(true) }}
                                    className="hover:text-slate-100 transition"
                                >
                                    <span className="font-semibold text-slate-100">{user?.followers?.length || 0} </span>
                                    followers
                                </button>

                                {isFollowerShow && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                                        <div className="flex w-full max-w-md max-h-[80vh] flex-col rounded-xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
                                            <div className="relative border-b border-slate-800 py-3.5 px-4 flex items-center justify-center">
                                                <h1 className="text-center text-slate-100 font-semibold text-base">Followers</h1>
                                                <button
                                                    className="absolute right-3 text-slate-400 hover:text-white"
                                                    onClick={() => { setisFollowerShow(false) }}
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="flex flex-col overflow-y-auto divide-y divide-slate-800/60 p-2">
                                                {follower?.map((elem: any, idx: number) => {
                                                    return (
                                                        <div
                                                            key={elem._id || idx}
                                                            className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-800/50 rounded-lg transition cursor-pointer"
                                                            onClick={() => {
                                                                setisFollowerShow(false);
                                                                router.push(`/${elem.username}`)
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-3 min-w-0 pr-2">
                                                                <img
                                                                    src={elem.profilePic || "/placeholder.png"}
                                                                    alt="logo"
                                                                    className="w-10 h-10 object-cover rounded-full shrink-0"
                                                                />
                                                                <div className="flex flex-col min-w-0 text-left">
                                                                    <h1 className="text-slate-100 font-bold text-sm truncate">{elem.username}</h1>
                                                                    <h2 className="text-slate-400 text-xs truncate">{elem.fullName}</h2>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                {(elem._id !== profileUserId) && (
                                                                    <div className="shrink-0">
                                                                        {elem.isFollowing ? (
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleFollow(elem.username)
                                                                                    elem.isFollowing = false;
                                                                                    setFollower([...follower]);
                                                                                }}
                                                                                className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 text-xs font-semibold text-white active:scale-95 transition">
                                                                                Following
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleFollow(elem.username)
                                                                                    elem.isFollowing = true;
                                                                                    setFollower([...follower]);
                                                                                }}
                                                                                className="rounded-lg bg-green-700 hover:bg-green-600 px-4 py-1.5 text-xs font-semibold text-white active:scale-95 transition">
                                                                                Follow
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <button
                                    type="button"
                                    onClick={() => { setisfollowingShow(true) }}
                                    className="hover:text-slate-100 transition"
                                >
                                    <span className="font-semibold text-slate-100">{user?.following?.length || 0} </span>
                                    following
                                </button>

                                {isfollowingShow && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                                        <div className="flex w-full max-w-md max-h-[80vh] flex-col rounded-xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
                                            <div className="relative border-b border-slate-800 py-3.5 px-4 flex items-center justify-center">
                                                <h1 className="text-center text-slate-100 font-semibold text-base">Following</h1>
                                                <button
                                                    className="absolute right-3 text-slate-400 hover:text-white"
                                                    onClick={() => { setisfollowingShow(false) }}
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="flex flex-col overflow-y-auto divide-y divide-slate-800/60 p-2">
                                                {following?.map((elem: any, idx: number) => {
                                                    return (
                                                        <div
                                                            key={elem._id || idx}
                                                            className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-800/50 rounded-lg transition cursor-pointer"
                                                            onClick={() => {
                                                                setisfollowingShow(false)
                                                                router.push(`/${elem.username}`)
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-3 min-w-0 pr-2">
                                                                <img
                                                                    src={elem.profilePic || "/placeholder.png"}
                                                                    alt="logo"
                                                                    className="w-10 h-10 object-cover rounded-full shrink-0"
                                                                />
                                                                <div className="flex flex-col min-w-0 text-left">
                                                                    <h1 className="text-slate-100 font-bold text-sm truncate">{elem.username}</h1>
                                                                    <h2 className="text-slate-400 text-xs truncate">{elem.fullName}</h2>
                                                                </div>
                                                            </div>

                                                            {elem._id !== profileUserId && (
                                                                <div className="shrink-0">
                                                                    {elem.isFollowing ? (
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleFollow(elem.username);
                                                                                elem.isFollowing = false;
                                                                                setFollowing([...following]);
                                                                            }}
                                                                            className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 text-xs font-semibold text-white active:scale-95 transition"
                                                                        >
                                                                            Following
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleFollow(elem.username);
                                                                                elem.isFollowing = true;
                                                                                setFollowing([...following]);
                                                                            }}
                                                                            className="rounded-lg bg-green-700 hover:bg-green-600 px-4 py-1.5 text-xs font-semibold text-white active:scale-95 transition"
                                                                        >
                                                                            Follow
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="text-slate-300 my-3 sm:my-4 max-w-lg text-sm sm:text-base">
                            {user?.bio || "No bio available."}
                        </p>
                    </div>
                </div>

                {/* Profile Actions */}
                {isOwner && (
                    <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm mt-4 sm:mt-6 font-semibold w-full justify-center sm:justify-start">
                        <button className="flex-1 sm:flex-initial rounded-lg bg-slate-800 hover:bg-slate-700 px-4 sm:px-8 py-2.5 transition duration-200"
                        onClick={()=>{
                            router.push("/setting/edit")
                        }}
                        >
                            Edit Profile
                        </button>
                        <button className="flex-1 sm:flex-initial rounded-lg bg-slate-800 hover:bg-slate-700 px-4 sm:px-8 py-2.5 transition duration-200">
                            View archive
                        </button>
                    </div>
                )}

                {!isOwner && (
                    <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm mt-4 sm:mt-6 font-semibold w-full justify-center sm:justify-start">
                        {isFollowing && (
                            <button
                                type="button"
                                onClick={() => {
                                    handleFollow(username)
                                }}
                                className="flex-1 sm:flex-initial rounded-lg bg-slate-800 hover:bg-slate-700 px-6 sm:px-10 active:scale-95 py-2.5 transition duration-200">
                                Following
                            </button>
                        )}
                        {!isFollowing && (
                            <button
                                type="button"
                                onClick={() => {
                                    handleFollow(username)
                                }}
                                className="flex-1 sm:flex-initial rounded-lg bg-green-700 hover:bg-green-600 active:scale-95 px-6 sm:px-10 py-2.5 transition duration-200">
                                Follow
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Posts Grid */}
            <div className="flex justify-center mt-8 sm:mt-12 px-1 sm:px-4">
                <div className="w-full max-w-4xl">
                    <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-3">
                        {post && post.length > 0 ? (
                            post.map((elem, idx) => {
                                const mediaUrl = getMediaThumbnail(elem.media?.[0]);

                                return (
                                    <div
                                        key={idx}
                                        className="relative overflow-hidden aspect-square rounded-sm bg-slate-900 group cursor-pointer"
                                    >
                                        {mediaUrl ? (
                                            <img
                                                className="object-cover w-full h-full transform transition duration-300 group-hover:scale-105"
                                                src={mediaUrl}
                                                alt={`Post ${idx + 1}`}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-700 text-xs sm:text-sm">
                                                No Media
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 sm:gap-6 text-white text-xs sm:text-sm font-bold">
                                            <span>❤️ {elem.likes?.length || 0}</span>
                                            <span>💬 {elem.comments?.length || 0}</span>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="col-span-3 text-center py-16 sm:py-20 text-slate-600">
                                <p className="text-xl sm:text-2xl font-bold">No Posts Yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default UserProfile;