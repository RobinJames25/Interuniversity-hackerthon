import supabase from "../config/supabaseClient.js";

export const createUser = async (user) => {
    const { data, error } =await supabase
    .from('users')
    .insert([user])
    .select()
    .single();

    if (error) throw error;
    return data;
}

export const findUserByEmail = async (email) => {
    const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
    
    if (error) return null;
    return data;
}

export const findUserById = async (id) => {
    const { data, error } = await supabase
    .from('users')
    .select('id, name, email, username, avatar, role, created_at, updated_at')
    .eq('id', id)
    .single()

    if (error) return null;
    return data;
}