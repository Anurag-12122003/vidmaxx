import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/utils/supabase/admin'
import { SeriesFormWizard } from '@/components/dashboard/create/SeriesFormWizard'
import { Language } from '@/utils/constants/voices'

export default async function EditSeriesPage({ params }: { params: Promise<{ id: string }> }) {
    const user = await currentUser()
    const { id } = await params;

    if (!user) {
        redirect('/sign-in')
    }

    const supabase = createAdminClient()

    // Fetch the existing series from Supabase
    const { data: seriesData, error } = await supabase
        .from('series')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (error || !seriesData) {
        console.error('Error fetching series for edit:', error)
        redirect('/dashboard') // Or to a 404 page
    }

    // Transform Supabase snake_case schema back into the form's nested data structure
    const dbLang = seriesData.language || 'en';
    const matchedLanguage = Language.find(l => l.modelLangCode.startsWith(dbLang))?.modelLangCode || dbLang;

    const initialData = {
        niche: seriesData.niche,
        language: matchedLanguage,
        voice: seriesData.voice,
        bgMusic: seriesData.bg_music || [],
        imageStyle: seriesData.image_style,
        captionStyle: seriesData.caption_style,
        seriesDetails: {
            seriesName: seriesData.series_name,
            duration: seriesData.video_duration,
            platforms: seriesData.platforms || [],
            scheduleTime: seriesData.schedule_time || ""
        }
    }

    return <SeriesFormWizard initialData={initialData} seriesId={id} isEditMode={true} />
}
