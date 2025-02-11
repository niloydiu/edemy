import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Footer from "../../components/students/Footer";
import { AppContext } from "../../context/AddContext";

const MyEnrollments = () => {
  const {
    enrolledCourses,
    calculateCourseDuration,
    navigate,
    backendUrl,
    userData,
    calculateNoOfCourse,
    getToken,
    fetchUserEnrolledCourse,
  } = useContext(AppContext);
  const [progressArray, setProgressArray] = useState([]);
  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          let totalLectures = calculateNoOfCourse(course);
          const lectureCompleted = data.progressData
            ? data.progressData.lectureCompleted.length
            : 0;
          return { totalLectures, lectureCompleted };
        })
      );
      setProgressArray(tempProgressArray);
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourse();
    }
  }, [userData]);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress();
    }
  }, [enrolledCourses]);

  return (
    <>
      <div className="md:px-36 px-8 pt-10">
        <h1 className="text-2xl font-semibold">My Enrollments</h1>
        <table className="md:table-auto table-fixed w-full overflow-hidden mt-10">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
            <tr>
              <th className="px-4 py-3 font-semibold truncate border-b">
                Course
              </th>
              <th className="px-4 py-3 font-semibold truncate border-b">
                Duration
              </th>
              <th className="px-4 py-3 font-semibold truncate border-b">
                Completed
              </th>
              <th className="px-4 py-3 font-semibold truncate border-b">
                Status
              </th>
            </tr>
          </thead>
          <tbody className=" text-gray-700">
            {enrolledCourses.map((course, index) => (
              <tr key={index} className=" border-b border-gray-500/20">
                <td className=" md:px-4 pl-2 md:pl-4 py-4 flex items-center space-x-3">
                  <img
                    src={course.courseThumbnail}
                    alt="courseThumbnail"
                    className=" w-14 sm:w-24 md:w-28"
                  />
                  <div className="flex-1">
                    <p className=" mb-1 max-sm:text-sm">{course.courseTitle}</p>
                    <div
                      className={`w-full bg-gray-300 relative rounded-full h-2`}
                    >
                      <div
                        style={{
                          width: `${
                            progressArray[index]
                              ? (progressArray[index].lectureCompleted * 100) /
                                progressArray[index].totalLectures
                              : 0
                          }%`,
                        }}
                        className={`h-full absolute rounded-full ${
                          progressArray[index] &&
                          (progressArray[index].lectureCompleted * 100) /
                            progressArray[index].totalLectures ===
                            100
                            ? "bg-green-600"
                            : "bg-blue-400"
                        }`}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className=" px-4 py-3 max-sm:hidden">
                  {calculateCourseDuration(course)}
                </td>
                <td className="px-4 py-3 max-sm:hidden">
                  {progressArray[index] &&
                    `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures}`}
                  <span>Lectures</span>
                </td>
                <td className="px-4 py-3 max-sm:text-right">
                  <button
                    onClick={() => navigate("/player/" + course._id)}
                    className={`px-3 sm:px-5 py-1.5 sm:py-2  max-sm:text-xs text-white rounded ${
                      progressArray[index] &&
                      progressArray[index].lectureCompleted /
                        progressArray[index].totalLectures ===
                        1
                        ? "bg-green-600"
                        : "bg-blue-600"
                    }`}
                  >
                    {progressArray[index] &&
                    progressArray[index].lectureCompleted /
                      progressArray[index].totalLectures ===
                      1
                      ? "Completed"
                      : "On going"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default MyEnrollments;
