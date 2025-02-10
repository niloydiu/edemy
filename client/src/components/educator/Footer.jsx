import { assets } from "../../assets/assets";

const EduFooter = () => {
  return (
    <>
      <footer className=" flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 border-t">
        <div className=" flex items-center gap-4">
          <img
            src={assets.ndemy}
            alt="ndemy logo"
            className=" hidden md:block w-20 lg:w-32 cursor-pointer"
          />
          <div className="hidden md:block h-7 w-px bg-gray-500/60"></div>
          <p className=" py-4 text-center text-xs md:text-sm text-gray-500">
            Copyright 2025{" "}
            <span>
              <a href="https://portfolio-nu-ten-59.vercel.app/" target="_blank">
                &copy;niloy
              </a>
            </span>{" "}
            | All rights reserved
          </p>
        </div>
        <div className=" flex items-center gap-3 max-md:mt-4">
          <a
            href="https://www.facebook.com/niloykumarmohonta000"
            target="_blank"
          >
            <img src={assets.facebook_icon} alt="social media" />
          </a>
          <a href="https://x.com/niloykmohonta" target="_blank">
            <img src={assets.twitter_icon} alt="social media" />
          </a>
          <a
            href="https://www.instagram.com/niloykumarmohonta000"
            target="_blank"
          >
            <img src={assets.instagram_icon} alt="social media" />
          </a>
        </div>
      </footer>
    </>
  );
};

export default EduFooter;
