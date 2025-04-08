import "./output.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginComponent from "./routes/LoginComponent";
import SignupComponent from "./routes/SignUpComponent";
import HomeComponent from "./routes/HomeComponent";
import LoggedInHome from "./routes/LoggedInHome";
import UploadSong from "./routes/UploadSong";
import MyMusic from "./routes/MyMusic";
import SearchPage from "./routes/SearchPage";
import Library from "./routes/Library";
import SinglePlaylistView from "./routes/SinglePlaylistView";
import LikedSongView from "./routes/LikedSongView";
import { useCookies } from "react-cookie";
import songContext from "./contexts/songContext";
import { createContext } from "react";
import LikedSong from "./routes/LikedSong";
import HomeCard from "./routes/HomeCard";

export const ThemeContext = createContext(null);

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [soundPlayed, setSoundPlayed] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [cookie] = useCookies(["token"]);

  return (
    <div className="w-screen h-screen font-poppins">
      <BrowserRouter>
        {cookie.token ? (
          // logged in routes
          <songContext.Provider
            value={{
              currentSong,
              setCurrentSong,
              soundPlayed,
              setSoundPlayed,
              isPaused,
              setIsPaused,
            }}
          >
            <Routes>
              <Route path="/LoggedInHome" element={<LoggedInHome />} />
              {/* <Route path="/Home" element={<HomeComponent />} /> */}
              <Route path="/uploadSong" element={<UploadSong />} />
              <Route path="/myMusic" element={<MyMusic />} />
              <Route path="/homeCard" element={<HomeCard />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/library" element={<Library />} />
              <Route
                path="/playlist/:playlistId"
                element={<SinglePlaylistView />}
              />

              <Route path="/Liked" element={<LikedSongView />} />

              <Route path="*" element={<Navigate to="/LoggedInHome" />} />
            </Routes>
          </songContext.Provider>
        ) : (
          // logged out routes
          <Routes>
            <Route path="/home" element={<HomeComponent />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/signup" element={<SignupComponent />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
