import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/utils/supabase/admin'
import { syncUserToSupabase } from '@/utils/supabase/users'

export default async function DashboardPage() {
    const user = await currentUser()

    if (!user) {
        redirect('/sign-in')
    }

    // Fallback Sync: Ensure user exists in Supabase
    // This is useful if the webhook failed or hasn't run yet (e.g. localhost)
    const supabase = createAdminClient()
    console.log('Checking Supabase for user:', user.id)

    const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', user.id)
        .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user from Supabase:', fetchError)
    }

    if (!existingUser) {
        const email = user.emailAddresses[0]?.emailAddress
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()

        if (email) {
            console.log('User not found in Supabase. Attempting to sync...')
            console.log('Syncing params:', { user_id: user.id, email, name: fullName })
            const { success, error } = await syncUserToSupabase({
                user_id: user.id,
                email: email,
                name: fullName
            })

            if (!success) {
                console.error('Fallback sync failed:', error)
            } else {
                console.log('User successfully synced to Supabase (Fallback)')
            }
        }
    } else {
        console.log('User already exists in Supabase')
    }

    return (
        <div className=""></div>
    )
}
