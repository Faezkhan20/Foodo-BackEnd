import { Router } from "express";
import { getUser, login, logout, resetPassword, signup, verifyOtp } from "../Controllers/AuthControllers.js";
import {verifyToken} from "../Middlewears/verifyToken.js"
import { addToCart, checkout, clearCart, decrementQuantity, getCart,incrementQuantity, removeFromCart } from "../Controllers/FeatureController.js";
const router=Router()
// const { signup, login, logout, resetPassword, verifyOtp, getUser } = require("./Controllers/AuthControllers");

//Authrouter routes
router.post("/signup",signup)
router.post("/login",login)
router.get("/logout",logout)
router.put("/reset-password",resetPassword);;
router.put("/verify-otp",verifyOtp);
router.get("/get-user",verifyToken,getUser)

//Feature routes
router.post("/add-to-cart/:id",addToCart);
router.get("/get-cart/:id",getCart);
router.delete("/remove-from-cart/:id",removeFromCart);
router.put("/increment-quantity/:id",incrementQuantity);
router.put("/decrement-quantity/:id",decrementQuantity);
router.get("/checkout",verifyToken,checkout);
router.get("/clear-cart",verifyToken,clearCart);


export default router