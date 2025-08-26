"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { MapPin, X } from "lucide-react"
import { searchLocations } from "../services/tripService"

interface AutocompleteInputProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (location: any) => void // Added onSelect prop for location selection
  placeholder: string
  label?: string // Made label optional since TripEntryForm doesn't always provide it
  className?: string
  isRTL?: boolean
}

interface LocationResult {
  type: "city" | "country"
  id: number
  name: string
  country?: string
  display: string
  display_name?: string
  city_id?: number
  country_id?: number
  country_name?: string
}

export function AutocompleteInput({
  value,
  onChange,
  onSelect,
  placeholder,
  label,
  className = "",
  isRTL = false,
}: AutocompleteInputProps) {
  const inputValue = value || ""

  const [suggestions, setSuggestions] = useState<LocationResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const searchPlaces = async (query: string) => {
    // Reduced minimum length from 2 to 1 for better autocomplete UX
    if (query.length < 1) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const language = isRTL ? "ar" : "en"
      const results = await searchLocations(query, language)
      setSuggestions(results)
    } catch (error) {
      console.error("Error fetching places:", error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout for debounced search
    timeoutRef.current = setTimeout(() => {
      searchPlaces(newValue)
      setShowSuggestions(true)
    }, 300)
  }

  const handleSuggestionClick = (suggestion: LocationResult) => {
    const displayValue = suggestion.display
    onChange(displayValue)

    if (onSelect) {
      onSelect(suggestion)
    }

    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking
    setTimeout(() => {
      setShowSuggestions(false)
    }, 200)
  }

  const clearInput = () => {
    onChange("")
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="relative">
      {label && (
        <label className={`block text-sm font-semibold text-gray-700 mb-3 ${isRTL ? "text-right" : "text-left"}`}>
          {label}
        </label>
      )}

      <div className="relative">
        <div
          className={`absolute inset-y-0 ${isRTL ? "right-0 pr-3" : "left-0 pl-3"} flex items-center pointer-events-none`}
        >
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className={`w-full ${isRTL ? "pr-10 pl-10" : "pl-10 pr-10"} py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            isRTL ? "text-right" : "text-left"
          } ${className}`}
          required
        />

        {inputValue && (
          <button
            type="button"
            onClick={clearInput}
            className={`absolute inset-y-0 ${isRTL ? "left-0 pl-3" : "right-0 pr-3"} flex items-center`}
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}

        {loading && (
          <div className={`absolute inset-y-0 ${isRTL ? "left-8 pl-3" : "right-8 pr-3"} flex items-center`}>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-3 ${
                isRTL ? "space-x-reverse flex-row-reverse text-right" : ""
              }`}
            >
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-900">{suggestion.display}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
