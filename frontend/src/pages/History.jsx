import React, { useState } from "react";
import { useClearWatchHistory, useWatchHistory } from "../hooks/user.hook";
import { VideoListCard, VideoListCardLoading } from "../components/index";
import { Link } from "react-router-dom";
import { BiSearch } from "react-icons/bi";

function History() {
  const { data: watchHistory, isLoading, error } = useWatchHistory();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = React.useMemo(
    () =>
      watchHistory?.filter((video) =>
        video.video.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [watchHistory, searchTerm]
  );

  const { mutateAsync: clearUserWatchHistory } = useClearWatchHistory();
  const clearWatchHistory = async () => {
    try {
      await clearUserWatchHistory();
    } catch (err) {
      console.error("Failed to clear watch history:", err);
    }
  };

  if (isLoading) {
    return (
      <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <div className="flex flex-col gap-4 p-4">
          {Array(5)
            .fill()
            .map((_, index) => (
              <VideoListCardLoading key={index} />
            ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
        <p className="text-red-500 p-4">Failed to load watch history. Please try again later.</p>
      </section>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <section className="w-3/4 pr-4">
        <h1 className="text-3xl font-bold my-2 ml-4">History</h1>

        <div className="flex flex-col gap-4 p-4">
          {filteredHistory &&
            filteredHistory.map((video) => (
              <Link to={`/video/${video?.video?._id}`} key={video?.video?._id}>
                <VideoListCard video={video.video} />
              </Link>
            ))}
        </div>
      </section>

      <aside className="w-full sm:w-1/4 p-4">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search history"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 text-white border border-blue-500 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Search history"
          />
          <BiSearch className="absolute h-6 w-6 left-3 top-2.5 text-blue-400" aria-hidden="true" />
        </div>

        <button
          onClick={clearWatchHistory}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          aria-label="Clear Watch History"
        >
          Clear Watch History
        </button>
      </aside>
    </div>
  );
}

export default History;
