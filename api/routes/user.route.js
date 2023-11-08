import express from "express";
<<<<<<< HEAD
import { deleteUser, test,getUserListings, getUser } from "../controllers/user.controller.js";
=======
import { deleteUser, test,getUserListings,getUser } from "../controllers/user.controller.js";
>>>>>>> 49c839a8b245e6f35205a30f25eb5ce0cbda74f6
import {updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test",test);
router.post("/update/:id",verifyToken, updateUser)
router.delete("/delete/:id",verifyToken, deleteUser)
router.get("/listings/:id",verifyToken, getUserListings)
router.get("/:id",verifyToken, getUser)

export default router;