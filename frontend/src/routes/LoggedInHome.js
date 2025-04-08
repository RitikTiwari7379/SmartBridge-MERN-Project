import "../index.css";
import LoggedInContainer from "../containers/LoggedInContainer";
import { createContext } from "react";
import { Icon } from "@iconify/react";
import React, { useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
export const ThemeContext = createContext(null);

const focusCardsData = [
  {
    title: "John Mayer ",
    description: "Continuum",
    imgURL:
      "https://upload.wikimedia.org/wikipedia/commons/0/0e/Continuum_by_John_Mayer_%282006%29.jpg",
  },
  {
    title: "Justin Bieber ",
    description: "Purpose",
    imgURL: "https://i.scdn.co/image/ab67616d0000b273f46b9d202509a8f7384b90de",
  },
  {
    title: "Beyonce ",
    description: "Lemonade",
    imgURL: "https://pbs.twimg.com/media/Cgxa_INW4AAGBxz.jpg:large",
  },
  {
    title: "Taylor Swift ",
    description: "RED",
    imgURL:
      "https://upload.wikimedia.org/wikipedia/en/e/e8/Taylor_Swift_-_Red.png",
  },
  {
    title: "Ariana Grande ",
    description: "Sweetner",
    imgURL: "https://i.scdn.co/image/ab67616d0000b273c3af0c2355c24ed7023cd394",
  },
];

const SoundsOfIndia = [
  {
    title: "Hindi ",
    description: "Arjit Singh, Pritam..",
    imgURL:
      "https://wp.missmalini.com/wp-content/uploads/2015/12/bestsongs.jpg",
    onClick: "/MyMusic",
  },
  {
    title: "Punjabi",
    description: "Diljeet Dosanjh, Shubh..",
    imgURL:
      "https://assets.vogue.in/photos/5cf8e52fe3949d8c7b1b04ed/1:1/w_1000,h_1000,c_limit/Diljit%20Dosanjh.jpg",
  },
  {
    title: "Haryanvi ",
    description: "Gulzar Channiwala, Sumit Goswami...",
    imgURL:
      "https://c.saavncdn.com/357/Yadav-Brand-2-Haryanvi-2022-20230917195045-500x500.jpg",
  },
  {
    title: "Garhwali ",
    description: "Chander Singh Rahi, Basanti Devi Bisht...",
    imgURL:
      "https://www.sahapedia.org/sites/default/files/styles/sp_page_banner_800x800/public/Bagadwal%201.jpg?itok=Yk1hk8sE",
  },
  {
    title: "Malayalam ",
    description: "Sushin Shyam, Sujatha...",
    imgURL:
      "https://www.sahapedia.org/sites/default/files/styles/sp_page_banner_800x800/public/Bagadwal%201.jpg?itok=Yk1hk8sE",
  },
];

const LoggedInHome = () => {
  const [theme, setTheme] = useState("light"); // "light" or "dark"
  const toggleTheme = () =>
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  return (
    <ThemeContext.Provider value={theme}>
      <LoggedInContainer curActiveScreen={"home"} toggleTheme={toggleTheme}>
        <div
          className={`bg-${
            theme === "light" ? "white" : "black"
          }  content p-7 pt-0  overflow-auto`}
        >
          <div className="p-8 rounded  ">
            <div className="bg-img2  rounded-lg flex flex-col justify-center items-center ">
              <div className="flex flex-col justify-center items-center">
                <h1 className="font-black text-white text-border-black text-7xl flex flex-col justify-center items-center">
                Your Pathway to
                </h1>
                <h1 className="font-bold p-4	text-white text-6xl justify-center items-center">
                Perfect Playlists
                </h1>
              </div>
            </div>
          </div>

          <PlaylistView
            title={"Focus"}
            cardsData={focusCardsData}
            onClick={"/MyMusic"}
          />
          <PlaylistView title={"Sounds of India"} cardsData={SoundsOfIndia} />
          <PlaylistView title={"Your "} cardsData={focusCardsData} />
        </div>
      </LoggedInContainer>
    </ThemeContext.Provider>
  );
};

const PlaylistView = ({ title, cardsData }) => {
  const theme = useContext(ThemeContext);
  return (
    <>
      <div
        className={`text-${
          theme === "light" ? "app-black" : "white"
        } mt-8 text-2xl font-semibold px-1 mb-5`}
      >
        {title}
      </div>

      <div className="w-full flex justify-between space-x-4 ">
        {cardsData.map((item) => {
          return (
            <Card
              title={item.title}
              description={item.description}
              imgURL={item.imgURL}
            />
          );
        })}
      </div>
    </>
  );
};

const Card = ({ title, description, imgURL, onClick }) => {
  const theme = useContext(ThemeContext);
  const navigate = useNavigate(); // Get the history object from react-router-dom

  const handleCardClick = () => {
    // Call the provided onClick function if available
    if (onClick) {
      onClick();
    }

    navigate("/HomeCard");
  };

  return (
    <>
      <div
        className={`cursor-pointer bg-${
          theme === "light" ? "app-black" : "gray-200 "
        } hover:opacity-90 rounded-lg w-1/6 p-4`}
        onClick={handleCardClick}
      >
        <img className="  py-2 w-full rounded-md" src={imgURL} />
        <div className="flex flex-col items-right">
          <Icon icon="icon-park-solid:play" color="coral" fontSize={50} />

          <div
            className={`text-${
              theme === "light" ? "white" : "app-black"
            }  text-lg font-semibold py-2`}
          >
            {title}
          </div>
          <div
            className={`text-${
              theme === "light" ? "white" : "app-black"
            }  text-sm`}
          >
            {description}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoggedInHome;
