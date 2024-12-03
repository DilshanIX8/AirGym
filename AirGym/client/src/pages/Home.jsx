import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import Feature from "../components/Features";
import FAQ from "../components/FAQ";
import Title from "../components/Title";
import Footer from "../components/Footer";
import HeaderCard from "../components/cards/HeaderCard";
import { features } from "../data/features.json";
import ContactInformation from "../components/ContactInformation";

const Home = () => {
  return (
    <div>
      {/* Header */}
      <Navbar />
      {/* Hero Section */}
      <HeroSection />
      {/* Features */}
      <div className="flex w-full flex-wrap items-center justify-center gap-8 py-10">
        {features.map((feature, index) => (
          <Feature
            className={
              "h-full w-full max-w-sm rounded-lg border border-orange-300 p-4 shadow-xl shadow-orange-500/30 drop-shadow-2xl"
            }
            key={index}
            title={feature.title}
            text={feature.content}
          />
        ))}
      </div>

      {/* About - Title */}
      <Title title="Who We Are?" />
      {/* About - Content */}
      <div className="mb-10 flex justify-center p-8 text-justify">
        <p className="hover:scale-103 max-w-6xl transform rounded-xl border border-orange-200/30 bg-white/5 p-16 text-orange-200 shadow-xl shadow-orange-500/30 drop-shadow-2xl duration-300 hover:shadow-amber-500/30">
          At AirGym, we believe that everyone deserves access to personalized
          fitness training and consistent workout routines, regardless of their
          geographical location. Motivated by the challenges faced by
          individuals in prioritizing their health and fitness amidst busy
          schedules and accessibility barriers, we set out to create a solution
          that bridges the gap between convenience and personalized training.
          Our team of dedicated professionals, including certified personal
          trainers and software developers, has worked tirelessly to create a
          user-friendly platform that empowers individuals to take control of
          their fitness journey. By leveraging web-based technology, we aim to
          provide a convenient and accessible solution for individuals living in
          rural or remote areas to engage in remote body-building and workout
          personal training. AirGym represents a paradigm shift in the fitness
          industry, offering a unique blend of personalized guidance, progress
          analysis, and community engagement. Our innovative features, such as
          the ability to select a coach based on preferences and expertise,
          facilitate seamless communication and interaction between clients and
          coaches through remote consultancy sessions. Join us on our mission to
          revolutionize the fitness industry and empower individuals worldwide
          to prioritize their health and well-being. Together, we can create a
          healthier and more active global community.
        </p>
      </div>

      {/* Header Card */}
      <HeaderCard
        title={
          "To revolutionize the fitness industry and empower individuals worldwide to prioritize their health and well-being."
        }
        text={""}
      />
      {/* FAQ - Title */}
      <Title title="Frequently Asked Questions" />
      {/* FAQ - Content */}
      <div className="flex justify-center py-8">
        <FAQ />
      </div>

      {/* Contact Info */}
      <ContactInformation />
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
