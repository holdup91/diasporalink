"use client"

import React from "react"
import { MapPin, Calendar, User, ArrowRight, ArrowLeft } from "lucide-react"
import type { Trip } from "../types"
import { useLanguage } from "../context/LanguageContext"
import { formatDate, getDaysUntilDeparture } from "../utils/dateUtils"

interface TripCardProps {
  trip: Trip
  onClick: (tripId: string) => void
}

export function TripCard({ trip, onClick }: TripCardProps) {
  const { t, language, translateCity, translateCountry } = useLanguage()
  const isRTL = language === "ar"

  const daysUntil = getDaysUntilDeparture(trip.departureDate)
  const formattedDate = formatDate(trip.departureDate, language)

  const originCity = translateCity(trip.route.origin.city)
  const originCountry = translateCountry(trip.route.origin.country)
  const destinationCity = translateCity(trip.route.destination.city)
  const destinationCountry = translateCountry(trip.route.destination.country)

  const getCountrySequence = () => {
    const countryFlags = {
      Algeria: "🇩🇿",
      Tunisia: "🇹🇳",
      Morocco: "🇲🇦",
      France: "🇫🇷",
      Spain: "🇪🇸",
      Italy: "🇮🇹",
      Germany: "🇩🇪",
      Belgium: "🇧🇪",
      Netherlands: "🇳🇱",
      Switzerland: "🇨🇭",
      Austria: "🇦🇹",
      Portugal: "🇵🇹",
      Sweden: "🇸🇪",
      Denmark: "🇩🇰",
    }

    // Use allCountries if available, otherwise fallback to origin/destination
    const countries = trip.route.allCountries || [trip.route.origin.country]

    if (!trip.route.allCountries) {
      // Add stop countries in order
      trip.route.stops.forEach((stop) => {
        if (!countries.includes(stop.country)) {
          countries.push(stop.country)
        }
      })

      // Add destination country if not already included
      if (!countries.includes(trip.route.destination.country)) {
        countries.push(trip.route.destination.country)
      }
    }

    const flags = countries.map((country) => countryFlags[country as keyof typeof countryFlags] || "🏳️")
    return isRTL ? flags.reverse() : flags
  }

  // Build city route sequence
  const getCityRoute = () => {
    const cities = [
      translateCity(trip.route.origin.city),
      ...trip.route.stops.map((stop) => translateCity(stop.city)),
      translateCity(trip.route.destination.city),
    ]
    return isRTL ? cities.reverse() : cities
  }
  const countryFlags = getCountrySequence()
  const cityRoute = getCityRoute()

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer border border-gray-100 p-6"
      onClick={() => onClick(trip.id)}
    >
      {trip.urlId && (
        <div className={`text-xs text-gray-500 mb-2 ${isRTL ? "text-right" : "text-left"}`}>
          {t("tripRef")}: {trip.urlId}
        </div>
      )}

      <div className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className={`flex items-center space-x-3 ${isRTL ? "space-x-reverse" : ""}`}>
          {countryFlags.map((flag, index) => (
            <React.Fragment key={index}>
              {index > 0 &&
                (isRTL ? (
                  <ArrowLeft className="h-4 w-4 text-gray-400" />
                ) : (
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                ))}
              <span className="text-2xl">{flag}</span>
            </React.Fragment>
          ))}
        </div>
        <div className={`text-sm text-green-600 font-semibold ${isRTL ? "text-right" : "text-left"}`}>
          {t("departsIn")} {daysUntil} {t("days")}
        </div>
      </div>

      {/* Route with city details */}
      <div className={`mb-3 ${isRTL ? "text-right" : "text-left"}`}>
        <div className={`flex items-center space-x-2 mb-2 ${isRTL ? "space-x-reverse flex-row-reverse" : ""}`}>
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{t("route")}</span>
        </div>

        <div className={`flex items-center text-sm flex-wrap gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
          {cityRoute.map((city, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-gray-400 mx-1 flex-shrink-0">{isRTL ? "←" : "→"}</span>}
              <span className="text-gray-700 text-xs break-words">{city}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className={`flex items-center space-x-2 mb-3 ${isRTL ? "space-x-reverse flex-row-reverse" : ""}`}>
        <User className="h-4 w-4 text-gray-500" />
        <span className="text-gray-700">@{trip.travelerUsername}</span>
      </div>

      <div className={`flex items-center space-x-2 mb-4 ${isRTL ? "space-x-reverse flex-row-reverse" : ""}`}>
        <Calendar className="h-4 w-4 text-gray-500" />
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">{t("departureDate")}</div>
          <div className="text-gray-700 font-medium">{formattedDate}</div>
        </div>
      </div>

      <div className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className={`text-lg font-bold text-blue-600 ${isRTL ? "text-right" : "text-left"}`}>
          {trip.pricePerKg}
          {trip.currency === "EUR"
            ? "€"
            : trip.currency === "TND"
              ? "د.ت"
              : trip.currency === "DZD"
                ? "د.ج"
                : trip.currency === "CHF"
                  ? "CHF"
                  : trip.currency === "MAD"
                    ? "د.م"
                    : trip.currency === "USD"
                      ? "$"
                      : trip.currency}
          {t("perKg")}
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          {t("contact")}
        </button>
      </div>
    </div>
  )
}
