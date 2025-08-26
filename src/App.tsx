"use client"

//src/App.tsx

import { useState } from "react"
import { LanguageProvider, useLanguage } from "./context/LanguageContext"
import { LanguageToggle } from "./components/LanguageToggle"
import { SearchForm } from "./components/SearchForm"
import { TripResults } from "./components/TripResults"
import { TripDetails } from "./components/TripDetails"
import { PopularTrips } from "./components/PopularTrips"
import { TripEntryForm } from "./components/TripEntryForm"
import type { SearchFilters, Trip, SearchResults } from "./types"
import { searchTrips, logTripView } from "./services/tripService"
import { Package } from "lucide-react"

type View = "search" | "results" | "details" | "trip-entry"

function AppContent() {
  const { t, language } = useLanguage()
  const [currentView, setCurrentView] = useState<View>("search")
  const [searchResults, setSearchResults] = useState<SearchResults>({
    exactMatches: [],
    countryMatches: [],
    searchCountries: { origin: "", destination: "" },
  })
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (filters: SearchFilters) => {
    setLoading(true)

    try {
      console.log("[v0] Starting search with filters:", filters)

      const searchFilters = { ...filters, language }
      const results = await searchTrips(searchFilters)

      console.log(
        "[v0] Search completed - Exact:",
        results.exactMatches.length,
        "Country:",
        results.countryMatches.length,
      )

      setSearchResults(results)
      setCurrentView("results")
    } catch (error) {
      console.error("[v0] Search error:", error)
      setSearchResults({
        exactMatches: [],
        countryMatches: [],
        searchCountries: { origin: "", destination: "" },
      })
      setCurrentView("results")
    }

    setLoading(false)
  }

  const handleTripSelect = (tripId: string) => {
    const trip = [...searchResults.exactMatches, ...searchResults.countryMatches].find((t) => t.id === tripId)
    if (trip) {
      // Log trip view analytics
      logTripView(tripId)
      setSelectedTrip(trip)
      setCurrentView("details")
    }
  }

  const handleBackToSearch = () => {
    setCurrentView("search")
    setSearchResults({
      exactMatches: [],
      countryMatches: [],
      searchCountries: { origin: "", destination: "" },
    })
    setSelectedTrip(null)
  }

  const handleBackToResults = () => {
    setCurrentView("results")
    setSelectedTrip(null)
  }

  const handleTripCreated = (tripId: string) => {
    // Find the created trip and show details
    setCurrentView("details")
    // In a real app, you'd fetch the trip details here
  }

  const handleAddTrip = () => {
    setCurrentView("trip-entry")
  }

  const getAddTripText = () => {
    switch (language) {
      case "ar":
        return "إضافة رحلة"
      case "fr":
        return "Ajouter un voyage"
      default:
        return "Add Trip"
    }
  }

  const getHeadline = () => {
    switch (language) {
      case "ar":
        return "اعثر على سائق التوصيل المناسب في ثوانٍ"
      case "fr":
        return "Trouvez rapidement le transporteur idéal pour vos besoins"
      default:
        return "Find the Right Driver in Seconds"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={handleBackToSearch}>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">DiasporaLink</h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleAddTrip}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {getAddTripText()}
              </button>
              <LanguageToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "search" && (
          <div className="max-w-2xl mx-auto">
            <SearchForm onSearch={handleSearch} />
            <PopularTrips onRouteSelect={handleSearch} />
          </div>
        )}

        {currentView === "results" && (
          <TripResults
            searchResults={searchResults}
            onTripSelect={handleTripSelect}
            loading={loading}
            onBackToSearch={handleBackToSearch}
          />
        )}

        {currentView === "details" && selectedTrip && (
          <div className="max-w-4xl mx-auto">
            <TripDetails trip={selectedTrip} onBack={handleBackToResults} />
          </div>
        )}

        {currentView === "trip-entry" && (
          <TripEntryForm onBack={handleBackToSearch} onTripCreated={handleTripCreated} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${language === "ar" ? "text-right" : "text-center"}`}
        >
          <div className="text-gray-600">
            <p>&copy; 2025 DiasporaLink. Connecting communities across borders.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App
