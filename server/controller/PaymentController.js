const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const { randomUUID } = require("crypto");
require("dotenv").config();

const prisma = new PrismaClient();

const CASHFREE_API_BASE = "https://api.cashfree.com/pg/orders"; // Corrected endpoint for production

const CASHFREE_HEADERS = {
  "Content-Type": "application/json",
  "x-client-id": process.env.CLIENT_ID,
  "x-client-secret": process.env.CLIENT_SECRET_KEY,
  "x-api-version": "2023-08-01",
};

// Ensure environment variables exist
if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET_KEY) {
  console.error("❌ Missing Cashfree API credentials. Check .env file.");
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
    if (!course) return res.status(404).json({ success: false, message: "Course not found!" });

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

    console.log("✅ Sending Order Payload to Cashfree:", {
      url: CASHFREE_API_BASE,
      payload: orderPayload,
      headers: CASHFREE_HEADERS,
    });

    const { data } = await axios.post(CASHFREE_API_BASE, orderPayload, { headers: CASHFREE_HEADERS });

    console.log("✅ Cashfree Response:", data);

    if (!data.payment_session_id) {
      console.error("❌ Missing Payment Session ID in Response:", data);
      return res.status(500).json({
        success: false,
        message: "Failed to get payment session ID",
        details: data,
      });
    }

    return res.status(200).json({
      success: true,
      sessionId: data.payment_session_id,
      orderId: orderId,
    });
  } catch (error) {
    console.error("❌ Payment Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return res.status(500).json({
      success: false,
      message: "Payment initiation failed in production. Please try again.",
      error: error.message,
      details: error.response?.data,
    });
  } finally {
    await prisma.$disconnect();
  }
};

exports.cashfreeWebhook = async (req, res) => {
  console.log("Webhook triggered - Raw body:", JSON.stringify(req.body, null, 2));

  try {
    const event = req.body;

    if (!event || event.event !== "PAYMENT_SUCCESS") {
      console.log("Invalid event received:", JSON.stringify(event, null, 2));
      return res.status(400).send("Invalid event");
    }

    const { order_id, order_amount, payment_id } = event.data;
    console.log("Processing order_id:", order_id, "with amount:", order_amount, "payment_id:", payment_id);

    let purchase;
    try {
      purchase = await prisma.payment.findUnique({
        where: { id: order_id },
        include: { course: true },
      });
    } catch (dbError) {
      console.error("Database error finding purchase:", dbError);
      return res.status(500).json({ message: "Database error processing webhook", error: dbError.message });
    }

    if (!purchase) {
      console.warn("Purchase not found for order_id:", order_id);
      return res.status(404).json({ message: "Purchase not found" });
    }

    await prisma.$transaction(async (tx) => {
      const updatedPurchase = await tx.payment.update({
        where: { id: order_id },
        data: { status: "Completed", amount: parseInt(order_amount, 10), paymentId: payment_id },
      });

      const updatedUser = await tx.user.update({
        where: { id: purchase.userId },
        data: {
          enrolledCourses: { connect: { id: purchase.courseId } },
        },
      });

      const updatedCourse = await tx.course.update({
        where: { id: purchase.courseId },
        data: {
          enrollStudent: { connect: { id: purchase.userId } },
        },
      });

      console.log("Database updated - Payment:", updatedPurchase);
      console.log("Database updated - User:", updatedUser);
      console.log("Database updated - Course:", updatedCourse);
    });

    console.log("✅ Payment successfully processed:", JSON.stringify(event, null, 2));
    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("❌ Webhook processing error:", error.stack || error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  } finally {
    await prisma.$disconnect();
  }
};

exports.checkPurchaseStatus = async (req, res) => {
  try {
    const userId = req.id || "test-user-id";
    const courseId = Number(req.params.courseId);

    if (!userId || !courseId) {
      return res.status(400).json({ message: "Invalid user or course ID" });
    }

    const purchase = await prisma.payment.findFirst({
      where: {
        userId: userId,
        courseId: courseId,
        status: "Completed",
      },
    });

    res.status(200).json({ isPurchased: !!purchase });
  } catch (error) {
    console.error("Error checking purchase status:", error);
    res.status(500).json({ message: "Failed to check purchase status", error: error.message });
  } finally {
    await prisma.$disconnect();
  }
};