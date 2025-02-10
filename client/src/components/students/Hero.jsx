import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import Searchbar from "./Searchbar";

const Hero = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  // This handler will be called by Searchbar
  const onSearchHandler = (e) => {
    e.preventDefault();
    // Redirect with a URL parameter
    navigate(`/course-list/${input}`);
  };

  return (
    <>
      <div className=" flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70">
        <h1 className=" md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl mx-auto">
          Empower your future with the courses designed to{" "}
          <span className=" text-blue-600">fit your choice.</span>
          <img
            className=" md:block hidden absolute -bottom-7 right-0"
            src={assets.sketch}
            alt="sketch"
          />
        </h1>
        <p className=" md:block hidden text-gray-500 max-w-2xl mx-auto">
          We bring together world-class instructors, interactive content, and a
          supportive community to help you achieve your personal and
          proffessional goals.
        </p>
        <p className=" md:hidden text-gray-500 max-w-sm mx-auto">
          We bring together world-class instructors to help you achieve your
          personal and proffessional goals.
        </p>
        <Searchbar
          input={input}
          setInput={setInput}
          onSearchHandler={onSearchHandler}
        />
      </div>
    </>
  );
};

export default Hero;
