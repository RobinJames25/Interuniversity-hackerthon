import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  findUserByEmail,
  findUserByUsername,
  findUserById,
  createUser,
  updateUserById,
  deleteUserById,
  changeUserPassword,
} from '../models/auth.model.js';

const getSanitizedUser = (user) => {
  if (!user) return null;
  const { password, ...sanitized } = user;
  return sanitized;
};

export const signup = async (req, res, next) => {
  try {
    const { name, username, email, password, cPassword, role } = req.body;

    if (!name || !username || !email || !password || !cPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password !== cPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const existingUserByEmail = await findUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(422).json({ message: 'Email is already registered.' });
    }

    const existingUserByUsername = await findUserByUsername(username);
    if (existingUserByUsername) {
      return res.status(422).json({ message: 'Username is already taken.' });
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

    const secret = process.env.AUTH_SECRET;
    if (!secret) throw new Error('JWT secret (AUTH_SECRET) is not set.');

    const token = jwt.sign({ id: savedUser.id }, secret, { expiresIn: '1h' });

    res.cookie('auth_cookie', token, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      partitioned: true,
    });

    res.status(201).json({
      message: 'Signup successful',
      token,
      user: getSanitizedUser(savedUser),
    });
  } catch (error) {
    next({ status: 500, message: 'Signup failed', error });
  }
};

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

    const secret = process.env.AUTH_SECRET;
    if (!secret) throw new Error('JWT secret (AUTH_SECRET) is not set.');

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });

    res.cookie('auth_cookie', token, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      partitioned: true,
    });

    res.status(200).json({
      message: 'Signin successful',
      token,
      user: getSanitizedUser(user),
    });
  } catch (error) {
    next({ status: 500, message: 'Signin failed', error });
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({ user: getSanitizedUser(req.user) });
  } catch (error) {
    next({ status: 500, message: 'Failed to fetch user', error });
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('auth_cookie');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next({ status: 500, message: 'Logout failed', error });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, username, avatar } = req.body;

    const updated = await updateUserById(req.user.id, {
      name,
      username,
      avatar,
      updated_at: new Date().toISOString(),
    });

    res.status(200).json({
      message: 'Profile updated',
      user: getSanitizedUser(updated),
    });
  } catch (error) {
    next({ status: 500, message: 'Failed to update profile', error });
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old and new passwords are required.' });
    }

    const user = await findUserById(req.user.id);
    if (!user || !user.password) {
      return res.status(400).json({ message: 'User not found or password missing.' });
    }

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Old password is incorrect.' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await changeUserPassword(req.user.id, hashed);

    res.status(200).json({ message: 'Password changed successfully' });

  } catch (error) {
    next({ status: 500, message: 'Failed to change password', error });
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    await deleteUserById(req.user.id);
    res.clearCookie('auth_cookie');
    res.status(200).json({ message: 'Account deleted' });
  } catch (error) {
    next({ status: 500, message: 'Failed to delete account', error });
  }
};
