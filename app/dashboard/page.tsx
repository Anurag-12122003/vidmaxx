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
        <div className="w-full max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Welcome back, {user.firstName}!</h2>
                <p className="text-muted-foreground">
                    This is your protected dashboard. Here you can start creating AI videos.
                </p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 border rounded-lg bg-background/50 hover:border-primary/50 transition-colors cursor-pointer">
                        <h3 className="font-medium mb-2">Create New Project</h3>
                        <p className="text-sm text-muted-foreground">Start a new video from scratch or use AI.</p>
                    </div>
                    <div className="p-6 border rounded-lg bg-background/50 hover:border-primary/50 transition-colors cursor-pointer">
                        <h3 className="font-medium mb-2">My Projects</h3>
                        <p className="text-sm text-muted-foreground">View and edit your existing videos.</p>
                    </div>
                    <div className="p-6 border rounded-lg bg-background/50 hover:border-primary/50 transition-colors cursor-pointer">
                        <h3 className="font-medium mb-2">Schedule</h3>
                        <p className="text-sm text-muted-foreground">Manage your content calendar.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
