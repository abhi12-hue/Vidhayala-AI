const express = require("express");
const {createCheckoutSession ,cashfreeWebhook , checkPurchaseStatus } = require("../controller/PaymentController");
const { isAuthicated } = require("../middleware/isAuthicated");
const router = express.Router();

// Route for initiating payment checkout
router.post("/checkout", isAuthicated, createCheckoutSession);

// Webhook route for handling Cashfree payment updates
router.post("/webhook/cashfree", cashfreeWebhook);
router.get("/status/:courseId", isAuthicated ,checkPurchaseStatus);
module.exports = router;
