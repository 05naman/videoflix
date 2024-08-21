import React, { useEffect } from "react";
import { useVideos } from "../hooks/video.hook";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { VideoCard, VideoCardLoading } from "../components/index.js";

function Home() {
  const { data, fetchNextPage, isFetched, isFetching } = useVideos();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isFetching) {
    return (
      <section className="w-full bg-[#0e0e0e] pb-16 sm:pb-0">
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
          {Array(8)
            .fill()
            .map((_, index) => (
              <VideoCardLoading key={index} className="bg-gray-700 rounded-lg h-60" />
            ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#0e0e0e] pb-16 sm:pb-0">
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">
        {isFetched &&
          data?.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page.docs.map((video) => (
                <Link to={`/video/${video._id}`} key={video._id}>
                  <VideoCard video={video} />
                </Link>
              ))}
            </React.Fragment>
          ))}
        <div ref={ref} className="h-1"></div>
      </div>
    </section>
  );
}
export default Home;
