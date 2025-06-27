import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/auth.model.js';

export const signup = async (req, res, next) => {
    try {
        const { name, username, email, password, cPassword, role } = req.body;

        if (!name || !username || !email || !password || !cPassword) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (password !== cPassword) {
            return res.status(400).json({ message: 'Passwords do not match.' });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(422).json({
                message: 'Email or Username is already registered.'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            name,
            username,
            email,
            password: hashedPassword,
            role: role || 'user',
        };

        const savedUser = await createUser(newUser);

        const token = jwt.sign({ id: savedUser.id }, process.env.AUTH_SECRET, {
            expiresIn: '1h',
        });

        const responseUser = {
            id: savedUser.id,
            name: savedUser.name,
            username: savedUser.username,
            email: savedUser.email,
            role: savedUser.role,
            createdAt: savedUser.created_at,
            updatedAt: savedUser.updated_at,
        };

        res.cookie('auth_cookie', token, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            partitioned: true,
        });

        res.status(201).json({
            message: 'Signup successful',
            token,
            user: responseUser,
        });
    } catch (error) {
        next({
            status: 500,
            message: 'Internal server error',
            error,
        });
    }
}

export const signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user.id }, process.env.AUTH_SECRET, {
            expiresIn: '1h',
        });

        const responseUser = {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        };

        res.cookie('auth_cookie', token, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            partitioned: true,
        })

        res.status(200).json({
            message: 'Signin successful',
            token,
            user: responseUser,
        });
    } catch (error) {
        next({
            status: 500,
            message: 'Internal server error',
            error,
        })
    }

}