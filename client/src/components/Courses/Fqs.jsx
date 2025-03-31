import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const faqs = [
  {
    question: "What courses do you offer?",
    answer:
      "We offer a variety of courses in web development, design, data science, and more. Our courses are designed by industry experts to provide hands-on learning.",
  },
  {
    question: "Do you provide certificates?",
    answer:
      "Yes, upon successful completion of a course, you will receive a certificate that you can showcase on your resume and LinkedIn.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept credit/debit cards, PayPal, UPI, and other secure payment options. All transactions are encrypted for your security.",
  },
  {
    question: "Can I get a refund if I am not satisfied?",
    answer:
      "Yes, we offer a 7-day money-back guarantee if you are not satisfied with the course. No questions asked!",
  },
  {
    question: "Do I get lifetime access to the courses?",
    answer:
      "Yes, once you purchase a course, you will have lifetime access to all the content, including future updates.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="text-white">
      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center mb-6 md:text-7xl">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-lg p-4 shadow-md">
              <button
                className="flex justify-between items-center w-full h-6 text-left text-lg font-medium bg-gradient-to-r from-gray-900 via-[#09090B] to-black"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                {openIndex === index ? <ChevronUp /> : <ChevronDown />}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <footer className=" text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold">About Us</h3>
            <p className="mt-2 text-sm text-gray-400">
              We provide high-quality courses designed by industry experts to
              help you upskill and advance your career.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">Courses</a></li>
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="hover:text-white"><Facebook size={20} /></a>
              <a href="#" className="hover:text-white"><Twitter size={20} /></a>
              <a href="#" className="hover:text-white"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-500 border-t border-gray-700 py-4">
          &copy; {new Date().getFullYear()} YourCompany. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
