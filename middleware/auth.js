import jwt from "jsonwebtoken";
import { User } from "../model/user.js";

export const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    console.log(token);

    if (!token) {
        return res.status(404).json({
            success: false,
            message: "Not Logged In, LogIn first",
        });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedToken._id);
    next();
};
