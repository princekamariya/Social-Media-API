import { Post } from "../model/post.js";
import { v4 as uuidv4 } from "uuid";

export const post = async (req, res) => {
    try {
        const { title, description } = req.body;
        const uid = uuidv4();
        let post = await Post.create({
            postId: uid,
            userId: req.user._id,
            title: title,
            description: description,
        });
        res.status(201).json({
            success: true,
            message: "Post created Succesfully",
            post,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message:
                "Some Internal Server Error Please Enter title and description if you haven't entered",
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        let post = await Post.findOne({ postId: id });
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post that you want to delete doesn't exist",
            });
        }

        await post.deleteOne();
        res.status(200).json({
            success: true,
            message: "Post Deleted Succesfully",
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message:
                "Some Internal Server Error Please Check Details that you have entered from your side also",
        });
    }
};

export const getPost = async (req, res) => {
    try {
        const postId = req.params.id;
        let post = await Post.findOne({ postId: postId });
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post that you are searching doesn't exist",
            });
        }
        res.status(200).json({
            success: false,
            post,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message:
                "Some Internal Server Error Please Check Details that you have entered from your side also",
        });
    }
};

export const getAllPostOfUser = async (req, res) => {
    try {
        const userId = req.params.id;
        let posts = await Post.find({ userId: userId });
        res.status(200).json({
            success: true,
            posts,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message:
                "Sorry!, Some Internal Server Error Please Check Details that you have entered from your side also",
        });
    }
};

export const like = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        let post = await Post.findOne({ postId: postId });
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post doesn't exist",
            });
        }

        // const isLiked = post.likes.find((id) => id == userId);
        if (post.likes.includes(userId)) {
            return res.status(404).json({
                success: false,
                message: "This post is already Liked by you",
            });
        }

        post.likes.push(req.user._id);

        await post.save();

        res.status(200).json({
            success: true,
            message: "You have liked this post",
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message:
                "Sorry!, Some Internal Server Error Please Check Details that you have entered from your side also",
        });
    }
};

export const unlike = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        let post = await Post.findOne({ postId: postId });
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post doesn't exist",
            });
        }

        if (post.likes.includes(userId)) {
            const index = post.likes.indexOf(userId);
            post.likes.splice(index, 1);
            await post.save();
            return res.status(200).json({
                success: true,
                message: "You have unliked Post",
            });
        } else {
            res.status(404).json({
                success: false,
                message: "You haven't liked post yet!!",
            });
        }
    } catch (error) {
        res.status(404).json({
            success: false,
            message:
                "Sorry!, Some Internal Server Error Please Check Details that you have entered from your side also",
        });
    }
};

export const comment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const commentMsg = req.body.commentMsg;
        let post = await Post.findOne({ postId: postId });
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post doesn't exist",
            });
        }
        post.comments.push({
            user: req.user._id,
            comment: commentMsg,
        });
        await post.save();
        res.status(200).json({
            success: true,
            message: "You have commented succesfully",
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message:
                "Sorry!, Some Internal Server Error Please Check Details that you have entered from your side also",
        });
    }
};

export const getAllPost = async (req, res) => {
    try {
        const post = await Post.find({});
        res.status(200).json({
            success: true,
            post,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "Sorry!, Some Internal Server Error, Try After Some Time",
        });
    }
};
