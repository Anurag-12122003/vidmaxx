import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/utils/supabase/admin'
import { syncUserToSupabase } from '@/utils/supabase/users'
import { SeriesList } from '@/components/dashboard/SeriesList'

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
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Series</h1>
                    <p className="text-muted-foreground mt-1">Manage and generate videos for your active series.</p>
                </div>
            </div>

            <SeriesList />
        </div>
    )
}
