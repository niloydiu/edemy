import { Outlet } from "react-router-dom";
import EduFooter from "../../components/educator/Footer";
import EduNavbar from "../../components/educator/Navbar";
import EduSidebar from "../../components/educator/Sidebar";

const Educator = () => {
  return (
    <>
      <div className=" text-default min-h-screen bg-white">
        <EduNavbar />
        <div className="flex">
          <EduSidebar />
          <div className=" flex-1">{<Outlet />}</div>
        </div>
        <EduFooter />
      </div>
    </>
  );
};

export default Educator;
