const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const { randomUUID } = require("crypto");
require("dotenv").config();

const prisma = new PrismaClient();

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const CASHFREE_API_BASE = IS_PRODUCTION
  ? "https://api.cashfree.com/pg/orders"
  : "https://sandbox.cashfree.com/pg/orders";

const CASHFREE_HEADERS = {
  "Content-Type": "application/json",
  "x-client-id": process.env.CLIENT_ID,
  "x-client-secret": process.env.CLIENT_SECRET_KEY,
  "x-api-version": "2023-08-01",
};

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET_KEY) {
  console.error("❌ Missing Cashfree API credentials. Check .env file.");
  process.exit(1);
}

exports.createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const courseId = Number(req.body.courseId);

    if (!courseId) return res.status(400).json({ message: "Invalid course ID" });

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(404).json({ message: "Course not found!" });

    if (!course.coursePrice || course.coursePrice <= 0) {
      return res.status(400).json({ message: "Invalid course price" });
    }

    const orderId = randomUUID().replace(/-/g, "").slice(0, 12);

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
        notify_url: "https://vidhayala-ai-18.onrender.com/webhook/cashfree",
      },
    };

    console.log("✅ Sending Order Payload:", orderPayload);

    const { data } = await axios.post(CASHFREE_API_BASE, orderPayload, { headers: CASHFREE_HEADERS });

    console.log("✅ Cashfree Response:", data);

    if (!data.payment_session_id) {
      return res.status(500).json({ message: "Failed to get payment session ID", details: data });
    }

    return res.status(200).json({ success: true, sessionId: data.payment_session_id, orderId });
  } catch (error) {
    console.error("❌ Payment error:", error?.response?.data || error.message);
    res.status(500).json({ message: "Payment initiation failed. Please try again." });
  }
};

exports.cashfreeWebhook = async (req, res) => {
  console.log("🔹 Webhook triggered - Raw body:", JSON.stringify(req.body, null, 2));

  try {
    const event = req.body;
    if (!event || event.event !== "PAYMENT_SUCCESS") {
      return res.status(400).send("Invalid event");
    }

    const { order_id, order_amount } = event.data || {};
    if (!order_id || !order_amount) {
      return res.status(400).send("Invalid payload");
    }

    console.log(`🔹 Processing order_id: ${order_id} with amount: ${order_amount}`);

    const purchase = await prisma.payment.findUnique({ where: { id: order_id } });
    if (!purchase || purchase.status === "Completed") {
      return res.status(200).send("Payment already processed");
    }

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({ where: { id: order_id }, data: { status: "Completed", amount: parseInt(order_amount, 10) } });
      await tx.user.update({ where: { id: purchase.userId }, data: { enrolledCourses: { connect: { id: purchase.courseId } } } });
      await tx.course.update({ where: { id: purchase.courseId }, data: { enrollStudent: { connect: { id: purchase.userId } } } });
    });

    console.log("✅ Payment successfully processed:", JSON.stringify(event, null, 2));
    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("❌ Webhook processing error:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.checkPurchaseStatus = async (req, res) => {
  try {
    const userId = req.id || "test-user-id";
    const courseId = Number(req.params.courseId);

    const purchase = await prisma.payment.findFirst({ where: { userId, courseId, status: "Completed" } });
    res.status(200).json({ isPurchased: !!purchase });
  } catch (error) {
    console.error("❌ Error checking purchase status:", error);
    res.status(500).json({ message: "Failed to check purchase status" });
  }
};
