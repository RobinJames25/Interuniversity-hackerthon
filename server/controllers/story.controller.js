import { insertStory } from "../models/story.model.js";

export const createStory = async (req, res) => {
    const { title, description, language, location, audio_url } = req.body;
    const user_id = req.user.id;

    const { error, data } = await insertStory({
        title,
        description,
        language,
        location,
        audio_url,
        user_id
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }
    res.status(201).json({
        success: true,
        message: 'Story uploaded successfully', 
        id: data[0].id 
    });
}