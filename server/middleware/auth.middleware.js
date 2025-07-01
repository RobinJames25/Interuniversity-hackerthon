import jwt from "jsonwebtoken";
import { findUserById } from '../models/auth.model.js';

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.auth_cookie || req.headers['authorization']?.split(' ')[1];

        if (!token) {
            console.log('No token found!');
            return res.status(401).json({ message: 'Unauthorized: No token found' });
        }

        const decoded = jwt.verify(token, process.env.AUTH_SECRET);
        console.log('Decoded token:', decoded);

        const user = await findUserById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
            createdAt: user.created_at,
            updatedAt: user.updated_at,
        };

        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        return res.status(401).json({
            message: 'Unauthorized: Invalid token',
            error: err.message
        })
    }
}