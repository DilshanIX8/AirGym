import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ContactInformation from "../components/ContactInformation";

const ContactUs = () => {
  return (
    <section>
      <Navbar />
      <div className="flex min-h-screen w-full items-center justify-center pt-24">
        <ContactInformation />
      </div>
      <Footer />
    </section>
  );
};

export default ContactUs;
