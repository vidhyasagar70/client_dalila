import ContactBanner from "@/components/pages/contactus/Bannersection";
import ContactForm from "@/components/pages/contactus/ContactForm";
import ContactHeroSection from "@/components/pages/contactus/Herosection";
export default function Contact() {
  return (
    <>
      <main className="relative">
        <ContactBanner />
        <ContactHeroSection />
        <ContactForm />
      </main>
    </>
  );
}
