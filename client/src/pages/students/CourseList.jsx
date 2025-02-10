import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import CourseCard from "../../components/students/CourseCard";
import Footer from "../../components/students/Footer";
import Searchbar from "../../components/students/Searchbar";
import { AppContext } from "../../context/AddContext";

// const CourseList = () => {
//   const { allCourses } = useContext(AppContext);
//   const [input, setInput] = useState("");
//   const [filteredCourse, setFilteredCourse] = useState(allCourses);
//   const navigate = useNavigate();

//   const onSearchHandler = (e) => {
//     e.preventDefault();
//     const tempCourses = allCourses.filter((course) =>
//       course.courseTitle.toLowerCase().includes(input.toLowerCase())
//     );
//     setFilteredCourse(tempCourses);
//     navigate("/course-list?search=" + input);
//   };

//   useEffect(() => {
//     setFilteredCourse(allCourses);
//   }, [allCourses]);
//   const resetInput = () => {
//     setInput("");
//     setFilteredCourse(allCourses);
//     navigate("/course-list");
//   };

import { useParams } from "react-router-dom";

const CourseList = () => {
  const { allCourses } = useContext(AppContext);
  const { input: urlInput } = useParams(); // Get the URL parameter
  const [input, setInput] = useState(urlInput || ""); // Initialize input with URL parameter
  const [filteredCourse, setFilteredCourse] = useState(allCourses);
  const navigate = useNavigate();

  // Update filtered courses when URL parameter or allCourses changes
  useEffect(() => {
    if (urlInput) {
      const tempCourses = allCourses.filter((course) =>
        course.courseTitle.toLowerCase().includes(urlInput.toLowerCase())
      );
      setFilteredCourse(tempCourses);
    } else {
      setFilteredCourse(allCourses);
    }
  }, [urlInput, allCourses]);

  // Update the search handler to use URL parameters
  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate(`/course-list/${input}`);
  };

  // Reset input and URL parameter
  const resetInput = () => {
    setInput("");
    navigate("/course-list");
  };
  return (
    <>
      <div className="relative md:px-36 px-8 pt-20 text-left">
        <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">
              Course List
            </h1>
            <p className="text-gray-500">
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Home
              </span>{" "}
              / <span>Course List</span>
            </p>
          </div>
          <Searchbar
            input={input}
            setInput={setInput}
            onSearchHandler={onSearchHandler}
          />
        </div>
        {input && (
          <div className=" inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600">
            <p>{input}</p>
            <img
              src={assets.cross_icon}
              alt="cross_icon"
              className=" cursor-pointer"
              onClick={resetInput}
            />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0">
          {filteredCourse.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseList;
