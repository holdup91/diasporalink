"use client"

import type React from "react"
import { useState } from "react"
import { useLanguage } from "../context/LanguageContext"
import { supabase } from "../lib/supabase"
import { AutocompleteInput } from "./AutocompleteInput"
import { Calendar, Plus, Trash2, Phone, ArrowLeft, GripVertical, Check, AlertCircle, ExternalLink } from "lucide-react"

interface TripStop {
  id: string
  city: string
  cityId: number | null
  country: string
  countryId: number | null
  stopType: "pickup" | "dropoff" | "both"
  address: string
  availability: string
  instructions: string
}

interface TripEntryFormProps {
  onBack: () => void
  onTripCreated: (tripId: string) => void
}

export function TripEntryForm({ onBack, onTripCreated }: TripEntryFormProps) {
  const { t, language } = useLanguage()
  const isRTL = language === "ar"

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    whatsappEnabled: false,
    messenger: "",
    departureDate: "",
    notes: "",
  })

  const [stops, setStops] = useState<TripStop[]>([
    {
      id: "origin",
      city: "",
      cityId: null,
      country: "",
      countryId: null,
      stopType: "pickup",
      address: "",
      availability: "",
      instructions: "",
    },
    {
      id: "destination",
      city: "",
      cityId: null,
      country: "",
      countryId: null,
      stopType: "dropoff",
      address: "",
      availability: "",
      instructions: "",
    },
  ])

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/\s/g, ""))
  }

  const translations = {
    en: {
      newTripEntry: "New Trip Entry",
      carrierInformation: "Carrier Information",
      fullName: "Full Name",
      enterFullName: "Enter your full name",
      phoneNumber: "Phone Number",
      availableOnWhatsApp: "Available on WhatsApp",
      messenger: "Messenger",
      tripInformation: "Trip Information",
      departureDate: "Departure Date",
      notes: "Notes",
      additionalTripInfo: "Additional trip information...",
      tripStops: "Trip Stops",
      addStop: "Add Stop",
      origin: "Origin",
      destination: "Destination",
      stop: "Stop",
      pickup: "Pickup",
      dropoff: "Dropoff",
      both: "Both",
      city: "City",
      searchCity: "Search for a city...",
      address: "Address",
      specificAddress: "Specific address (optional)",
      availability: "Date",
      instructions: "Instructions",
      specialInstructions: "Special instructions for this stop...",
      cancel: "Cancel",
      createTrip: "Create Trip",
      creating: "Creating...",
      fullNameRequired: "Full name is required",
      phoneRequired: "Phone number is required",
      invalidPhone: "Invalid phone number format",
      departureDateRequired: "Departure date is required",
      futureDateRequired: "Departure date must be in the future",
      originCityRequired: "Origin city is required",
      destinationCityRequired: "Destination city is required",
      duplicateCities: "Duplicate cities are not allowed",
      failedToCreate: "Failed to create trip. Please try again.",
    },
    fr: {
      newTripEntry: "Nouvelle Entrée de Voyage",
      carrierInformation: "Informations du Transporteur",
      fullName: "Nom Complet",
      enterFullName: "Entrez votre nom complet",
      phoneNumber: "Numéro de Téléphone",
      availableOnWhatsApp: "Disponible sur WhatsApp",
      messenger: "Messenger",
      tripInformation: "Informations du Voyage",
      departureDate: "Date de Départ",
      notes: "Notes",
      additionalTripInfo: "Informations supplémentaires sur le voyage...",
      tripStops: "Arrêts du Voyage",
      addStop: "Ajouter un Arrêt",
      origin: "Origine",
      destination: "Destination",
      stop: "Arrêt",
      pickup: "Collecte",
      dropoff: "Livraison",
      both: "Les Deux",
      city: "Ville",
      searchCity: "Rechercher une ville...",
      address: "Adresse",
      specificAddress: "Adresse spécifique (optionnel)",
      availability: "Date",
      instructions: "Instructions",
      specialInstructions: "Instructions spéciales pour cet arrêt...",
      cancel: "Annuler",
      createTrip: "Créer le Voyage",
      creating: "Création...",
      fullNameRequired: "Le nom complet est requis",
      phoneRequired: "Le numéro de téléphone est requis",
      invalidPhone: "Format de numéro de téléphone invalide",
      departureDateRequired: "La date de départ est requise",
      futureDateRequired: "La date de départ doit être dans le futur",
      originCityRequired: "La ville d'origine est requise",
      destinationCityRequired: "La ville de destination est requise",
      duplicateCities: "Les villes mises en double ne sont pas autorisées",
      failedToCreate: "Échec de la création du voyage. Veuillez réessayer.",
    },
    ar: {
      newTripEntry: "إدخال رحلة جديدة",
      carrierInformation: "معلومات الناقل",
      fullName: "الاسم الكامل",
      enterFullName: "أدخل اسمك الكامل",
      phoneNumber: "رقم الهاتف",
      availableOnWhatsApp: "متاح على واتساب",
      messenger: "ماسنجر",
      tripInformation: "معلومات الرحلة",
      departureDate: "تاريخ المغادرة",
      notes: "ملاحظات",
      additionalTripInfo: "معلومات إضافية عن الرحلة...",
      tripStops: "محطات الرحلة",
      addStop: "إضافة محطة",
      origin: "المنشأ",
      destination: "الوجهة",
      stop: "محطة",
      pickup: "استلام",
      dropoff: "تسليم",
      both: "كلاهما",
      city: "المدينة",
      searchCity: "البحث عن مدينة...",
      address: "العنوان",
      specificAddress: "عنوان محدد (اختياري)",
      availability: "تاريخ",
      instructions: "التعليمات",
      specialInstructions: "تعليمات خاصة لهذه المحطة...",
      cancel: "إلغاء",
      createTrip: "إنشاء الرحلة",
      creating: "جاري الإنشاء...",
      fullNameRequired: "الاسم الكامل مطلوب",
      phoneRequired: "رقم الهاتف مطلوب",
      invalidPhone: "تنسيق رقم الهاتف غير صحيح",
      departureDateRequired: "تاريخ المغادرة مطلوب",
      futureDateRequired: "يجب أن يكون تاريخ المغادرة في المستقبل",
      originCityRequired: "مدينة المنشأ مطلوبة",
      destinationCityRequired: "مدينة الوجهة مطلوبة",
      duplicateCities: "المدن المكررة غير مسموح بها",
      failedToCreate: "فشل في إنشاء الرحلة. يرجى المحاولة مرة أخرى.",
    },
  }

  const getText = (key: keyof typeof translations.en) => {
    return translations[language as keyof typeof translations]?.[key] || translations.en[key]
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = getText("fullNameRequired")
    }

    if (!formData.phone.trim()) {
      newErrors.phone = getText("phoneRequired")
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = getText("invalidPhone")
    }

    if (!formData.departureDate) {
      newErrors.departureDate = getText("departureDateRequired")
    } else if (new Date(formData.departureDate) < new Date()) {
      newErrors.departureDate = getText("futureDateRequired")
    }

    if (!stops[0].city) {
      newErrors.originCity = getText("originCityRequired")
    }

    if (!stops[stops.length - 1].city) {
      newErrors.destinationCity = getText("destinationCityRequired")
    }

    // Check for duplicate cities
    const cities = stops.map((s) => s.city).filter(Boolean)
    const duplicates = cities.filter((city, index) => cities.indexOf(city) !== index)
    if (duplicates.length > 0) {
      newErrors.duplicateCities = getText("duplicateCities")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStopChange = (stopId: string, field: keyof TripStop, value: any) => {
    setStops((prev) => prev.map((stop) => (stop.id === stopId ? { ...stop, [field]: value } : stop)))
  }

  const handleLocationSelect = async (stopId: string, location: any) => {
    console.log("[v0] Location selected:", location)
    if (location) {
      handleStopChange(stopId, "city", location.display) // Use display instead of display_name

      if (location.type === "city") {
        handleStopChange(stopId, "cityId", location.id)
        handleStopChange(stopId, "country", location.country)
        // Get country ID by looking up the city's country
        try {
          const { data: cityData } = await supabase.from("cities").select("country_id").eq("id", location.id).single()
          if (cityData) {
            handleStopChange(stopId, "countryId", cityData.country_id)
          }
        } catch (error) {
          console.error("[v0] Error fetching country ID for city:", error)
        }
      } else if (location.type === "country") {
        handleStopChange(stopId, "cityId", null)
        handleStopChange(stopId, "country", location.name)
        handleStopChange(stopId, "countryId", location.id)
      }
    }
  }

  const addIntermediateStop = () => {
    const newStop: TripStop = {
      id: `stop-${Date.now()}`,
      city: "",
      cityId: null,
      country: "",
      countryId: null,
      stopType: "both",
      address: "",
      availability: "",
      instructions: "",
    }

    // Insert before the last stop (destination)
    const newStops = [...stops]
    newStops.splice(-1, 0, newStop)
    setStops(newStops)
  }

  const removeIntermediateStop = (stopId: string) => {
    setStops((prev) => prev.filter((stop) => stop.id !== stopId))
  }

  const moveStop = (dragIndex: number, hoverIndex: number) => {
    const draggedStop = stops[dragIndex]
    const newStops = [...stops]
    newStops.splice(dragIndex, 1)
    newStops.splice(hoverIndex, 0, draggedStop)
    setStops(newStops)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const months = {
      en: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      fr: [
        "janvier",
        "février",
        "mars",
        "avril",
        "mai",
        "juin",
        "juillet",
        "août",
        "septembre",
        "octobre",
        "novembre",
        "décembre",
      ],
      ar: [
        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر",
      ],
    }
    const monthNames = months[language as keyof typeof months] || months.en
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const { data: carrier, error: carrierError } = await supabase
        .from("carriers")
        .insert({
          full_name: formData.fullName,
          username: formData.fullName.replace(/\s/g, "").toLowerCase() + Math.floor(Math.random() * 100),
          phone: formData.phone,
          verified: false,
          total_trips: 0,
        })
        .select()
        .single()

      if (carrierError) throw carrierError

      const urlId = Math.random().toString(36).substring(2, 10)

      const { data: trip, error: tripError } = await supabase
        .from("trips")
        .insert({
          url_id: urlId,
          traveler_id: carrier.id,
          origin_city_id: stops[0].cityId!,
          origin_country_id: stops[0].countryId!,
          destination_city_id: stops[stops.length - 1].cityId!,
          destination_country_id: stops[stops.length - 1].countryId!,
          departure_date: formData.departureDate,
          price_per_kg: 15, // Default price
          currency: "EUR",
          notes: formData.notes,
          status: "active",
        })
        .select()
        .single()

      if (tripError) throw tripError

      const stopInserts = stops.map((stop, index) => ({
        trip_id: trip.id,
        city_id: stop.cityId!,
        country_id: stop.countryId!,
        stop_order: index,
        stop_type: stop.stopType,
        address: stop.address || null,
        availability_time: stop.availability || null,
        instructions: stop.instructions || null,
      }))

      const { error: stopsError } = await supabase.from("trip_stops").insert(stopInserts)

      if (stopsError) throw stopsError

      const contacts = []

      if (formData.phone) {
        contacts.push({
          trip_id: trip.id,
          contact_type: "phone",
          contact_value: formData.phone,
          contact_label: "Phone",
        })
      }

      if (formData.whatsappEnabled && formData.phone) {
        contacts.push({
          trip_id: trip.id,
          contact_type: "whatsapp",
          contact_value: formData.phone,
          contact_label: "WhatsApp",
        })
      }

      if (formData.messenger) {
        contacts.push({
          trip_id: trip.id,
          contact_type: "messenger",
          contact_value: formData.messenger,
          contact_label: "Messenger",
        })
      }

      if (contacts.length > 0) {
        const { error: contactsError } = await supabase.from("trip_contacts").insert(contacts)

        if (contactsError) throw contactsError
      }

      // Success - redirect to trip details
      onTripCreated(trip.id)
    } catch (error) {
      console.error("[v0] Trip creation error:", error)
      setErrors({ submit: getText("failedToCreate") })
    }

    setLoading(false)
  }

  // Drag and drop functionality for reordering stops
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = Number.parseInt(e.dataTransfer.getData("text/plain"))

    if (
      dragIndex !== dropIndex &&
      dragIndex !== 0 &&
      dropIndex !== 0 &&
      dragIndex !== stops.length - 1 &&
      dropIndex !== stops.length - 1
    ) {
      moveStop(dragIndex, dropIndex)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className={`flex items-center gap-4 mb-8 ${isRTL ? "flex-row-reverse" : ""}`}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
          {getText("cancel")}
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{getText("newTripEntry")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Carrier Info Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className={`text-xl font-semibold text-gray-900 mb-6 ${isRTL ? "text-right" : ""}`}>
            {getText("carrierInformation")}
          </h2>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isRTL ? "md:grid-flow-col-dense" : ""}`}>
            {/* Full Name Field */}
            <div className={isRTL ? "md:col-start-2" : ""}>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? "text-right" : ""}`}>
                {getText("fullName")} *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullName ? "border-red-500" : ""} ${isRTL ? "text-right" : ""}`}
                placeholder={getText("enterFullName")}
                dir={isRTL ? "rtl" : "ltr"}
              />
              {errors.fullName && (
                <p className={`text-red-500 text-sm mt-1 ${isRTL ? "text-right" : ""}`}>{errors.fullName}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div className={isRTL ? "md:col-start-1 md:row-start-1" : ""}>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? "text-right" : ""}`}>
                {getText("phoneNumber")} *
              </label>
              <div className="relative">
                <Phone
                  className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`}
                />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  className={`w-full ${isRTL ? "pr-10 pl-3" : "pl-10 pr-3"} py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? "border-red-500" : ""}`}
                  placeholder="+33 6 12 34 56 78"
                  dir="ltr" // Force left-to-right for phone numbers
                />
              </div>
              {errors.phone && (
                <p className={`text-red-500 text-sm mt-1 ${isRTL ? "text-right" : ""}`}>{errors.phone}</p>
              )}

              <div className={`flex items-center mt-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <input
                  type="checkbox"
                  id="whatsapp"
                  checked={formData.whatsappEnabled}
                  onChange={(e) => setFormData((prev) => ({ ...prev, whatsappEnabled: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="whatsapp"
                  className={`${isRTL ? "mr-2" : "ml-2"} text-sm text-gray-700 flex items-center gap-1`}
                >
                  <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  {getText("availableOnWhatsApp")}
                </label>
              </div>
            </div>

            {/* Messenger Field */}
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? "text-right" : ""}`}>
                {getText("messenger")}
                <a
                  href="https://www.facebook.com/profile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-4 w-4 inline" />
                </a>
              </label>
              <div className="relative">
                <ExternalLink
                  className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`}
                />
                <input
                  type="text"
                  value={formData.messenger}
                  onChange={(e) => setFormData((prev) => ({ ...prev, messenger: e.target.value }))}
                  className={`w-full ${isRTL ? "pr-10 pl-3" : "pl-10 pr-3"} py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="facebook.com/username" // Updated placeholder
                  dir="ltr" // Force left-to-right for messenger username
                />
              </div>
            </div>
          </div>
        </div>

        {/* Trip Info Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className={`text-xl font-semibold text-gray-900 mb-6 ${isRTL ? "text-right" : ""}`}>
            {getText("tripInformation")}
          </h2>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isRTL ? "md:grid-flow-col-dense" : ""}`}>
            {/* Notes Field */}
            <div className={isRTL ? "md:col-start-2" : ""}>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? "text-right" : ""}`}>
                {getText("notes")}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? "text-right" : ""}`}
                placeholder={getText("additionalTripInfo")}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </div>

            {/* Departure Date Field */}
            <div className={isRTL ? "md:col-start-1 md:row-start-1" : ""}>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? "text-right" : ""}`}>
                {getText("departureDate")} *
              </label>
              <div className="relative">
                <Calendar
                  className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400`}
                />
                <input
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, departureDate: e.target.value }))}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full ${isRTL ? "pr-10 pl-3 text-right" : "pl-10 pr-3"} py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.departureDate ? "border-red-500" : ""}`}
                />
              </div>
              {errors.departureDate && (
                <p className={`text-red-500 text-sm mt-1 ${isRTL ? "text-right" : ""}`}>{errors.departureDate}</p>
              )}
              {formData.departureDate && (
                <p className={`text-sm text-gray-600 mt-1 ${isRTL ? "text-right" : ""}`}>
                  {formatDate(formData.departureDate)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
            <h2 className="text-xl font-semibold text-gray-900">{getText("tripStops")}</h2>
            <button
              type="button"
              onClick={addIntermediateStop}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              {getText("addStop")}
            </button>
          </div>

          {errors.duplicateCities && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className={`text-red-600 text-sm ${isRTL ? "text-right" : ""}`}>{errors.duplicateCities}</p>
            </div>
          )}

          <div className="relative">
            {/* Timeline line */}
            <div className={`absolute ${isRTL ? "right-6" : "left-6"} top-8 bottom-8 w-0.5 bg-gray-300`}></div>

            <div className="space-y-6">
              {stops.map((stop, index) => (
                <div
                  key={stop.id}
                  className="relative"
                  draggable={index !== 0 && index !== stops.length - 1} // Only intermediate stops are draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  {/* Timeline dot */}
                  <div
                    className={`absolute ${isRTL ? "right-4" : "left-4"} w-4 h-4 rounded-full border-2 border-white shadow-md ${
                      stop.stopType === "pickup"
                        ? "bg-green-500"
                        : stop.stopType === "dropoff"
                          ? "bg-red-500"
                          : "bg-blue-500"
                    }`}
                  ></div>

                  <div className={`${isRTL ? "mr-12" : "ml-12"} border border-gray-200 rounded-lg p-4`}>
                    <div className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        {index !== 0 && index !== stops.length - 1 && (
                          <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                        )}
                        <span className="font-medium text-gray-900">
                          {index === 0
                            ? getText("origin")
                            : index === stops.length - 1
                              ? getText("destination")
                              : `${getText("stop")} ${index}`}
                        </span>

                        <select
                          value={stop.stopType}
                          onChange={(e) =>
                            handleStopChange(stop.id, "stopType", e.target.value as "pickup" | "dropoff" | "both")
                          }
                          className={`px-2 py-1 text-xs border border-gray-300 rounded ${isRTL ? "text-right" : ""}`}
                          dir={isRTL ? "rtl" : "ltr"}
                        >
                          <option value="pickup">{getText("pickup")}</option>
                          <option value="dropoff">{getText("dropoff")}</option>
                          <option value="both">{getText("both")}</option>
                        </select>
                      </div>

                      {index !== 0 && index !== stops.length - 1 && (
                        <button
                          type="button"
                          onClick={() => removeIntermediateStop(stop.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? "text-right" : ""}`}>
                          {getText("city")} *
                        </label>
                        <AutocompleteInput
                          value={stop.city}
                          onChange={(value) => handleStopChange(stop.id, "city", value)}
                          onSelect={(location) => handleLocationSelect(stop.id, location)}
                          placeholder={getText("searchCity")}
                          className={errors[`${stop.id}City`] ? "border-red-500" : ""}
                        />
                        {errors[`${stop.id}City`] && (
                          <p className={`text-red-500 text-sm mt-1 ${isRTL ? "text-right" : ""}`}>
                            {errors[`${stop.id}City`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? "text-right" : ""}`}>
                          {getText("address")}
                        </label>
                        <input
                          type="text"
                          value={stop.address}
                          onChange={(e) => handleStopChange(stop.id, "address", e.target.value)}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? "text-right" : ""}`}
                          placeholder={getText("specificAddress")}
                          dir={isRTL ? "rtl" : "ltr"}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? "text-right" : ""}`}>
                          {getText("availability")}
                        </label>
                        <input
                          type="datetime-local"
                          value={stop.availability}
                          onChange={(e) => handleStopChange(stop.id, "availability", e.target.value)}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? "text-right" : ""}`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? "text-right" : ""}`}>
                          {getText("instructions")}
                        </label>
                        <textarea
                          value={stop.instructions}
                          onChange={(e) => handleStopChange(stop.id, "instructions", e.target.value)}
                          rows={2}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? "text-right" : ""}`}
                          placeholder={getText("specialInstructions")}
                          dir={isRTL ? "rtl" : "ltr"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className={`text-red-600 text-sm ${isRTL ? "text-right" : ""}`}>{errors.submit}</p>
            </div>
          )}

          <div className={`flex gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              {getText("cancel")}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {getText("creating")}
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  {getText("createTrip")}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
