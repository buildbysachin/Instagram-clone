"use client"
import axios from "axios";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define TypeScript interfaces for strict type safety
interface Author {
  username: string;
  fullName: string;
  profilePic?: string;
  isFollowing?: boolean;
  _id?: string;
}

interface MediaItem {
  url: string;
}

interface Post {
  _id?: string;
  id?: string;
  author: Author;
  postType: "image" | "video" | "reel";
  media: MediaItem[];
  caption?: string;
  createdAt?: string;
  like?: string[];
}

const Home = () => {
  let isUnauthorized = false;
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter()
  const [profileUserId, setprofileUserId] = useState("")
  const [isOwner, setIsOwner] = useState(false);
  const [isFollowing, setisFollowing] = useState(false)
  const [loading, setLoading] = useState<boolean>(true);
  const [totalLikes, setTotalLikes] = useState(0)
  const [isLiked, setisLiked] = useState(false)

  useEffect(() => {
    const fetchedPost = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/post/posts`, {
          withCredentials: true
        });

        setPosts(response?.data?.post || [])

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          withCredentials: true
        })

        setprofileUserId(res?.data?.loggedInUserId)

      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          isUnauthorized = true;
        } else {
          console.error("API Error:", error);
        }
      } finally {
        setLoading(false);
      }

      if (isUnauthorized) {
        router.push("/signin");
      }
    }
    fetchedPost();
  }, [router])


  const handleFollow = async (username: string, postIndex: number) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/follow`,
        { username },
        { withCredentials: true }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post, idx) => {
          if (post.author.username === username) {
            return {
              ...post,
              author: {
                ...post.author,
                isFollowing: !post.author.isFollowing,
              },
            };
          }
          return post;
        })
      );

    } catch (error: unknown) {
      console.error(error)
    }

  }

  const handleLike = async (postId: string) => {
    try {
      const resLike = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/post/like/${postId}`,
        {},
        { withCredentials: true }
      )
      console.log(resLike?.data?.message);
      setTotalLikes(resLike?.data?.totalLikes)
      setisLiked(resLike?.data?.isLiked)

      setPosts((prevPosts) =>
        prevPosts.map((elem) => {
          const id = elem._id || elem.id;

          if (id === postId) {
            const currentLikes = elem.like || [];
            const isCurrentlyLiked = currentLikes.some(
              (uid) => uid.toString() === profileUserId.toString()
            );

            // Return updated post
            return {
              ...elem,
              like: isCurrentlyLiked
                ? currentLikes.filter((uid) => uid.toString() !== profileUserId.toString())
                : [...currentLikes, profileUserId],
            };
          }

          // Baaki posts jinka ID match nahi hua, unhe as it is return karein
          return elem;
        })
      );
    } catch (error: any) {
      console.error(error.response?.data?.message);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading feed...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">

      {/* Main Content Area */}
      <main className="mx-auto max-w-xl px-4 py-8">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
            <div className="rounded-full bg-slate-800/70 p-4 text-slate-400">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-200">No posts yet</h3>
            <p className="mt-1 text-sm text-slate-400">Be the first to share an update.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map((elem, idx) => (
              <article
                key={elem._id || elem.id || idx}
                className="overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-900/60 shadow-lg shadow-black/40 backdrop-blur-sm transition-all duration-200 hover:border-slate-700/80"
              >
                <div
                  className="flex justify-between items-center px-1"
                >
                  <div className="flex items-center gap-3 p-4"
                    onClick={() => {
                      router.push(`/${elem.author?.username}`)
                    }}
                  >
                    <img
                      src={elem.author?.profilePic || "https://avatar.vercel.sh/user"}
                      alt={elem.author?.fullName || "User profile"}
                      className="h-10 w-10 rounded-full border border-slate-700/80 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-sm font-semibold text-slate-100 hover:underline cursor-pointer">
                        {elem.author?.username}
                      </h2>
                      <p className="truncate text-xs text-slate-400">
                        {elem.author?.fullName}
                      </p>
                    </div>
                  </div>

                  {(elem.author?._id !== profileUserId) && (
                    <div className="flex items-center pr-3">
                      {elem?.author?.isFollowing ? (
                        <button
                          type="button"
                          onClick={() => handleFollow(elem?.author?.username, idx)}
                          className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs font-semibold text-white active:scale-95 transition"
                        >
                          Following
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleFollow(elem?.author?.username, idx)}
                          className="rounded-lg bg-green-800 px-4 py-1.5 text-xs font-semibold text-white active:scale-95 transition"
                        >
                          Follow
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Media Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-black/40">
                  {elem.postType === "image" && elem.media?.[0]?.url && (
                    <img
                      src={elem.media[0].url}
                      alt={elem.caption || "Post content"}
                      className="h-full w-full object-cover"
                    />
                  )}

                  {(elem.postType === "video" || elem.postType === "reel") && elem.media?.[0]?.url && (
                    <video
                      src={elem.media[0].url}
                      controls
                      playsInline
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>

                <div
                  className="px-3 py-2"
                >
                  <button
                    type="button"
                    onClick={() => {
                      handleLike(elem._id || "")
                    }}
                  >
                    {
                      elem.like?.some((uid)=> uid.toString() === profileUserId.toString())
                     ? <Heart fill="red" /> : <Heart />}
                  </button>
                  <p>{elem?.like?.length}</p>
                </div>

                {/* Caption / Footer */}
                {elem.caption && (
                  <div className="p-4 pt-3">
                    <p className="text-sm leading-relaxed text-slate-300">
                      <span className="mr-2 font-semibold text-slate-100">
                        {elem.author?.username}
                      </span>
                      {elem.caption}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
