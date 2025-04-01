import { useGetCourseDetailByIdQuery } from "@/features/api/courseApi";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaLock, FaUser, FaClock } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { load } from "@cashfreepayments/cashfree-js";
import axios from "axios";
import Confetti from "react-confetti";
import Loadering from "@/components/Courses/Loader";

const CourseDetail = () => {
  const [orderId, setOrderId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cashfree, setCashfree] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { data: courseDetail, isLoading, isSuccess } = useGetCourseDetailByIdQuery(id);

  useEffect(() => {
    let mounted = true;
    const initializeSDK = async () => {
      try {
        const sdk = await load({ mode: "production" }); // Change to production
        if (mounted) setCashfree(sdk);
      } catch (error) {
        console.error("Failed to initialize Cashfree SDK:", error);
        if (mounted) setError("Payment system initialization failed");
      }
    };
    initializeSDK();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    const checkPurchaseStatus = async () => {
      try {
        const response = await axios.get(`https://vidhayala-ai-18.onrender.com/payment/status/${id}`, {
          withCredentials: true,
        });
        if (mounted && response.data.success && response.data.isPurchased) {
          setIsPurchased(true);
          navigate(`/course-progress/${id}`);
        }
      } catch (error) {
        console.error("Error checking purchase status:", error);
        if (mounted) setError("Failed to verify purchase status");
      }
    };
    checkPurchaseStatus();
    return () => { mounted = false; };
  }, [id, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!cashfree) {
      setError("Payment system not ready");
      return;
    }
    setIsProcessing(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://vidhayala-ai-18.onrender.com/payment/checkout",
        { courseId: id },
        { withCredentials: true }
      );

      if (response.data.success && response.data.sessionId) {
        setOrderId(response.data.orderId);
        await cashfree.checkout({
          paymentSessionId: response.data.sessionId,
          redirectTarget: "_modal",
        });
        setPaymentSuccess(true);
        setTimeout(() => navigate(`/course-progress/${id}`), 3000);
      } else {
        throw new Error("Payment initiation failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.response?.data?.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <Loadering />;
  if (!isSuccess || !courseDetail?.courses) {
    return <div className="min-h-screen flex justify-center items-center text-white">Course not found</div>;
  }

  const course = courseDetail.courses;

  return (
    <>
      {paymentSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Confetti width={window.innerWidth} height={window.innerHeight} />
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
            <p className="text-gray-700 mt-2">Congratulations! You've enrolled in the course.</p>
            <p className="text-gray-500 mt-2">Redirecting...</p>
          </div>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen w-full pt-20 bg-gradient-to-r from-gray-900 via-[#09090B] to-black text-white p-6"
      >
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          <motion.img
            src={course.courseThumbnail}
            alt={course.coursetitle}
            className="w-full lg:w-2/5 rounded-xl shadow-lg object-cover"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <div className="flex-1">
            <motion.h1 className="text-3xl font-bold mb-2">{course.coursetitle}</motion.h1>
            <p className="text-gray-400 mb-3">{course.coursesubtitle}</p>
            <p className="text-gray-300">{course.coursedescription}</p>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <div className="mt-4 flex flex-wrap gap-4">
              <span className="bg-blue-500 px-3 py-1 rounded-full text-sm">{course.category}</span>
              <span className="bg-green-500 px-3 py-1 rounded-full text-sm">{course.courseLevel}</span>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <span className="text-red-400 line-through text-lg font-medium">₹{course.coursePrice}</span>
              <span className="text-white text-2xl font-extrabold">₹{course.discountedPrice || course.coursePrice}</span>
            </div>
            <motion.button
              onClick={handlePayment}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full flex items-center gap-2 text-white font-semibold shadow-md transition-all"
              disabled={isProcessing || isPurchased}
            >
              <MdOutlinePayment size={20} />
              {isProcessing ? "Processing..." : "Enroll Now"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CourseDetail;