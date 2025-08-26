"use client"
import { ArrowLeft, ArrowRight, MapPin, Calendar, User, Clock, MessageSquare } from "lucide-react"
import React from "react"

import type { Trip } from "../types"
import { useLanguage } from "../context/LanguageContext"
import { formatDate } from "../utils/dateUtils"
import { logContactClick } from "../services/tripService"
import { getContactColor, getContactIcon } from "../utils/contactUtils"

interface TripDetailsProps {
  trip: Trip
  onBack: () => void
}

export function TripDetails({ trip, onBack }: TripDetailsProps) {
  const { t, language, translateCity, translateCountry } = useLanguage()
  const isRTL = language === "ar"

  const formattedDate = formatDate(trip.departureDate, language)

  const originCity = translateCity(trip.route.origin.city)
  const originCountry = translateCountry(trip.route.origin.country)
  const destinationCity = translateCity(trip.route.destination.city)
  const destinationCountry = translateCountry(trip.route.destination.country)

  const getEmojiRoute = () => {
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

    const countries =
      trip.route.allCountries ||
      [
        trip.route.origin.country,
        ...trip.route.stops.map((stop) => stop.country).filter((country, index, arr) => arr.indexOf(country) === index),
        trip.route.destination.country,
      ].filter((country, index, arr) => arr.indexOf(country) === index)

    return countries.map((country) => countryFlags[country as keyof typeof countryFlags] || "🏳️")
  }

  const getCurrencySymbol = (currency: string) => {
    const symbols = {
      EUR: "€",
      TND: "د.ت",
      DZD: "د.ج",
      CHF: "CHF",
      MAD: "د.م",
      USD: "$",
    }
    return symbols[currency as keyof typeof symbols] || currency
  }

  // Reorder contacts for RTL - phone first, then WhatsApp, then Messenger
  const orderedContacts = isRTL
    ? [...trip.contacts].sort((a, b) => {
        const order = { phone: 0, whatsapp: 1, messenger: 2 }
        return (order[a.type as keyof typeof order] || 3) - (order[b.type as keyof typeof order] || 3)
      })
    : trip.contacts

  const emojiFlags = getEmojiRoute()

  return (
    <div>
      {/* Back to Search Button - Outside the card */}
      <button
        onClick={onBack}
        className={`flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 ${isRTL ? "space-x-reverse" : ""}`}
      >
        {isRTL ? (
          <>
            <ArrowLeft className="h-5 w-5" />
            <span>{t("backToSearch")}</span>
          </>
        ) : (
          <>
            <ArrowLeft className="h-5 w-5" />
            <span>{t("backToSearch")}</span>
          </>
        )}
      </button>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className={`flex items-center justify-center ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`flex items-center space-x-3 ${isRTL ? "space-x-reverse flex-row-reverse" : ""}`}>
              {emojiFlags.map((flag, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (isRTL ? <ArrowLeft className="h-6 w-6" /> : <ArrowRight className="h-6 w-6" />)}
                  <span className="text-3xl">{flag}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Trip Reference */}
          {trip.urlId && (
            <div className={`${isRTL ? "text-right" : "text-left"}`}>
              <span className="text-sm text-gray-600">
                {language === "en" ? "Trip Reference" : language === "fr" ? "Référence du voyage" : "مرجع الرحلة"}:{" "}
                <span className="font-mono font-semibold text-gray-900">{trip.urlId}</span>
              </span>
            </div>
          )}

          {/* 3-Column Layout */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${isRTL ? "md:grid-flow-col-dense" : ""}`}>
            <div className={`bg-gray-50 rounded-lg p-4 ${isRTL ? "md:order-3 text-right" : "md:order-1"}`}>
              <div
                className={`flex items-center space-x-3 mb-2 ${isRTL ? "space-x-reverse flex-row-reverse justify-end" : ""}`}
              >
                <User className="h-5 w-5 text-gray-500" />
                {/* Carrier */}
                <span className="text-sm font-medium text-gray-700">
                  {language === "en" ? "Carrier" : language === "fr" ? "Transporteur" : "شركة النقل"}
                </span>
              </div>
              <div className={`${isRTL ? "text-right" : ""}`}>
                <div className="font-semibold text-gray-900">{trip.travelerName}</div>
                <div className="text-gray-600">@{trip.travelerUsername}</div>
              </div>
            </div>

            <div className={`bg-gray-50 rounded-lg p-4 ${isRTL ? "md:order-2 text-right" : "md:order-2"}`}>
              <div
                className={`flex items-center space-x-3 mb-2 ${isRTL ? "space-x-reverse flex-row-reverse justify-end" : ""}`}
              >
                <Calendar className="h-5 w-5 text-gray-500" />
                {/* Departure Date */}
                <span className={`text-sm font-medium text-gray-700 ${isRTL ? "text-right" : "text-left"}`}>
                  {language === "en" ? "Departure Date" : language === "fr" ? "Date de départ" : "تاريخ المغادرة"}
                </span>
              </div>
              <div className={`font-semibold text-gray-900 ${isRTL ? "text-right" : ""}`}>{formattedDate}</div>
            </div>

            <div className={`bg-blue-50 rounded-lg p-4 ${isRTL ? "md:order-1 text-right" : "md:order-3"}`}>
              <div
                className={`flex items-center space-x-3 mb-2 ${isRTL ? "space-x-reverse flex-row-reverse justify-end" : ""}`}
              >
                <div className="h-5 w-5 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-bold">{getCurrencySymbol(trip.currency)}</span>
                </div>
                {/* Price */}
                <span className={`text-sm font-medium text-gray-700 ${isRTL ? "text-right" : "text-left"}`}>
                  {language === "en" ? "Price" : language === "fr" ? "Prix" : "السعر"}
                </span>
              </div>
              <div className={`text-2xl font-bold text-blue-600 ${isRTL ? "text-right" : ""}`}>
                {trip.pricePerKg}
                {getCurrencySymbol(trip.currency)}
                {language === "en" ? "/kg" : language === "fr" ? "/kg" : "/كغ"}
              </div>
            </div>
          </div>

          {/* Contact Options */}
          <div>
            <h3 className={`text-lg font-semibold text-gray-900 mb-4 ${isRTL ? "text-right" : ""}`}>
              {language === "en" ? "Contact Options" : language === "fr" ? "Options de contact" : "خيارات الاتصال"}
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {orderedContacts.map((contact, index) => (
                <button
                  key={index}
                  className={`${getContactColor(contact.type)} text-white p-2 sm:p-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 sm:gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                  onClick={() => {
                    logContactClick(trip.id, contact.type)

                    if (contact.type === "whatsapp") {
                      window.open(`https://wa.me/${contact.value}`, "_blank")
                    } else if (contact.type === "messenger") {
                      window.open(`https://m.me/${contact.value}`, "_blank")
                    } else if (contact.type === "phone") {
                      window.open(`tel:${contact.value}`, "_blank")
                    }
                  }}
                >
                  {getContactIcon(contact.type)}
                  {/* Contact Labels */}
                  <span className="hidden sm:inline">
                    {contact.type === "phone"
                      ? language === "en"
                        ? "Phone"
                        : language === "fr"
                          ? "Téléphone"
                          : "هاتف"
                      : contact.type === "whatsapp"
                        ? "WhatsApp contact"
                        : contact.type === "messenger"
                          ? "Messenger"
                          : contact.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Route */}
          <div>
            <h3
              className={`text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2 ${isRTL ? "space-x-reverse flex-row-reverse text-right" : ""}`}
            >
              <MapPin className="h-5 w-5" />
              <span>{t("route")}</span>
            </h3>

            {/* Timeline Design */}
            <div className="relative">
              {/* Vertical line */}
              <div className={`absolute ${isRTL ? "right-4" : "left-4"} top-0 bottom-0 w-0.5 bg-gray-200`}></div>

              <div className="space-y-6">
                {/* Origin */}
                <div className={`relative flex items-start ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className={`${isRTL ? "ml-6" : "mr-6"} flex-shrink-0`}>
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center relative z-10">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                  </div>
                  <div
                    className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex-1 ${isRTL ? "text-right" : ""}`}
                  >
                    <div className="font-semibold text-gray-900">{originCity}</div>
                    <div className="text-sm text-gray-600">{originCountry}</div>
                    <div className="text-xs text-green-600 font-medium mt-1">{t("pickup")}</div>

                    {trip.route.origin.address && (
                      <div
                        className={`mt-2 text-xs text-gray-500 flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <MapPin className="h-3 w-3" />
                        <span>
                          {t("address")}: {trip.route.origin.address}
                        </span>
                      </div>
                    )}

                    {trip.route.origin.availabilityTime && (
                      <div
                        className={`mt-1 text-xs text-gray-500 flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <Clock className="h-3 w-3" />
                        <span>
                          {t("availabilityTime")}: {trip.route.origin.availabilityTime}
                        </span>
                      </div>
                    )}

                    {trip.route.origin.instructions && (
                      <div
                        className={`mt-1 text-xs text-gray-500 flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>
                          {t("instructions")}: {trip.route.origin.instructions}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stops */}
                {trip.route.stops.map((stop, index) => (
                  <div key={index} className={`relative flex items-start ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div className={`${isRTL ? "ml-6" : "mr-6"} flex-shrink-0`}>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                          stop.type === "pickup"
                            ? "bg-green-400"
                            : stop.type === "dropoff"
                              ? "bg-red-400"
                              : "bg-blue-500"
                        }`}
                      >
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      </div>
                    </div>
                    <div
                      className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex-1 ${isRTL ? "text-right" : ""}`}
                    >
                      <div className="font-semibold text-gray-900">{translateCity(stop.city)}</div>
                      <div className="text-sm text-gray-600">{translateCountry(stop.country)}</div>
                      <div
                        className={`text-xs font-medium mt-1 ${
                          stop.type === "pickup"
                            ? "text-green-600"
                            : stop.type === "dropoff"
                              ? "text-red-600"
                              : "text-blue-600"
                        }`}
                      >
                        {stop.type === "pickup"
                          ? t("pickup")
                          : stop.type === "dropoff"
                            ? t("dropoff")
                            : `${t("pickup")} & ${t("dropoff")}`}
                      </div>

                      {stop.address && (
                        <div
                          className={`mt-2 text-xs text-gray-500 flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <MapPin className="h-3 w-3" />
                          <span>
                            {t("address")}: {stop.address}
                          </span>
                        </div>
                      )}

                      {stop.availabilityTime && (
                        <div
                          className={`mt-1 text-xs text-gray-500 flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <Clock className="h-3 w-3" />
                          <span>
                            {t("availabilityTime")}: {stop.availabilityTime}
                          </span>
                        </div>
                      )}

                      {stop.instructions && (
                        <div
                          className={`mt-1 text-xs text-gray-500 flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          <MessageSquare className="h-3 w-3" />
                          <span>
                            {t("instructions")}: {stop.instructions}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Destination */}
                <div className={`relative flex items-start ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className={`${isRTL ? "ml-6" : "mr-6"} flex-shrink-0`}>
                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center relative z-10">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                  </div>
                  <div
                    className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex-1 ${isRTL ? "text-right" : ""}`}
                  >
                    <div className="font-semibold text-gray-900">{destinationCity}</div>
                    <div className="text-sm text-gray-600">{destinationCountry}</div>
                    <div className="text-xs text-red-600 font-medium mt-1">{t("dropoff")}</div>

                    {trip.route.destination.address && (
                      <div
                        className={`mt-2 text-xs text-gray-500 flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <MapPin className="h-3 w-3" />
                        <span>
                          {t("address")}: {trip.route.destination.address}
                        </span>
                      </div>
                    )}

                    {trip.route.destination.availabilityTime && (
                      <div
                        className={`mt-1 text-xs text-gray-500 flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <Clock className="h-3 w-3" />
                        <span>
                          {t("availabilityTime")}: {trip.route.destination.availabilityTime}
                        </span>
                      </div>
                    )}

                    {trip.route.destination.instructions && (
                      <div
                        className={`mt-1 text-xs text-gray-500 flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <MessageSquare className="h-3 w-3" />
                        <span>
                          {t("instructions")}: {trip.route.destination.instructions}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {trip.notes && (
            <div>
              <h3 className={`text-lg font-semibold text-gray-900 mb-3 ${isRTL ? "text-right" : ""}`}>{t("notes")}</h3>
              <p className={`text-gray-700 bg-gray-50 p-4 rounded-lg ${isRTL ? "text-right" : ""}`}>{trip.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
