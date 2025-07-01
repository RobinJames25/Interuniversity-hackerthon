import supabase from  '../config/supabaseClient.js';

export const insertStory = async ({ title, description, language, location, audio_url, user_id }) => {
    const { data, error } = await supabase
        .from('voice_stories')
        .insert({
            title,
            description,
            language,
            location,
            audio_url,
            user_id
        })
        .select();

    return { data, error };
}