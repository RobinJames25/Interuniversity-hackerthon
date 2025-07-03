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
    .select('id, name, email, username, role, password, reset_token_hash, reset_token_expires, created_at, updated_at')
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
    .select('id, name, email, username, avatar, role, password, reset_token_hash, reset_token_expires, created_at, updated_at')
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

export const saveResetToken = async (id, tokenHash, expires) => {
      console.log('🔒 Saving hash:', tokenHash);
      console.log('⏳ Expires ISO:', expires.toISOString());
    const { error } = await supabase
    .from('users')
    .update({
        reset_token_hash: tokenHash,
        reset_token_expires: expires.toISOString(),
    })
    .eq('id', id);

    if (error) throw error;
}

export const findUserByResetToken = async (tokenHash) => {
    const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('reset_token_hash', tokenHash)
    .single();

    if (error) return null;
    return data;
}

export const resetPasswordAndClearToken = async (id, hashedPassword) => {
    const { error } = await supabase
    .from('users')
    .update({
        password: hashedPassword,
        reset_token_hash: null,
        reset_token_expires: null,
    })
    .eq('id', id);

    if (error) throw error;
}