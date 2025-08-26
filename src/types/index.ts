//src/types/index.ts
export interface Trip {
  id: string
  urlId?: string // Added urlId for trip reference
  travelerName: string
  travelerUsername: string
  route: {
    origin: {
      city: string
      country: string
      address?: string
      availabilityTime?: string
      instructions?: string
    }
    destination: {
      city: string
      country: string
      address?: string
      availabilityTime?: string
      instructions?: string
    }
    stops: {
      city: string
      country: string
      type: "pickup" | "dropoff" | "both"
      address?: string
      availabilityTime?: string
      instructions?: string
    }[]
    allCountries?: string[] // Added allCountries for emoji flag routes including transit
  }
  departureDate: string
  pricePerKg: number
  currency: "EUR" | "TND" | "DZD" | "CHF" | "MAD" | "USD"
  availableKg: number
  notes: string
  contacts: Contact[]
  flags: {
    origin: string
    destination: string
  }
}

export interface Contact {
  type: "whatsapp" | "messenger" | "phone"
  value: string
  label: string
}

export interface SearchFilters {
  origin: string
  destination: string
  departureDate: string
  language?: string // Added language parameter for multilingual search
}

export interface SearchResults {
  exactMatches: Trip[]
  countryMatches: Trip[]
  searchCountries: {
    origin: string
    destination: string
  }
}

export interface TripSearchResult {
  trip: Trip
  pickupDistanceKm: number
  destinationDistanceKm: number
  closestMatch: boolean
  pickupCity: { ar: string; en: string; fr: string }
  destinationCity: { ar: string; en: string; fr: string }
}

export type Language = "en" | "fr" | "ar"

export interface Translation {
  [key: string]: {
    en: string
    fr: string
    ar: string
  }
}
