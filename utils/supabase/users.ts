import { createAdminClient } from './admin'

export interface UserData {
    user_id: string;
    email: string;
    name?: string;
}

export async function syncUserToSupabase(user: UserData) {
    const supabase = createAdminClient()

    console.log('syncUserToSupabase received:', user)
    console.log(`Syncing user ${user.user_id} to Supabase...`)

    const { error } = await supabase
        .from('users')
        .upsert({
            id: user.user_id,
            email: user.email,
            full_name: user.name,
            // Removing updated_at for now as it doesn't exist in the initial schema
        }, { onConflict: 'id' })

    if (error) {
        console.error('Error syncing user to Supabase:', error)
        return { success: false, error }
    }

    console.log(`Successfully synced user ${user.user_id} to Supabase.`)
    return { success: true }
}
