import { supabase } from "../lib/supabase"
import type { Trip, SearchFilters, SearchResults } from "../types"

// Helper function to get city/country name by language
function getLocationName(location: any, language = "en"): string {
  if (!location) return ""

  switch (language) {
    case "ar":
      return location.name_ar || location.name_en
    case "fr":
      return location.name_fr || location.name_en
    default:
      return location.name_en
  }
}

// Transform database trip to frontend Trip type
function transformDatabaseTrip(dbTrip: any): Trip {
  // Get all unique countries from the trip route including transit stops
  const allCountries = new Set<string>()

  // Add origin and destination countries
  if (dbTrip.origin_country) allCountries.add(getLocationName(dbTrip.origin_country))
  if (dbTrip.destination_country) allCountries.add(getLocationName(dbTrip.destination_country))

  // Add transit countries from stops
  dbTrip.trip_stops?.forEach((stop: any) => {
    if (stop.country) {
      allCountries.add(getLocationName(stop.country))
    }
  })

  return {
    id: dbTrip.id,
    urlId: dbTrip.url_id, // Added url_id as trip reference
    travelerName: dbTrip.carrier.full_name,
    travelerUsername: dbTrip.carrier.username,
    route: {
      origin: {
        city: getLocationName(dbTrip.origin_city),
        country: getLocationName(dbTrip.origin_country),
        address: dbTrip.trip_stops?.find((s: any) => s.stop_order === 0)?.address,
        availabilityTime: dbTrip.trip_stops?.find((s: any) => s.stop_order === 0)?.availability_time,
        instructions: dbTrip.trip_stops?.find((s: any) => s.stop_order === 0)?.instructions,
      },
      destination: {
        city: getLocationName(dbTrip.destination_city),
        country: getLocationName(dbTrip.destination_country),
        address: dbTrip.trip_stops?.find((s: any) => s.stop_order === 999)?.address,
        availabilityTime: dbTrip.trip_stops?.find((s: any) => s.stop_order === 999)?.availability_time,
        instructions: dbTrip.trip_stops?.find((s: any) => s.stop_order === 999)?.instructions,
      },
      stops:
        dbTrip.trip_stops
          ?.filter((stop: any) => stop.stop_order > 0 && stop.stop_order < 999)
          ?.sort((a: any, b: any) => a.stop_order - b.stop_order)
          ?.map((stop: any) => ({
            city: getLocationName(stop.city),
            country: getLocationName(stop.country),
            type: stop.stop_type,
            address: stop.address,
            availabilityTime: stop.availability_time,
            instructions: stop.instructions,
          })) || [],
      allCountries: Array.from(allCountries), // Added all countries including transit
    },
    departureDate: dbTrip.departure_date,
    pricePerKg: Number.parseFloat(dbTrip.price_per_kg),
    currency: dbTrip.currency as any,
    availableKg: dbTrip.available_kg,
    notes: dbTrip.notes || "",
    contacts:
      dbTrip.trip_contacts?.map((contact: any) => ({
        type: contact.contact_type,
        value: contact.contact_value,
        label: contact.contact_label,
      })) || [],
    flags: {
      origin: dbTrip.origin_flag || "🏳️",
      destination: dbTrip.destination_flag || "🏳️",
    },
  }
}

// Search for locations (cities or countries)
export async function searchLocations(query: string, language = "en"): Promise<any[]> {
  if (!query || query.length < 1) return []

  const searchTerm = `%${query.toLowerCase()}%`

  // Search cities first - enhanced to search aliases too
  const { data: cities } = await supabase
    .from("cities")
    .select(`
      id,
      name_en,
      name_fr, 
      name_ar,
      aliases,
      country:countries(name_en, name_fr, name_ar)
    `)
    .or(
      `name_en.ilike.${searchTerm},name_fr.ilike.${searchTerm},name_ar.ilike.${searchTerm},aliases.ilike.${searchTerm}`,
    )
    .limit(10)

  // Search countries
  const { data: countries } = await supabase
    .from("countries")
    .select("id, name_en, name_fr, name_ar")
    .or(`name_en.ilike.${searchTerm},name_fr.ilike.${searchTerm},name_ar.ilike.${searchTerm}`)
    .limit(5)

  // Helper function to get name by language
  const getName = (item: any) => {
    switch (language) {
      case "ar":
        return item.name_ar || item.name_en
      case "fr":
        return item.name_fr || item.name_en
      default:
        return item.name_en
    }
  }

  return [
    ...(cities || []).map((city) => ({
      type: "city",
      id: city.id,
      name: getName(city),
      country: getName(city.country),
      display: `${getName(city)}, ${getName(city.country)}`,
    })),
    ...(countries || []).map((country) => ({
      type: "country",
      id: country.id,
      name: getName(country),
      display: getName(country),
    })),
  ]
}

