import React from "react";
import { timeDuration, timeAgo } from "../assets/timeAgo";

function Videocard({ video }) {
  
  return (
    <div className="w-full">
      <div className="relative mb-2 w-full pt-[56%]">
        <div className="absolute inset-0">
          {video?.thumbnail?.url ? (
            <img
              src={video?.thumbnail?.url}
              alt={video?.title || "Video Thumbnail"}
              className="h-full w-full object-cover rounded-xl"
            />
          ) : (
            <div className="h-full w-full bg-gray-300 rounded-xl flex items-center justify-center">
              <span className="text-gray-600">No Thumbnail</span>
            </div>
          )}
        </div>
        <span className="absolute bottom-1 right-1 inline-block rounded bg-black px-1.5 text-sm">
          {video ? timeDuration(video?.duration) : "0:00"}
        </span>
      </div>
      <div className="flex gap-x-2">
        <div className="h-10 w-10 shrink-0">
          {video?.ownerDetails?.avatar ? (
            <img
              src={video?.ownerDetails?.avatar}
              alt={video?.ownerDetails?.username || "Owner Avatar"}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600">No Avatar</span>
            </div>
          )}
        </div>
        <div className="w-full">
          <h6 className="mb-1 font-semibold">{video?.title || "No Title"}</h6>
          <span className="flex text-sm text-gray-200">
            {video?.views || "0"} Views · {timeAgo(video?.createdAt) || "Just now"}
          </span>
          <p className="text-sm text-gray-200">
            {video?.ownerDetails?.username || "Unknown User"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Videocard;
