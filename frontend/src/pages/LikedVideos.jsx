import React from "react";
import { useLikedVideos } from "../hooks/like.hook.js";
import { VideoListCard, VideoListCardLoading } from "../components/index.js";
import { Link } from "react-router-dom";

function LikedVideos() {
  const { data: likedVideos = [], isLoading, isFetched } = useLikedVideos(); // Default likedVideos to an empty array

  if (isLoading) {
    return (
      <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <div className="flex flex-col gap-4 p-4">
          {Array(5).fill().map((_, index) => (
            <VideoListCardLoading key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (likedVideos.length === 0 && isFetched) {
    return (
      <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <h1 className="text-3xl font-bold my-2 ml-4">Liked Videos</h1>
        <div className="ml-4 text-2xl">Your Liked Videos will appear here</div>
      </section>
    );
  }

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <h1 className="text-3xl font-bold my-2 ml-4">Liked Videos</h1>

      <div className="flex flex-col gap-4 p-4">
        {likedVideos.map((video, index) => {
          const videoId = video?.likedVideo?._id || index; // Fallback to index if videoId is undefined
          return (
            <Link
              to={`/video/${videoId}`}
              key={videoId} // Use the videoId or index
            >
              <VideoListCard video={video?.likedVideo} />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default LikedVideos;
