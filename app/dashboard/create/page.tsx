"use client";

import { useState } from "react";
import { ProgressStepper } from "@/components/dashboard/create/ProgressStepper";
import { NicheSelection } from "@/components/dashboard/create/NicheSelection";
import { LanguageVoiceSelection } from "@/components/dashboard/create/LanguageVoiceSelection";
import { BgMusicSelection } from "@/components/dashboard/create/BgMusicSelection";
import { VideoStyleSelection } from "@/components/dashboard/create/VideoStyleSelection";
import { CaptionStyleSelection } from "@/components/dashboard/create/CaptionStyleSelection";
import { SeriesDetailsForm, SeriesDetailsData } from "@/components/dashboard/create/SeriesDetailsForm";
import { FormFooter } from "@/components/dashboard/create/FormFooter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateSeriesPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        niche: null as string | null,
        language: null as string | null,
        voice: null as string | null,
        bgMusic: [] as string[],
        imageStyle: null as string | null,
        captionStyle: null as string | null,
        seriesDetails: {
            seriesName: "",
            duration: "",
            platforms: [] as string[],
            scheduleTime: ""
        } as SeriesDetailsData
    });

    const handleNextStep = () => {
        if (currentStep < 6) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        } else {
            router.back();
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto pb-20">
            <div className="mb-6 flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                    className="rounded-full shadow-sm hover:bg-muted"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-bold">Create New Series</h1>
            </div>

            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-10 min-h-[70vh] flex flex-col">
                {/* Progress Stepper renders independently at the top */}
                <ProgressStepper currentStep={currentStep} />

                {/* Dynamic Step Content Area */}
                <div className="flex-1 mt-6">
                    {currentStep === 1 && (
                        <NicheSelection
                            value={formData.niche}
                            onChange={(val) => setFormData({ ...formData, niche: val })}
                        />
                    )}

                    {currentStep === 2 && (
                        <LanguageVoiceSelection
                            languageValue={formData.language}
                            voiceValue={formData.voice}
                            onChange={({ language, voice }) => setFormData({ ...formData, language, voice })}
                        />
                    )}

                    {currentStep === 3 && (
                        <BgMusicSelection
                            value={formData.bgMusic}
                            onChange={(bgMusic) => setFormData({ ...formData, bgMusic })}
                        />
                    )}

                    {currentStep === 4 && (
                        <VideoStyleSelection
                            value={formData.imageStyle}
                            onChange={(imageStyle) => setFormData({ ...formData, imageStyle })}
                        />
                    )}

                    {currentStep === 5 && (
                        <CaptionStyleSelection
                            value={formData.captionStyle}
                            onChange={(captionStyle) => setFormData({ ...formData, captionStyle })}
                        />
                    )}

                    {currentStep === 6 && (
                        <SeriesDetailsForm
                            value={formData.seriesDetails}
                            onChange={(seriesDetails) => setFormData({ ...formData, seriesDetails })}
                        />
                    )}
                </div>

                <FormFooter
                    onNext={handleNextStep}
                    onBack={handleBack}
                    hideBack={currentStep === 1}
                    disableNext={
                        (currentStep === 1 && !formData.niche) ||
                        (currentStep === 2 && !formData.voice) ||
                        (currentStep === 3 && formData.bgMusic.length === 0) ||
                        (currentStep === 4 && !formData.imageStyle) ||
                        (currentStep === 5 && !formData.captionStyle) ||
                        (currentStep === 6 && (!formData.seriesDetails.seriesName || !formData.seriesDetails.duration || !formData.seriesDetails.scheduleTime || formData.seriesDetails.platforms.length === 0))
                    }
                    isFinalStep={currentStep === 6}
                />
            </div>
        </div>
    );
}
