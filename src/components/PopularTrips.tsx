"use client"

import { useState } from "react"
import { ArrowRight, ArrowLeft, TrendingUp } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import type { SearchFilters } from "../types"

interface PopularTripsProps {
  onRouteSelect: (filters: SearchFilters) => void
}

interface PopularRoute {
  origin: {
    name: { en: string; fr: string; ar: string }
    flag: string
  }
  destination: {
    name: { en: string; fr: string; ar: string }
    flag: string
  }
  searchFilters: SearchFilters
}

const popularRoutes: PopularRoute[] = [
  {
    origin: { name: { en: "Algeria", fr: "Algérie", ar: "الجزائر" }, flag: "🇩🇿" },
    destination: { name: { en: "France", fr: "France", ar: "فرنسا" }, flag: "🇫🇷" },
    searchFilters: { origin: "Algeria", destination: "France", departureDate: "" },
  },
  {
    origin: { name: { en: "Morocco", fr: "Maroc", ar: "المغرب" }, flag: "🇲🇦" },
    destination: { name: { en: "Spain", fr: "Espagne", ar: "إسبانيا" }, flag: "🇪🇸" },
    searchFilters: { origin: "Morocco", destination: "Spain", departureDate: "" },
  },
  {
    origin: { name: { en: "France", fr: "France", ar: "فرنسا" }, flag: "🇫🇷" },
    destination: { name: { en: "Morocco", fr: "Maroc", ar: "المغرب" }, flag: "🇲🇦" },
    searchFilters: { origin: "France", destination: "Morocco", departureDate: "" },
  },
  {
    origin: { name: { en: "Tunisia", fr: "Tunisie", ar: "تونس" }, flag: "🇹🇳" },
    destination: { name: { en: "Italy", fr: "Italie", ar: "إيطاليا" }, flag: "🇮🇹" },
    searchFilters: { origin: "Tunisia", destination: "Italy", departureDate: "" },
  },
  {
    origin: { name: { en: "Algeria", fr: "Algérie", ar: "الجزائر" }, flag: "🇩🇿" },
    destination: { name: { en: "Spain", fr: "Espagne", ar: "إسبانيا" }, flag: "🇪🇸" },
    searchFilters: { origin: "Algeria", destination: "Spain", departureDate: "" },
  },
  {
    origin: { name: { en: "Morocco", fr: "Maroc", ar: "المغرب" }, flag: "🇲🇦" },
    destination: { name: { en: "France", fr: "France", ar: "فرنسا" }, flag: "🇫🇷" },
    searchFilters: { origin: "Morocco", destination: "France", departureDate: "" },
  },
  {
    origin: { name: { en: "Germany", fr: "Allemagne", ar: "ألمانيا" }, flag: "🇩🇪" },
    destination: { name: { en: "Algeria", fr: "Algérie", ar: "الجزائر" }, flag: "🇩🇿" },
    searchFilters: { origin: "Germany", destination: "Algeria", departureDate: "" },
  },
  {
    origin: { name: { en: "Belgium", fr: "Belgique", ar: "بلجيكا" }, flag: "🇧🇪" },
    destination: { name: { en: "Morocco", fr: "Maroc", ar: "المغرب" }, flag: "🇲🇦" },
    searchFilters: { origin: "Belgium", destination: "Morocco", departureDate: "" },
  },
]

export function PopularTrips({ onRouteSelect }: PopularTripsProps) {
  const { t, language } = useLanguage()
  const isRTL = language === "ar"
  const [loadingRoute, setLoadingRoute] = useState<string | null>(null)

  const handleRouteClick = async (route: PopularRoute, index: number) => {
    const routeKey = `${route.origin.name.en}-${route.destination.name.en}`
    setLoadingRoute(routeKey)

    await new Promise((resolve) => setTimeout(resolve, 500))

    onRouteSelect(route.searchFilters)
    setLoadingRoute(null)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mt-8">
      <div className={`flex items-center space-x-3 mb-6 ${isRTL ? "space-x-reverse flex-row-reverse" : ""}`}>
        <TrendingUp className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          {language === "en" ? "Popular Routes" : language === "fr" ? "Routes Populaires" : "الطرق الشائعة"}
        </h2>
      </div>

      <p className={`text-gray-600 mb-6 ${isRTL ? "text-right" : ""}`}>
        {language === "en"
          ? "Discover the most searched travel routes"
          : language === "fr"
            ? "Découvrez les itinéraires de voyage les plus recherchés"
            : "اكتشف طرق السفر الأكثر بحثاً"}
      </p>

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${isRTL ? "justify-items" : ""}`}>
        {popularRoutes.map((route, index) => {
          const routeKey = `${route.origin.name.en}-${route.destination.name.en}`
          const isLoading = loadingRoute === routeKey

          return (
            <button
              key={index}
              onClick={() => handleRouteClick(route, index)}
              disabled={isLoading}
              className={`group bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all transform hover:scale-105 hover:shadow-md ${isRTL ? "text-right" : ""} ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-xl">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              )}

              <div className={`flex items-center gap-4 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                {isRTL ? (
                  <>
                    <span className="text-2xl">{route.origin.flag}</span>
                    <ArrowLeft className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-2xl">{route.destination.flag}</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">{route.origin.flag}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <span className="text-2xl">{route.destination.flag}</span>
                  </>
                )}
              </div>

              <div
                className={`text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors ${isRTL ? "text-right" : "text-left"}`}
              >
                {`${route.origin.name[language]} ${isRTL ? "←" : "→"} ${route.destination.name[language]}`}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
