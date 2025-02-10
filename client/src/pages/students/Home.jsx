import CallToAction from "../../components/students/CallToAction";
import Companies from "../../components/students/Companies";
import CoursesSection from "../../components/students/CoursesSection";
import Footer from "../../components/students/Footer";
import Hero from "../../components/students/Hero";
import TestimonialSection from "../../components/students/TestimonialSection";

const Home = () => {
  return (
    <>
      <div className=" flex flex-col items-center space-y-7 text-center">
        <Hero />
        <Companies />
        <CoursesSection />
        <TestimonialSection />
        <CallToAction />
        <Footer />
      </div>
    </>
  );
};

export default Home;
