import express from 'express';
import { getCurrentUser, logout, updateProfile, changePassword, deleteAccount, signup, signin } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/me', verifyToken, getCurrentUser);
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', verifyToken, logout);
router.put('/update-profile', verifyToken, updateProfile);
router.put('/change-password', verifyToken, changePassword);
router.delete('/delete-account', verifyToken, deleteAccount);


export default router;