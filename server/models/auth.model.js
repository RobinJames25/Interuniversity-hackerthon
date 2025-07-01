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
    .select('id, name, email, username, role, password, created_at, updated_at')
    .eq('email', email)
    .single();
    
    if (error) return null;
    return data;
}

export const findUserByUsername = async (username) => {
    const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single()

    if (error) return null;
    return data;
}

export const findUserById = async (id) => {
    const { data, error } = await supabase
    .from('users')
    .select('id, name, email, username, avatar, role, password, created_at, updated_at')
    .eq('id', id)
    .single()

    if (error) return null;
    return data;
}

export const updateUserById = async (id, updates) => {
    const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    if (error) throw error;
    return data;
}

export const deleteUserById = async (id) => {
    const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);
    if (error) throw error;
}

export const changeUserPassword = async (id, newPassword) => {
    const { error } = await supabase
    .from('users')
    .update({ password: newPassword })
    .eq('id', id);
    if (error) throw error;
}