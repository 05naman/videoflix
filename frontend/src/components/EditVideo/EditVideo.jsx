import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { SpecialButton, ProgressBar, VideoForm } from "../index.js";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useEditVideo } from "../../hooks/video.hook.js";
import { setShowEditVideo } from "../../store/uiSlice.js";
import { setEditVideo } from "../../store/videoSlice.js";

function EditVideo() {
  const dispatch = useDispatch();
  const video = useSelector((state) => state.video.editVideo);
  const user = useSelector((state) => state.auth.user);
  const [resetStatus, setResetStatus] = useState(false);

  const { mutateAsync: editVideo, isPending } = useEditVideo();

  const onEdit = async (data) => {
    console.log("onEdit called", data);
    const res = await editVideo({ videoId: video?._id, data });
    console.log("Edit result", res);
    if (res) {
      dispatch(setShowEditVideo(false));
      dispatch(setEditVideo(null));
    }
    return res;
  };

  const handleReset = () => {
    if (isPending) {
      toast("Video is still uploading please wait", {
        icon: "⌛",
      });
      return;
    }
    setResetStatus((prev) => !prev);
  };

  const handleClose = () => {
    if (isPending) {
      toast("Video is still uploading please wait", {
        icon: "⌛",
      });
      return;
    }
    dispatch(setShowEditVideo(false));
  };

  return (
    <div
      className="
       mt-16 ml-0 overflow-x-hidden  sm:ml-8 absolute  inset-0 z-10 bg-black/50 px-4 w-full  pb-[80px] pt-4 sm:px-14 sm:py-8"
    >
      {" "}
      <div className="h-full overflow-auto border bg-[#0e0e0e] ">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold">
            {isPending && <span>Uploading your Video...</span>}
            {!isPending && "Edit Video"}
          </h2>
          <div className="flex gap-4 items-center justify-center">
            <SpecialButton onClick={handleReset}> Reset </SpecialButton>
            <button onClick={() => handleClose()}>
              <IoIosCloseCircleOutline className="w-8 h-8" />
            </button>
          </div>
        </div>
        {isPending && <ProgressBar />}
        <VideoForm
          isEditing={true}
          initialVideo={video}
          onSubmit={onEdit}
          user={user}
          isPending={isPending}
          resetStatus={resetStatus}
        />
      </div>
    </div>
  );
}

export default EditVideo;