// Get all active trips
export async function getAllTrips(): Promise<Trip[]> {
  const { data, error } = await supabase
    .from("trips")
    .select(`
      *,
      carrier:carriers(full_name, username),
      origin_city:cities!trips_origin_city_id_fkey(name_en, name_fr, name_ar),
      origin_country:countries!trips_origin_country_id_fkey(name_en, name_fr, name_ar),
      destination_city:cities!trips_destination_city_id_fkey(name_en, name_fr, name_ar),
      destination_country:countries!trips_destination_country_id_fkey(name_en, name_fr, name_ar),
      trip_stops(
        stop_order,
        stop_type,
        address,
        availability_time,
        instructions,
        city:cities(name_en, name_fr, name_ar),
        country:countries(name_en, name_fr, name_ar)
      ),
      trip_contacts(
        contact_type,
        contact_value,
        contact_label
      )
    `)
    .eq("status", "active")
    .gte("departure_date", new Date().toISOString().split("T")[0])
    .order("departure_date", { ascending: true })

  if (error) {
    console.error("Error fetching trips:", error)
    return []
  }

  return (data || []).map(transformDatabaseTrip)
}

// Search trips with pickup/dropoff logic
export async function searchTrips(filters: SearchFilters): Promise<SearchResults> {
  console.log("=== RPC SEARCH DEBUG ===")
  console.log("Search filters:", filters)

  // Skip search if both fields are empty
  if (!filters.origin.trim() && !filters.destination.trim()) {
    console.log("❌ Empty search - both origin and destination are empty")
    return {
      exactMatches: [],
      countryMatches: [],
      searchCountries: { origin: "", destination: "" },
    }
  }

  try {
    // First, resolve location names to IDs
    const originLocations = await searchLocations(filters.origin.trim(), filters.language)
    const destinationLocations = await searchLocations(filters.destination.trim(), filters.language)

    console.log("Origin locations found:", originLocations)
    console.log("Destination locations found:", destinationLocations)

    if (originLocations.length === 0 || destinationLocations.length === 0) {
      console.log("❌ No locations found for search terms")
      return {
        exactMatches: [],
        countryMatches: [],
        searchCountries: { origin: filters.origin, destination: filters.destination },
      }
    }

    // Use the first match for each location
    const origin = originLocations[0]
    const destination = destinationLocations[0]

    // Get country IDs - if searching by city, get the city's country
    const originCountryId =
      origin.type === "city"
        ? (await supabase.from("cities").select("country_id").eq("id", origin.id).single()).data?.country_id
        : origin.id

    const destinationCountryId =
      destination.type === "city"
        ? (await supabase.from("cities").select("country_id").eq("id", destination.id).single()).data?.country_id
        : destination.id

    console.log("Calling RPC with:", {
      origin_city_id: origin.type === "city" ? origin.id : null,
      origin_country_id: originCountryId,
      destination_city_id: destination.type === "city" ? destination.id : null,
      destination_country_id: destinationCountryId,
    })

    // Call the new RPC function
    const { data: rpcResults, error } = await supabase.rpc("search_trips_with_match_type", {
      origin_city_id: origin.type === "city" ? origin.id : null,
      origin_country_id: originCountryId,
      destination_city_id: destination.type === "city" ? destination.id : null,
      destination_country_id: destinationCountryId,
    })

    if (error) {
      console.error("RPC Error:", error)
      console.log("RPC failed, trying fallback search...")
      return await performFallbackSearch(originCountryId, destinationCountryId, filters)
    }

    console.log("RPC Results:", rpcResults)

    if (!rpcResults || rpcResults.length === 0) {
      console.log("RPC returned no results, trying fallback search...")
      return await performFallbackSearch(originCountryId, destinationCountryId, filters)
    }

    // Get full trip details for the matching trip IDs
    const tripIds = rpcResults?.map((r: any) => r.id) || []

    // Fetch full trip details
    const { data: fullTrips, error: tripsError } = await supabase
      .from("trips")
      .select(`
        *,
        carrier:carriers(full_name, username),
        origin_city:cities!trips_origin_city_id_fkey(name_en, name_fr, name_ar),
        origin_country:countries!trips_origin_country_id_fkey(name_en, name_fr, name_ar),
        destination_city:cities!trips_destination_city_id_fkey(name_en, name_fr, name_ar),
        destination_country:countries!trips_destination_country_id_fkey(name_en, name_fr, name_ar),
        trip_stops(
          stop_order,
          stop_type,
          address,
          availability_time,
          instructions,
          city:cities(name_en, name_fr, name_ar),
          country:countries(name_en, name_fr, name_ar)
        ),
        trip_contacts(
          contact_type,
          contact_value,
          contact_label
        )
      `)
      .in("id", tripIds)

    if (tripsError) {
      console.error("Error fetching trip details:", tripsError)
      return {
        exactMatches: [],
        countryMatches: [],
        searchCountries: { origin: filters.origin, destination: filters.destination },
      }
    }

    // Transform and categorize results based on match_type
    const transformedTrips = (fullTrips || []).map(transformDatabaseTrip)
    const rpcResultsMap = new Map(rpcResults?.map((r: any) => [r.id, r.match_type]) || [])

    const exactMatches = transformedTrips.filter((trip) => rpcResultsMap.get(trip.id) === "exact")

    const partialMatches = transformedTrips.filter((trip) => rpcResultsMap.get(trip.id) === "partial")

    const countryMatches = transformedTrips.filter((trip) => rpcResultsMap.get(trip.id) === "country")

    // Combine exact and partial matches as "exact matches"
    const allExactMatches = [...exactMatches, ...partialMatches]

    console.log("Final results - Exact/Partial:", allExactMatches.length, "Country:", countryMatches.length)
    console.log("=== END RPC SEARCH DEBUG ===")

    const results: SearchResults = {
      exactMatches: allExactMatches,
      countryMatches,
      searchCountries: {
        origin: origin.type === "country" ? origin.name : origin.country || filters.origin,
        destination: destination.type === "country" ? destination.name : destination.country || filters.destination,
      },
    }

    // Sort by departure date
    results.exactMatches.sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())
    results.countryMatches.sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())

    return results
  } catch (error) {
    console.error("Search error:", error)
    return {
      exactMatches: [],
      countryMatches: [],
      searchCountries: { origin: filters.origin, destination: filters.destination },
    }
  }
}

