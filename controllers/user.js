import express from "express";
import bcrypt from "bcrypt";
import { User } from "../model/user.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { userid, username, email, password } = req.body;
        let user = await User.findOne({ email });

        if (user) {
            return res.status(404).json({
                success: false,
                message: "Email Already Exist",
            });
        }

        user = await User.findOne({ userid });
        if (user) {
            return res.status(404).json({
                success: false,
                message: "UserID Already Exist",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            userid: userid,
            username: username,
            email: email,
            password: hashedPassword,
            followers: [],
            following: [],
        });
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.status(201)
            .cookie("token", token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
            })
            .json({
                success: true,
                message: "Registered Succesfully",
            });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "Internal_Server_Error",
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Invalid Email",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({
                success: false,
                message: "Invalid Password",
            });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.status(200)
            .cookie("token", token, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
            })
            .json({
                success: true,
                message: "Login Succesfully",
            });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "Internal_Server_Error",
        });
    }
};

export const userProfile = (req, res) => {
    res.status(200).json({
        userid: req.user.userid,
        username: req.user.username,
        numberOfFollowers: req.user.followers.length,
        followers: req.user.followers,
        numberOfFollowing: req.user.following.length,
        following: req.user.following,
    });
};

export const logout = (req, res) => {
    res.status(200)
        .cookie("token", "", {
            expires: new Date(Date.now()),
        })
        .json({
            success: true,
            user: req.user,
        });
};

export const follow = async (req, res) => {
    const userid1 = req.user.userid;
    const userid2 = req.params.id;
    if (userid1 == userid2) {
        return res.status(404).json({
            success: false,
            message: "You can not follow your own userid",
        });
    }
    let User1 = await User.findOne({ userid: userid1 });
    let User2 = await User.findOne({ userid: userid2 });
    if (!User2) {
        return res.status(404).json({
            success: false,
            message: "UserID that you want to follow doesn't exist",
        });
    }

    const user2Followers = User2.followers;
    let follower = user2Followers.find((userid) => userid == userid1);
    if (follower) {
        return res.status(404).json({
            success: false,
            message: "You are already following that User",
        });
    }

    const user1Following = User1.following;
    follower = user1Following.find((userid) => userid == userid2);
    if (follower) {
        return res.status(404).json({
            success: false,
            message: "You are already following that User",
        });
    }

    User1.following.push(userid2);
    User2.followers.push(userid1);

    await User1.save();
    await User2.save();

    res.status(200).json({
        success: true,
        message: "You have followed this user",
    });
};

export const unfollow = async (req, res) => {
    const userid1 = req.user.userid;
    const userid2 = req.params.id;
    if (userid1 == userid2) {
        return res.status(404).json({
            success: false,
            message: "You can not unfollow your own userid",
        });
    }
    let User1 = await User.findOne({ userid: userid1 });
    let User2 = await User.findOne({ userid: userid2 });
    if (!User2) {
        return res.status(404).json({
            success: false,
            message: "UserID that you want to unfollow doesn't exist",
        });
    }

    const user2Followers = User2.followers;
    let follower = user2Followers.find((userid) => userid == userid1);
    if (!follower) {
        return res.status(404).json({
            success: false,
            message: "You are already not following that User",
        });
    }

    const user1Following = User1.following;
    follower = user1Following.find((userid) => userid == userid2);
    if (!follower) {
        return res.status(404).json({
            success: false,
            message: "You are already not following that User",
        });
    }

    User1.following = User1.following.filter((id) => id != userid2);
    User2.followers = User2.followers.filter((id) => id != userid1);

    await User1.save();
    await User2.save();

    res.status(200).json({
        success: true,
        message: "You have unfollowed this user",
    });
};
