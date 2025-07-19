import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User, IUser } from "../models/User";
import generateToken from "../utils/jwt";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    let userFound = await User.findOne({ email });
    if (userFound) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Add password length validation
    // We can also add more complex logic here for password, but for simplicity
    // I have only added check on length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: IUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: generateToken(String(newUser._id)),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(String(user._id)),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
