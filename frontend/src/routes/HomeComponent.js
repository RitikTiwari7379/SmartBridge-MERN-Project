import logo from "../../src/logotr.png";
import { Icon } from "@iconify/react";
import TextHover from "../components/shared/TextHover";
import { useState } from "react";
import IconText from "../components/shared/IconText";
import "../index.css";

const focusCardsData = [
  {
    title: "Peaceful Piano",
    description: "peaceful piano music for you and your loved ones",
    imgURL:
      "https://www.rollingstone.com/wp-content/uploads/2018/06/rs-nirvana-e9e22e4b-f7d9-4fc7-bd94-23c30084ce94.jpg",
  },
  {
    title: "Peaceful Piano",
    description: "peaceful piano music for you and your loved ones",
    imgURL:
      "https://www.rollingstone.com/wp-content/uploads/2018/06/rs-nirvana-e9e22e4b-f7d9-4fc7-bd94-23c30084ce94.jpg",
  },
  {
    title: "Peaceful Piano",
    description: "peaceful piano music for you and your loved ones",
    imgURL:
      "https://www.rollingstone.com/wp-content/uploads/2018/06/rs-nirvana-e9e22e4b-f7d9-4fc7-bd94-23c30084ce94.jpg",
  },
  {
    title: "Peaceful Piano",
    description: "peaceful piano music for you and your loved ones",
    imgURL:
      "https://www.rollingstone.com/wp-content/uploads/2018/06/rs-nirvana-e9e22e4b-f7d9-4fc7-bd94-23c30084ce94.jpg",
  },
  {
    title: "Peaceful Piano",
    description: "peaceful piano music for you and your loved ones",
    imgURL:
      "https://www.rollingstone.com/wp-content/uploads/2018/06/rs-nirvana-e9e22e4b-f7d9-4fc7-bd94-23c30084ce94.jpg",
  },
];

const HomeComponent = () => {
  const [user, setUser] = useState();

  return (
    <>
      <div className="h-full w-full bg-coral flex">
        <div className="left-panel">
          <div className="flex flex-col justify-between">
            {/* left panel */}
            <div className="logo w-40">
              <img src={logo} alt="hello" />
            </div>

            <div className="py-2 px-5 ">
              <IconText iconName={"material-symbols:home"} display={"Home"} />
              <IconText
                iconName={"material-symbols:search"}
                display={"Search"}
              />
              <IconText
                iconName={"fluent:library-20-filled"}
                display={" Library"}
              />
            </div>

            <div className="py-10 px-5">
              <IconText
                iconName={"icon-park-solid:add"}
                display={"Create playlist"}
              />
              <IconText
                iconName={"solar:heart-bold-duotone"}
                display={"Liked songs"}
              />
            </div>

            <div className="px-10 py-20 flex py-0">
              <div className="border border-grey-200 text-white rounded-full justify-center font-semibold items-center w-2/5 flex px-2 py-1 cursor-pointer  ">
                <Icon icon="ph:globe-bold" />
                <div className="ml-2 text-sm font-semibold hover:text-grey">
                  English
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-full w-4/5 overflow-auto ">
          <div className="navbar w-full h-24 bg-black  opacity-90 flex items-center justify-end ">
            <div className="w-2/5 flex h-full">
              <div className="flex w-3/5 space-x-5">
                <TextHover display={"Support"}></TextHover>
                <TextHover display={"Download"}></TextHover>
                <TextHover display={"Premium"}></TextHover>
              </div>

              <div className="w-2/5 flex justify-around h-full items-center">
                <TextHover display="Login"></TextHover>
                <div className="bg-white h-1/3 px-8 FONT-SEMIBOLD rounded-full flex CURSOR-POINTER items-center justify-center">
                  LOG IN
                </div>
              </div>
            </div>
          </div>
          <div className=" p-7 pt-0  overflow-auto ">
            <PlaylistView title={"Focus"} cardsData={focusCardsData} />
            <PlaylistView
              title={"Sounds of India"}
              cardsData={focusCardsData}
            />
            <PlaylistView title={"Your Mix"} cardsData={focusCardsData} />
          </div>
        </div>
      </div>
    </>
  );
};

const PlaylistView = ({ title, cardsData }) => {
  return (
    <>
      <div className="text-white mt-8">
        <div className="text-2xl font-bold px-1 mb-5">{title}</div>
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
      </div>
    </>
  );
};

const Card = ({ title, description, imgURL }) => {
  return (
    <>
      <div className=" cursor-pointer bg-app-black rounded-lg w-1/6 p-4 ">
        <Icon icon=" carbon:play-filled" className="hover" />

        <div className="py-4">
          <img className=" w-full rounded-md" src={imgURL} />
        </div>
        <div className="text-white text-sm font-semibold py-3">{title}</div>
        <div className="text-gray-500 text-sm">{description}</div>
      </div>
    </>
  );
};

export default HomeComponent;
