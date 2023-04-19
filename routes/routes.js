import express from "express";
import {
    register,
    login,
    userProfile,
    follow,
    unfollow,
    logout,
} from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";
import {
    getAllPostOfUser,
    getPost,
    post,
    deletePost,
    like,
    unlike,
    comment,
    getAllPost,
} from "../controllers/post.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/user", isAuthenticated, userProfile);
router.post("/follow/:id", isAuthenticated, follow);
router.post("/unfollow/:id", isAuthenticated, unfollow);

router.post("/post", isAuthenticated, post);
router.delete("/post/:id", isAuthenticated, deletePost);
router.get("/post/:id", isAuthenticated, getPost);
router.get("/posts/:id", isAuthenticated, getAllPostOfUser);
router.post("/like/:id", isAuthenticated, like);
router.post("/unlike/:id", isAuthenticated, unlike);
router.post("/comment/:id", isAuthenticated, comment);
router.get("/getAllPost", getAllPost);
export default router;
