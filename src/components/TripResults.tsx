"use client"
import type { SearchResults } from "../types"
import { TripCard } from "./TripCard"
import { useLanguage } from "../context/LanguageContext"
import { Package } from "lucide-react"

interface TripResultsProps {
  searchResults: SearchResults
  onTripSelect: (tripId: string) => void
  loading?: boolean
  onBackToSearch?: () => void
}

export function TripResults({ searchResults, onTripSelect, loading, onBackToSearch }: TripResultsProps) {
  const { t, language, translateCountry } = useLanguage()
  const isRTL = language === "ar"

  const { exactMatches, countryMatches, searchCountries } = searchResults
  const totalTrips = exactMatches.length + countryMatches.length

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{t("loading")}</p>
      </div>
    )
  }

  if (totalTrips === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("noResults")}</h3>
        <p className="text-gray-600">{t("tryAdjusting")}</p>
        {onBackToSearch && (
          <button
            onClick={onBackToSearch}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("backToSearch")}
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className={`mb-6 ${isRTL ? "text-right" : ""}`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("searchResults")}</h2>
        <p className="text-gray-600">
          {t("foundTrips")} {totalTrips} {totalTrips === 1 ? t("trip") : t("trips")} {t("tripsMatching")}
        </p>
      </div>

      {/* Section 1: Exact Matches */}
      {exactMatches.length > 0 && (
        <div className="mb-8">
          <h3 className={`text-xl font-semibold text-gray-900 mb-4 ${isRTL ? "text-right" : ""}`}>
            {t("directMatches")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exactMatches.map((trip) => (
              <TripCard key={trip.id} trip={trip} onClick={onTripSelect} />
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Country Matches */}
      {countryMatches.length > 0 && (
        <div className="mb-8">
          <h3 className={`text-xl font-semibold text-gray-900 mb-4 ${isRTL ? "text-right" : ""}`}>
            {t("otherRoutesBetween")} {translateCountry(searchCountries.origin)} {t("and")}{" "}
            {translateCountry(searchCountries.destination)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countryMatches.map((trip) => (
              <TripCard key={trip.id} trip={trip} onClick={onTripSelect} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