async function performFallbackSearch(
  originCountryId: number,
  destinationCountryId: number,
  filters: SearchFilters,
): Promise<SearchResults> {
  console.log("[v0] Performing fallback search for countries:", originCountryId, "->", destinationCountryId)

  try {
    // Fetch all active trips with their stops and related data
    const { data: trips, error } = await supabase
      .from("trips")
      .select(`
        *,
        carrier:carriers(full_name, username),
        origin_city:cities!trips_origin_city_id_fkey(name_en, name_fr, name_ar),
        origin_country:countries!trips_origin_country_id_fkey(name_en, name_fr, name_ar),
        destination_city:cities!trips_destination_city_id_fkey(name_en, name_fr, name_ar),
        destination_country:countries!trips_destination_country_id_fkey(name_en, name_fr, name_ar),
        trip_stops(
          stop_order,
          stop_type,
          address,
          availability_time,
          instructions,
          city:cities(name_en, name_fr, name_ar),
          country:countries(name_en, name_fr, name_ar)
        ),
        trip_contacts(
          contact_type,
          contact_value,
          contact_label
        )
      `)
      .eq("status", "active")
      .gte("departure_date", new Date().toISOString().split("T")[0])

    if (error) {
      console.error("[v0] Fallback search error:", error)
      return {
        exactMatches: [],
        countryMatches: [],
        searchCountries: { origin: filters.origin, destination: filters.destination },
      }
    }

    console.log("[v0] Fallback search found trips:", trips?.length || 0)

    if (!trips || trips.length === 0) {
      return {
        exactMatches: [],
        countryMatches: [],
        searchCountries: { origin: filters.origin, destination: filters.destination },
      }
    }

    // Filter trips based on origin and destination countries
    const matchingTrips = trips.filter((trip) => {
      const tripOriginCountryId = trip.origin_country_id
      const tripDestinationCountryId = trip.destination_country_id

      // Check if trip goes from origin country to destination country
      return tripOriginCountryId === originCountryId && tripDestinationCountryId === destinationCountryId
    })

    console.log("[v0] Filtered matching trips:", matchingTrips.length)

    // Transform the trips
    const transformedTrips = matchingTrips.map(transformDatabaseTrip)

    return {
      exactMatches: transformedTrips,
      countryMatches: [],
      searchCountries: { origin: filters.origin, destination: filters.destination },
    }
  } catch (error) {
    console.error("[v0] Fallback search error:", error)
    return {
      exactMatches: [],
      countryMatches: [],
      searchCountries: { origin: filters.origin, destination: filters.destination },
    }
  }
}

// Log search analytics
export async function logSearch(filters: SearchFilters, resultsCount: number): Promise<void> {
  try {
    await supabase.from("search_logs").insert({
      origin_query: filters.origin,
      destination_query: filters.destination,
      results_count: resultsCount,
      ip_address: null, // Could be populated with actual IP
      user_agent: navigator.userAgent,
      device_type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? "mobile" : "desktop",
    })
  } catch (error) {
    console.error("Error logging search:", error)
  }
}

// Log trip analytics
export async function logTripView(tripId: string): Promise<void> {
  try {
    await supabase.from("trip_analytics").insert({
      trip_id: tripId,
      ip_address: null, // Could be populated with actual IP
      user_agent: navigator.userAgent,
      device_type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? "mobile" : "desktop",
    })
  } catch (error) {
    console.error("Error logging trip view:", error)
  }
}

// Log contact click
export async function logContactClick(tripId: string, contactType: "phone" | "whatsapp" | "messenger"): Promise<void> {
  try {
    const updateData: any = {}
    updateData[`clicked_${contactType}`] = true

    await supabase.from("trip_analytics").upsert({
      trip_id: tripId,
      ...updateData,
    })
  } catch (error) {
    console.error("Error logging contact click:", error)
  }
}
