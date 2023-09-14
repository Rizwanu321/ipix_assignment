import express from "express";
import {
  braintreeTokenController,
  brainTreePaymentController
} from "../controllers/productController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();



//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

export default router;