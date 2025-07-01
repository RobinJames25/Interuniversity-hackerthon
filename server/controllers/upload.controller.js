import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const uploadAudio = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'video',
            folder: 'voice_stories'
        });

        fs.unlinkSync(req.file.path);
        res.json({ url: result.secure_url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Upload failed' });
    }
}