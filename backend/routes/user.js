const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./userAuth.js")
// Sign up
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        // Check username length is more than 3
        if (username.length < 4) {
            return res.status(400).json({ message: "Username length should be greater than 3" });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Check password length
        if (password.length <= 5) {
            return res.status(400).json({ message: "Password length should be greater than 5" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            address: address,
        });

        await newUser.save();
        return res.status(201).json({ message: "Signup successfully" });

    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: "Internal server error" });
    }
});

//sign-in
router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username exists
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare passwords using bcrypt
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const tokenPayload = {
            id: existingUser._id,
            username: existingUser.username,
            role: existingUser.role
        };

        const token = jwt.sign(tokenPayload, "bookStore123", { expiresIn: "30d" });

        // Return successful sign-in response with token
        return res.status(200).json({
            id: existingUser._id,
            username: existingUser.username,
            role: existingUser.role,
            token: token
        });

    } catch (error) {
        console.error("Error during sign-in", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/get-user-information", authenticateToken, async(req,res)=>{
    try{
        const { id }=req.headers;
        const data=await User.findById(id).select("-password");
        return res.status(200).json(data);
    }catch(error)
    {
        res.status(500).json({message: "Internal server error"});
    }
})

//update address
router.put("/update-address", authenticateToken, async (req, res) => {
    try {
        const userId = req.headers.id; // Assuming id is set in headers by authenticateToken middleware
        const { address } = req.body; // New address to update

        // Update user's address in the database
        await User.findByIdAndUpdate(userId, { address });

        // Send success response
        return res.status(200).json({ message: "Address updated successfully" });

    } catch (error) {
        console.error("Error updating address:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
