const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const { randomUUID } = require("crypto");
require("dotenv").config();

const prisma = new PrismaClient();

const CASHFREE_API_BASE = "https://api.cashfree.com/pg/orders"; // Correct endpoint for production
const CASHFREE_HEADERS = {
  "Content-Type": "application/json",
  "x-client-id": process.env.CLIENT_ID,
  "x-client-secret": process.env.CLIENT_SECRET_KEY,
  "x-api-version": "2023-08-01",
};

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET_KEY) {
  console.error("❌ Missing Cashfree API credentials");
  process.exit(1);
}

exports.createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const courseId = Number(req.body.courseId);

    if (!userId || !courseId) {
      return res.status(400).json({ success: false, message: "Missing user or course ID" });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    if (!course.coursePrice || course.coursePrice <= 0) {
      return res.status(400).json({ success: false, message: "Invalid course price" });
    }

    const orderId = `order_${randomUUID().replace(/-/g, "").slice(0, 12)}`;
    await prisma.payment.create({
      data: {
        id: orderId,
        courseId,
        userId,
        amount: course.coursePrice,
        status: "Pending",
        paymentId: randomUUID(),
      },
    });

    const orderPayload = {
      order_id: orderId,
      order_amount: course.coursePrice,
      order_currency: "INR",
      customer_details: {
        customer_id: userId,
        customer_email: req.user?.email || "test@example.com",
        customer_phone: req.user?.phone || "8954779374",
      },
      order_meta: {
        return_url: `https://vidhayala-ai-18.onrender.com/course-progress/${courseId}?order_id=${orderId}`,
        notify_url: "https://vidhayala-ai-18.onrender.com/payment/webhook/cashfree",
      },
    };

    const { data } = await axios.post(CASHFREE_API_BASE, orderPayload, { headers: CASHFREE_HEADERS });

    if (!data.payment_session_id) {
      throw new Error("Missing payment_session_id in Cashfree response");
    }

    return res.status(200).json({
      success: true,
      sessionId: data.payment_session_id,
      orderId,
    });
  } catch (error) {
    console.error("Payment error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Payment initiation failed",
      error: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

exports.cashfreeWebhook = async (req, res) => {
  try {
    const event = req.body;
    if (!event?.data || event.event !== "PAYMENT_SUCCESS") {
      return res.status(400).json({ success: false, message: "Invalid webhook event" });
    }

    const { order_id, order_amount, payment_id } = event.data;
    const purchase = await prisma.payment.findUnique({
      where: { id: order_id },
      include: { course: true },
    });

    if (!purchase) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (purchase.status === "Completed") {
      return res.status(200).json({ success: true, message: "Payment already processed" });
    }

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: order_id },
        data: { status: "Completed", amount: Number(order_amount), paymentId: payment_id },
      }),
      prisma.user.update({
        where: { id: purchase.userId },
        data: { enrolledCourses: { connect: { id: purchase.courseId } } },
      }),
      prisma.course.update({
        where: { id: purchase.courseId },
        data: { enrollStudent: { connect: { id: purchase.userId } } },
      }),
    ]);

    return res.status(200).json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
      error: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};

exports.checkPurchaseStatus = async (req, res) => {
  try {
    const userId = req.id;
    const courseId = Number(req.params.courseId);

    if (!userId || !courseId) {
      return res.status(400).json({ success: false, message: "Invalid user or course ID" });
    }

    const purchase = await prisma.payment.findFirst({
      where: { userId, courseId, status: "Completed" },
    });

    return res.status(200).json({ success: true, isPurchased: !!purchase });
  } catch (error) {
    console.error("Check purchase error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check purchase status",
      error: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
};