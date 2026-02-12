"use client"

import { useState, useEffect } from "react"
import {
    Save,
    Settings,
    Info,
    MapPin,
    Phone,
    Globe,
    Clock,
    Share2,
    Search,
    Loader2,
    Image as ImageIcon,
    CheckCircle2,
    Layout
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAdminSiteSettings, useAdminRestaurantInfo, useApiClient } from "@/hooks/use-api"
import { SiteSettings, RestaurantInfo } from "@/lib/types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function SettingsTab() {
    const { settings, loading: settingsLoading, refetch: refetchSettings } = useAdminSiteSettings()
    const { info, loading: infoLoading, refetch: refetchInfo } = useAdminRestaurantInfo()
    const api = useApiClient()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [activeLang, setActiveLang] = useState<'uz' | 'ru' | 'en'>('uz')

    // Forms state
    const [settingsForm, setSettingsForm] = useState<Partial<SiteSettings>>({})
    const [infoForm, setInfoForm] = useState<Partial<RestaurantInfo>>({})

    useEffect(() => {
        if (settings) setSettingsForm(settings)
    }, [settings])

    useEffect(() => {
        if (info) setInfoForm(info)
    }, [info])

    const handleSettingsSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await api.patch('/site-settings/', settingsForm)
            toast.success("Sayt sozlamalari saqlandi")
            refetchSettings()
        } catch (error) {
            console.error("Error saving settings:", error)
            toast.error("Xatolik yuz berdi")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await api.patch('/restaurant-info/', infoForm)
            toast.success("Restoran ma'lumotlari saqlandi")
            refetchInfo()
        } catch (error) {
            console.error("Error saving info:", error)
            toast.error("Xatolik yuz berdi")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (settingsLoading || infoLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Sozlamalar</h2>

                {/* Language Switcher */}
                <div className="flex bg-slate-800 rounded p-0.5">
                    {(['uz', 'ru', 'en'] as const).map(lang => (
                        <button
                            key={lang}
                            onClick={() => setActiveLang(lang)}
                            className={cn(
                                "px-3 py-1.5 text-xs rounded uppercase font-bold transition-all",
                                activeLang === lang ? "bg-emerald-500 text-white shadow" : "text-white/50 hover:text-white"
                            )}
                        >
                            {lang}
                        </button>
                    ))}
                </div>
            </div>

            <Tabs defaultValue="site" className="w-full">
                <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl mb-6">
                    <TabsTrigger value="site" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                        <Settings className="w-4 h-4 mr-2" />
                        Sayt
                    </TabsTrigger>
                    <TabsTrigger value="restaurant" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                        <Info className="w-4 h-4 mr-2" />
                        Restoran
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="site">
                    <form onSubmit={handleSettingsSubmit} className="space-y-8">
                        {/* General Section */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-emerald-500" />
                                Asosiy Sozlamalar
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-white/60">Sayt nomi ({activeLang})</Label>
                                    <Input
                                        value={activeLang === 'uz' ? settingsForm.site_name_uz : activeLang === 'ru' ? settingsForm.site_name_ru : settingsForm.site_name}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            if (activeLang === 'uz') setSettingsForm({ ...settingsForm, site_name_uz: val })
                                            else if (activeLang === 'ru') setSettingsForm({ ...settingsForm, site_name_ru: val })
                                            else setSettingsForm({ ...settingsForm, site_name: val })
                                        }}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white/60">Email manzil</Label>
                                    <Input
                                        value={settingsForm.email || ""}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contacts Section */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-emerald-500" />
                                Aloqa Ma'lumotlari
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-white/60">Telefon (Bron qilish)</Label>
                                    <Input
                                        value={settingsForm.phone || ""}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white/60">Telefon (Dostavka)</Label>
                                    <Input
                                        value={settingsForm.delivery_phone || ""}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, delivery_phone: e.target.value })}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label className="text-white/60">Manzil ({activeLang})</Label>
                                    <Textarea
                                        value={activeLang === 'uz' ? settingsForm.address_uz : activeLang === 'ru' ? settingsForm.address_ru : settingsForm.address}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            if (activeLang === 'uz') setSettingsForm({ ...settingsForm, address_uz: val })
                                            else if (activeLang === 'ru') setSettingsForm({ ...settingsForm, address_ru: val })
                                            else setSettingsForm({ ...settingsForm, address: val })
                                        }}
                                        className="bg-white/5 border-white/10 text-white min-h-[80px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Working Hours & Socials */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-emerald-500" />
                                    Ish Vaqti
                                </h3>
                                <div className="space-y-2">
                                    <Label className="text-white/60">Ish tartibi ({activeLang})</Label>
                                    <Input
                                        value={activeLang === 'uz' ? settingsForm.working_hours_uz : activeLang === 'ru' ? settingsForm.working_hours_ru : settingsForm.working_hours}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            if (activeLang === 'uz') setSettingsForm({ ...settingsForm, working_hours_uz: val })
                                            else if (activeLang === 'ru') setSettingsForm({ ...settingsForm, working_hours_ru: val })
                                            else setSettingsForm({ ...settingsForm, working_hours: val })
                                        }}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <Share2 className="w-5 h-5 text-emerald-500" />
                                    Ijtimoiy Tarmoqlar
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase font-bold text-white/40">Telegram URL</Label>
                                        <Input
                                            value={settingsForm.telegram_url || ""}
                                            onChange={(e) => setSettingsForm({ ...settingsForm, telegram_url: e.target.value })}
                                            className="bg-white/5 border-white/10 text-white h-9"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] uppercase font-bold text-white/40">Instagram URL</Label>
                                        <Input
                                            value={settingsForm.instagram_url || ""}
                                            onChange={(e) => setSettingsForm({ ...settingsForm, instagram_url: e.target.value })}
                                            className="bg-white/5 border-white/10 text-white h-9"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Maintenance Mode */}
                        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Layout className="w-5 h-5 text-red-500" />
                                    <h3 className="text-lg font-bold text-white">Texnik Holat (Maintenance)</h3>
                                </div>
                                <Switch
                                    checked={settingsForm.is_maintenance_mode}
                                    onCheckedChange={(c) => setSettingsForm({ ...settingsForm, is_maintenance_mode: c })}
                                />
                            </div>
                            {settingsForm.is_maintenance_mode && (
                                <div className="space-y-2">
                                    <Label className="text-white/60">Xabar matni</Label>
                                    <Textarea
                                        value={settingsForm.maintenance_message || ""}
                                        onChange={(e) => setSettingsForm({ ...settingsForm, maintenance_message: e.target.value })}
                                        className="bg-white/5 border-white/10 text-white"
                                        placeholder="Sayt hozirda texnik ishlar sababli yopiq..."
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <Button
                                disabled={isSubmitting}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl px-8 h-12 shadow-lg shadow-emerald-500/20"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Barchasini Saqlash
                            </Button>
                        </div>
                    </form>
                </TabsContent>

                <TabsContent value="restaurant">
                    <form onSubmit={handleInfoSubmit} className="space-y-8">
                        {/* Hero Section */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-emerald-500" />
                                Asosiy Banner (Hero)
                            </h3>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-white/60">Hero Sarlavha ({activeLang})</Label>
                                    <Input
                                        value={activeLang === 'uz' ? infoForm.hero_title : activeLang === 'ru' ? infoForm.hero_subtitle_ru : infoForm.hero_title}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            if (activeLang === 'uz') setInfoForm({ ...infoForm, hero_title: val })
                                            else if (activeLang === 'ru') setInfoForm({ ...infoForm, hero_subtitle_ru: val })
                                            else setInfoForm({ ...infoForm, hero_title: val })
                                        }}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white/60">Hero Tagline ({activeLang})</Label>
                                    <Textarea
                                        value={activeLang === 'uz' ? infoForm.hero_subtitle_uz : activeLang === 'ru' ? infoForm.hero_subtitle_ru : infoForm.hero_subtitle}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            if (activeLang === 'uz') setInfoForm({ ...infoForm, hero_subtitle_uz: val })
                                            else if (activeLang === 'ru') setInfoForm({ ...infoForm, hero_subtitle_ru: val })
                                            else setInfoForm({ ...infoForm, hero_subtitle: val })
                                        }}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <Info className="w-5 h-5 text-emerald-500" />
                                Restoran Haqida
                            </h3>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-white/60">Sarlavha ({activeLang})</Label>
                                    <Input
                                        value={activeLang === 'uz' ? infoForm.about_title_uz : activeLang === 'ru' ? infoForm.about_title_ru : infoForm.about_title}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            if (activeLang === 'uz') setInfoForm({ ...infoForm, about_title_uz: val })
                                            else if (activeLang === 'ru') setInfoForm({ ...infoForm, about_title_ru: val })
                                            else setInfoForm({ ...infoForm, about_title: val })
                                        }}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white/60">Matn 1 ({activeLang})</Label>
                                    <Textarea
                                        value={activeLang === 'uz' ? infoForm.about_description_1_uz : activeLang === 'ru' ? infoForm.about_description_1_ru : infoForm.about_description_1}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            if (activeLang === 'uz') setInfoForm({ ...infoForm, about_description_1_uz: val })
                                            else if (activeLang === 'ru') setInfoForm({ ...infoForm, about_description_1_ru: val })
                                            else setInfoForm({ ...infoForm, about_description_1: val })
                                        }}
                                        className="bg-white/5 border-white/10 text-white min-h-[100px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-white/60">Matn 2 ({activeLang})</Label>
                                    <Textarea
                                        value={activeLang === 'uz' ? infoForm.about_description_2_uz : activeLang === 'ru' ? infoForm.about_description_2_ru : infoForm.about_description_2}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            if (activeLang === 'uz') setInfoForm({ ...infoForm, about_description_2_uz: val })
                                            else if (activeLang === 'ru') setInfoForm({ ...infoForm, about_description_2_ru: val })
                                            else setInfoForm({ ...infoForm, about_description_2: val })
                                        }}
                                        className="bg-white/5 border-white/10 text-white min-h-[100px]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                disabled={isSubmitting}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl px-8 h-12 shadow-lg shadow-emerald-500/20"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Ma'lumotlarni Saqlash
                            </Button>
                        </div>
                    </form>
                </TabsContent>
            </Tabs>
        </div>
    )
}
