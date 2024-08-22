import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
const App = lazy(() => import("./App.jsx"));
import {SpinnerLoading } from "./components/index.js";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Signup = lazy(() => import("./pages/Signup.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const VideoDetail = lazy(() => import("./pages/VideoDetail.jsx"));
const LikedVideos = lazy(() => import("./pages/LikedVideos.jsx"));
const MyChannel = lazy(() => import("./pages/MyChannel.jsx"));
const MyStudio = lazy(() => import("./pages/MyStudio.jsx"));
const Subscriptions = lazy(() => import("./pages/Subscriptions.jsx"));
const History = lazy(() => import("./pages/History.jsx"));
const ChannelPlaylist = lazy(() =>
  import("./pages/Channel/ChannelPlaylist.jsx")
);
const ChannelSubscribers = lazy(() =>
  import("./pages/Channel/ChannelSubscribers.jsx")
);
const ChannelVideos = lazy(() => import("./pages/Channel/ChannelVideos.jsx"));
const ChannelTweets = lazy(() => import("./pages/Channel/ChannelTweets.jsx"));
const ChannelAbout = lazy(() => import("./pages/Channel/ChannelAbout.jsx"));
const PersonalInformation = lazy(() =>
  import("./pages/Edit/PersonalInformation.jsx")
);
const ChangePassword = lazy(() =>
  import("./pages/Edit/ChangePassword.jsx")
);
const EditProfile = lazy(() => import("./pages/EditProfile.jsx"));
const ChannelInformation = lazy(() =>
  import("./pages/Edit/ChannelInformation.jsx")
);
const Support = lazy(() => import("./pages/Support.jsx"));
const Playlist = lazy(() => import("./pages/Playlist.jsx"));
const Search = lazy(() => import("./pages/Search.jsx"));
const Tweets = lazy(() => import("./pages/Tweets.jsx"));

import AuthLayout from "./components/AuthLayout.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

if (import.meta.env.MODE === "development") disableReactDevTools();

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<SpinnerLoading />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: (
          <AuthLayout auth={false}>
            <Suspense fallback={<SpinnerLoading />}>
              <Home />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/video/:videoId",
        element: (
          <AuthLayout auth={false}>
            <Suspense fallback={<SpinnerLoading />}>
              <VideoDetail />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/liked-videos",
        element: (
          <AuthLayout auth={true} pageName={"LikedVideos"}>
            <Suspense fallback={<SpinnerLoading />}>
              <LikedVideos />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/history",
        element: (
          <AuthLayout auth={true} pageName={"History"}>
            <Suspense fallback={<SpinnerLoading />}>
              <History />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/channel/:username",
        element: (
          <AuthLayout auth pageName={"MyChannel"}>
            <Suspense fallback={<SpinnerLoading />}>
              <MyChannel />
            </Suspense>
          </AuthLayout>
        ),
        children: [
          {
            path: "videos",
            element: (
              <AuthLayout auth>
                <Suspense fallback={<SpinnerLoading />}>
                  <ChannelVideos />
                </Suspense>
              </AuthLayout>
            ),
          },
          {
            path: "tweets",
            element: (
              <AuthLayout auth >
                <Suspense fallback={<SpinnerLoading />}>
                  <ChannelTweets />
                </Suspense>
              </AuthLayout>
            ),
          },
          {
            path: "playlist",
            element: (
              <AuthLayout auth>
                <Suspense fallback={<SpinnerLoading />}>
                  <ChannelPlaylist />
                </Suspense>
              </AuthLayout>
            ),
          },
          {
            path: "subscribers",
            element: (
              <AuthLayout auth>
                <Suspense fallback={<SpinnerLoading />}>
                  <ChannelSubscribers />
                </Suspense>
              </AuthLayout>
            ),
          },
          {
            path: "about",
            element: (
              <AuthLayout auth>
                <Suspense fallback={<SpinnerLoading />}>
                  <ChannelAbout />
                </Suspense>
              </AuthLayout>
            ),
          },
        ],
      },
      {
        path: "/my-studio",
        element: (
          <AuthLayout auth pageName={"MyStudio"}>
            <Suspense fallback={<SpinnerLoading />}>
              <MyStudio />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/subscriptions",
        element: (
          <AuthLayout auth pageName={"Subscriptions"}>
            <Suspense fallback={<SpinnerLoading />}>
              <Subscriptions />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/edit-profile",
        element: (
          <AuthLayout auth pageName={"Settings"}>
            <Suspense fallback={<SpinnerLoading />}>
              <EditProfile />
            </Suspense>
          </AuthLayout>
        ),
        children: [
          {
            path: "change-password",
            element: (
              <AuthLayout auth>
                <Suspense fallback={<SpinnerLoading />}>
                  <ChangePassword />
                </Suspense>
              </AuthLayout>
            ),
          },
          {
            path: "channel-info",
            element: (
              <AuthLayout auth>
                <Suspense fallback={<SpinnerLoading />}>
                  <ChannelInformation />
                </Suspense>
              </AuthLayout>
            ),
          },
          {
            path: "personal-info",
            element: (
              <AuthLayout auth>
                <Suspense fallback={<SpinnerLoading />}>
                  <PersonalInformation />
                </Suspense>
              </AuthLayout>
            ),
          },
        ],
      },
      {
        path: "/playlist/:playlistId",
        element: (
          <AuthLayout auth>
            <Suspense fallback={<SpinnerLoading />}>
              <Playlist />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/support",
        element: (
          <AuthLayout auth={false}>
            <Suspense fallback={<SpinnerLoading />}>
              <Support />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/search/:query",
        element: (
          <AuthLayout auth={false}>
            <Suspense fallback={<SpinnerLoading />}>
              <Search />
            </Suspense>
          </AuthLayout>
        ),
      },
      {
        path: "/tweets",
        element: (
          <AuthLayout auth pageName={"Tweets"}>
            <Suspense fallback={<SpinnerLoading />}>
              <Tweets />
            </Suspense>
          </AuthLayout>
        ),
      },
    ],
  },
  {
    path: "/signup",
    element: (
      <AuthLayout auth={false}>
        <Suspense fallback={<SpinnerLoading />}>
          <Signup />
        </Suspense>
      </AuthLayout>
    ),
  },
  {
    path: "/login",
    element: (
      <AuthLayout auth={false}>
        <Suspense fallback={<SpinnerLoading />}>
          <Login />
        </Suspense>
      </AuthLayout>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
    {import.meta.env.MODE === "development" && (
      <ReactQueryDevtools initialIsOpen={false} />
    )}
    <Toaster
      position="bottom-right"
      reverseOrder={true}
      toastOptions={{
        error: {
          style: { borderRadius: "0", color: "red" },
        },
        success: {
          style: { borderRadius: "0", color: "green" },
        },
        duration: 2000,
      }}
    />
  </QueryClientProvider>
   </React.StrictMode>
);