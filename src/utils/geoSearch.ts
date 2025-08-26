// PostGIS-style geographic search utilities with pickup/dropoff logic
interface Coordinates {
  lat: number
  lng: number
}

interface SearchLocation {
  searchCity: string | null
  searchCountry: string
  coordinates?: Coordinates
}

// Import Supabase client for database queries
import { supabase } from "../lib/supabase"

// Cache for database lookups
let citiesCache: any[] = []
let countriesCache: any[] = []

// Load cities and countries from database
async function loadLocationData() {
  if (citiesCache.length === 0) {
    const { data: cities } = await supabase.from("cities").select(`
        id, name_en, name_fr, name_ar, latitude, longitude, aliases,
        country:countries(name_en, name_fr, name_ar)
      `)
    citiesCache = cities || []
  }

  if (countriesCache.length === 0) {
    const { data: countries } = await supabase.from("countries").select("id, name_en, name_fr, name_ar")
    countriesCache = countries || []
  }
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10 // Round to 1 decimal place
}

// Find city or country match
async function findLocationMatch(searchTerm: string): Promise<{ city: any | null; country: any | null }> {
  if (!searchTerm || searchTerm.length < 2) return { city: null, country: null }

  await loadLocationData()
  const searchLower = searchTerm.toLowerCase().trim()

  console.log(`\n🔍 LOCATION PARSING: "${searchTerm}" -> "${searchLower}"`)
  console.log(`Available cities:`, citiesCache.length)
  console.log(`Available countries:`, countriesCache.length)

  // Handle "City, Country" format
  if (searchLower.includes(",")) {
    const parts = searchLower.split(",").map((part) => part.trim())
    if (parts.length === 2) {
      const [cityPart, countryPart] = parts
      console.log(`Parsing city,country format: "${cityPart}" in "${countryPart}"`)

      // Find city match
      for (const city of citiesCache) {
        const cityMatches =
          city.name_en.toLowerCase() === cityPart ||
          city.name_fr.toLowerCase() === cityPart ||
          city.name_ar.toLowerCase() === cityPart ||
          (city.aliases && city.aliases.some((alias: string) => alias.toLowerCase() === cityPart))

        // Find country match
        if (!city.country) {
          console.log(`Warning: City ${city.name_en} has no country data`)
          continue
        }

        const countryMatches =
          city.country.name_en.toLowerCase() === countryPart ||
          city.country.name_fr.toLowerCase() === countryPart ||
          city.country.name_ar.toLowerCase() === countryPart

        if (cityMatches && countryMatches) {
          console.log(`✅ CITY,COUNTRY MATCH: ${city.name_en}, ${city.country.name_en}`)
          return { city, country: city.country }
        }
      }
      console.log(`❌ No exact city,country match found for: "${cityPart}" in "${countryPart}"`)
    }
  }

  // First, try to find exact city match
  for (const city of citiesCache) {
    if (!city.country) continue

    const nameMatch =
      city.name_en.toLowerCase() === searchLower ||
      city.name_fr.toLowerCase() === searchLower ||
      city.name_ar.toLowerCase() === searchLower
    const aliasMatch = city.aliases && city.aliases.some((alias: string) => alias.toLowerCase() === searchLower)

    if (nameMatch || aliasMatch) {
      console.log(`✅ CITY MATCH: ${city.name_en}, ${city.country.name_en}`)
      return { city, country: city.country }
    }
  }

  // Then try to find country match
  for (const country of countriesCache) {
    const nameMatch =
      country.name_en.toLowerCase() === searchLower ||
      country.name_fr.toLowerCase() === searchLower ||
      country.name_ar.toLowerCase() === searchLower

    if (nameMatch) {
      console.log(`✅ COUNTRY MATCH: ${country.name_en}`)
      return { city: null, country: country }
    }
  }

  console.log(`❌ NO MATCH found for: ${searchTerm}`)
  return { city: null, country: null }
}

// Parse search input to determine if it's city or country
async function parseSearchLocation(input: string): Promise<SearchLocation | null> {
  const match = await findLocationMatch(input)

  if (match.city) {
    return {
      searchCity: match.city.name_en,
      searchCountry: match.country.name_en,
      coordinates:
        match.city.latitude && match.city.longitude
          ? {
              lat: Number.parseFloat(match.city.latitude),
              lng: Number.parseFloat(match.city.longitude),
            }
          : undefined,
    }
  } else if (match.country && !match.city) {
    return {
      searchCity: null,
      searchCountry: match.country.name_en,
    }
  }

  return null
}

// Find closest city in the same country for pickup locations
function findClosestPickupCity(
  searchCoords: Coordinates,
  country: string,
  trips: any[],
): { city: any; distance: number; trip: any } | null {
  let closestMatch: { city: any; distance: number; trip: any } | null = null
  let minDistance = Number.POSITIVE_INFINITY

  for (const trip of trips) {
    // Check trip origin
    if (trip.route.origin.country === country) {
      const originCity = citiesCache.find(
        (c) => c.name_en === trip.route.origin.city && c.country && c.country.name_en === trip.route.origin.country,
      )
      if (originCity && originCity.latitude && originCity.longitude) {
        const coords = { lat: Number.parseFloat(originCity.latitude), lng: Number.parseFloat(originCity.longitude) }
        const distance = calculateDistance(searchCoords, coords)
        if (distance < minDistance) {
          minDistance = distance
          closestMatch = { city: originCity, distance, trip }
        }
      }
    }

    // Check pickup stops
    for (const stop of trip.route.stops) {
      if (stop.country === country && (stop.type === "pickup" || stop.type === "both")) {
        const stopCity = citiesCache.find(
          (c) => c.name_en === stop.city && c.country && c.country.name_en === stop.country,
        )
        if (stopCity && stopCity.latitude && stopCity.longitude) {
          const coords = { lat: Number.parseFloat(stopCity.latitude), lng: Number.parseFloat(stopCity.longitude) }
          const distance = calculateDistance(searchCoords, coords)
          if (distance < minDistance) {
            minDistance = distance
            closestMatch = { city: stopCity, distance, trip }
          }
        }
      }
    }
  }

  return closestMatch
}

// Find closest city in the same country for dropoff locations
function findClosestDropoffCity(
  searchCoords: Coordinates,
  country: string,
  trips: any[],
): { city: any; distance: number; trip: any } | null {
  let closestMatch: { city: any; distance: number; trip: any } | null = null
  let minDistance = Number.POSITIVE_INFINITY

  for (const trip of trips) {
    // Check trip destination
    if (trip.route.destination.country === country) {
      const destCity = citiesCache.find(
        (c) =>
          c.name_en === trip.route.destination.city &&
          c.country &&
          c.country.name_en === trip.route.destination.country,
      )
      if (destCity && destCity.latitude && destCity.longitude) {
        const coords = { lat: Number.parseFloat(destCity.latitude), lng: Number.parseFloat(destCity.longitude) }
        const distance = calculateDistance(searchCoords, coords)
        if (distance < minDistance) {
          minDistance = distance
          closestMatch = { city: destCity, distance, trip }
        }
      }
    }

    // Check dropoff stops
    for (const stop of trip.route.stops) {
      if (stop.country === country && (stop.type === "dropoff" || stop.type === "both")) {
        const stopCity = citiesCache.find(
          (c) => c.name_en === stop.city && c.country && c.country.name_en === stop.country,
        )
        if (stopCity && stopCity.latitude && stopCity.longitude) {
          const coords = { lat: Number.parseFloat(stopCity.latitude), lng: Number.parseFloat(stopCity.longitude) }
          const distance = calculateDistance(searchCoords, coords)
          if (distance < minDistance) {
            minDistance = distance
            closestMatch = { city: stopCity, distance, trip }
          }
        }
      }
    }
  }

  return closestMatch
}

// Check if trip has pickup location (origin or pickup stops)
function hasPickupLocation(
  trip: any,
  location: SearchLocation,
): { matches: boolean; city: any; distance: number; isClosest: boolean } | null {
  console.log(`\n--- Checking pickup location for trip ${trip.id} ---`)
  console.log(`Pickup location:`, location)
  console.log(`Trip origin: ${trip.route.origin.city}, ${trip.route.origin.country}`)
  console.log(
    `Trip pickup stops:`,
    trip.route.stops.filter((s: any) => s.type === "pickup" || s.type === "both"),
  )

  // If searching by specific city
  if (location.searchCity && location.coordinates) {
    console.log(`Searching by city: ${location.searchCity}`)

    // Check exact match with origin
    if (trip.route.origin.city === location.searchCity && trip.route.origin.country === location.searchCountry) {
      const originCity = citiesCache.find(
        (c) => c.name_en === trip.route.origin.city && c.country && c.country.name_en === trip.route.origin.country,
      )
      if (originCity) {
        console.log(`Exact match with origin: ${originCity.name_en}`)
        return { matches: true, city: originCity, distance: 0, isClosest: false }
      }
    }

    // Check exact match with pickup stops
    for (const stop of trip.route.stops) {
      if (
        stop.city === location.searchCity &&
        stop.country === location.searchCountry &&
        (stop.type === "pickup" || stop.type === "both")
      ) {
        const stopCity = citiesCache.find(
          (c) => c.name_en === stop.city && c.country && c.country.name_en === stop.country,
        )
        if (stopCity) {
          console.log(`Exact match with pickup stop: ${stopCity.name_en}`)
          return { matches: true, city: stopCity, distance: 0, isClosest: false }
        }
      }
    }

    console.log(`No exact city match found for pickup`)
    return null
  } else {
    // Searching by country only
    console.log(`Searching by country only: ${location.searchCountry}`)

    // Check origin country
    if (trip.route.origin.country === location.searchCountry) {
      const originCity = citiesCache.find(
        (c) => c.name_en === trip.route.origin.city && c.country && c.country.name_en === trip.route.origin.country,
      )
      if (originCity) {
        console.log(`Country match with origin: ${originCity.name_en}`)
        return { matches: true, city: originCity, distance: 0, isClosest: false }
      }
    }

    // Check pickup stops
    for (const stop of trip.route.stops) {
      if (stop.country === location.searchCountry && (stop.type === "pickup" || stop.type === "both")) {
        const stopCity = citiesCache.find(
          (c) => c.name_en === stop.city && c.country && c.country.name_en === stop.country,
        )
        if (stopCity) {
          console.log(`Country match with pickup stop: ${stopCity.name_en}`)
          return { matches: true, city: stopCity, distance: 0, isClosest: false }
        }
      }
    }
  }

  console.log(`No pickup match found`)
  return null
}

// Check if trip has dropoff location (destination or dropoff stops)
function hasDropoffLocation(
  trip: any,
  location: SearchLocation,
): { matches: boolean; city: any; distance: number; isClosest: boolean } | null {
  console.log(`\n--- Checking dropoff location for trip ${trip.id} ---`)
  console.log(`Dropoff location:`, location)
  console.log(`Trip destination: ${trip.route.destination.city}, ${trip.route.destination.country}`)
  console.log(
    `Trip dropoff stops:`,
    trip.route.stops.filter((s: any) => s.type === "dropoff" || s.type === "both"),
  )

  // If searching by specific city
  if (location.searchCity && location.coordinates) {
    console.log(`Searching by city: ${location.searchCity}`)

    // Check exact match with final destination
    if (
      trip.route.destination.city === location.searchCity &&
      trip.route.destination.country === location.searchCountry
    ) {
      const destCity = citiesCache.find(
        (c) =>
          c.name_en === trip.route.destination.city &&
          c.country &&
          c.country.name_en === trip.route.destination.country,
      )
      if (destCity) {
        console.log(`Exact match with final destination: ${destCity.name_en}`)
        return { matches: true, city: destCity, distance: 0, isClosest: false }
      }
    }

    // Check exact match with dropoff stops
    for (const stop of trip.route.stops) {
      if (
        stop.city === location.searchCity &&
        stop.country === location.searchCountry &&
        (stop.type === "dropoff" || stop.type === "both")
      ) {
        const stopCity = citiesCache.find(
          (c) => c.name_en === stop.city && c.country && c.country.name_en === stop.country,
        )
        if (stopCity) {
          console.log(`Exact match with dropoff stop: ${stopCity.name_en}`)
          return { matches: true, city: stopCity, distance: 0, isClosest: false }
        }
      }
    }

    console.log(`No exact city match found for dropoff`)
    return null
  } else {
    // Searching by country only
    console.log(`Searching by country only: ${location.searchCountry}`)

    // Check final destination country
    if (trip.route.destination.country === location.searchCountry) {
      const destCity = citiesCache.find(
        (c) =>
          c.name_en === trip.route.destination.city &&
          c.country &&
          c.country.name_en === trip.route.destination.country,
      )
      if (destCity) {
        console.log(`Country match with final destination: ${destCity.name_en}`)
        return { matches: true, city: destCity, distance: 0, isClosest: false }
      }
    }

    // Check dropoff stops
    for (const stop of trip.route.stops) {
      if (stop.country === location.searchCountry && (stop.type === "dropoff" || stop.type === "both")) {
        const stopCity = citiesCache.find(
          (c) => c.name_en === stop.city && c.country && c.country.name_en === stop.country,
        )
        if (stopCity) {
          console.log(`Country match with dropoff stop: ${stopCity.name_en}`)
          return { matches: true, city: stopCity, distance: 0, isClosest: false }
        }
      }
    }
  }

  console.log(`No dropoff match found`)
  return null
}

// Main search function with pickup/dropoff logic
export async function searchRoutes(originQuery: string, destinationQuery: string, routes: any[]): Promise<any[]> {
  console.log("\n=== PICKUP/DROPOFF SEARCH DEBUG ===")
  console.log("Origin query:", `"${originQuery}"`)
  console.log("Destination query:", `"${destinationQuery}"`)

  // Handle empty queries
  if (!originQuery && !destinationQuery) {
    console.log("❌ Both queries are empty")
    return []
  }

  await loadLocationData()
  console.log(`Loaded ${citiesCache.length} cities and ${countriesCache.length} countries into cache`)

  // Debug: Show what we're looking for
  console.log("\n🔍 STEP 1: PARSING SEARCH QUERIES")

  // Parse search locations
  const originLocation = originQuery ? await parseSearchLocation(originQuery) : null
  const destinationLocation = destinationQuery ? await parseSearchLocation(destinationQuery) : null

  console.log("Parsed origin location:", originLocation)
  console.log("Parsed destination location:", destinationLocation)

  if (!originLocation && !destinationLocation) {
    console.log("❌ STEP 1 FAILED: No valid locations found in either search field")
    console.log(
      "Available countries in database:",
      countriesCache.map((c) => c.name_en),
    )
    return []
  }

  console.log("\n🔍 STEP 2: FILTERING TRIPS")
  console.log(`Total trips to check: ${routes.length}`)

  const results: any[] = []
  const exactMatches: any[] = []
  const nearestMatches: any[] = []

  if (originLocation) {
    console.log(
      `\n🎯 PICKUP CHECK: Trip must start in or pass through (pickup) ${originLocation.searchCity || "any city"}, ${originLocation.searchCountry}`,
    )
  }
  if (destinationLocation) {
    console.log(
      `🎯 DROPOFF CHECK: Trip must end in or pass through (dropoff) ${destinationLocation.searchCity || "any city"}, ${destinationLocation.searchCountry}`,
    )
  }

  console.log("\n🔍 STEP 3: CHECKING EACH TRIP")

  // First pass: Look for exact matches
  for (let i = 0; i < routes.length; i++) {
    const trip = routes[i]
    console.log(`\n--- Processing trip ${trip.id} for exact matches ---`)
    console.log(
      `Trip ${i + 1}/${routes.length}: ${trip.route.origin.city}, ${trip.route.origin.country} → ${trip.route.destination.city}, ${trip.route.destination.country}`,
    )
    console.log(
      `Stops:`,
      trip.route.stops.map((s: any) => `${s.city}, ${s.country} (${s.type})`),
    )

    const pickupMatch = originLocation ? hasPickupLocation(trip, originLocation) : true
    const dropoffMatch = destinationLocation ? hasDropoffLocation(trip, destinationLocation) : true

    console.log(`Pickup match result:`, pickupMatch ? "✅ YES" : "❌ NO")
    console.log(`Dropoff match result:`, dropoffMatch ? "✅ YES" : "❌ NO")

    if (pickupMatch && dropoffMatch) {
      console.log(`✅ Trip ${trip.id} has both pickup and dropoff locations`)
      exactMatches.push(trip)
    } else {
      console.log(`❌ Trip ${trip.id} rejected - missing pickup or dropoff match`)
    }
  }

  console.log(`\n🔍 STEP 4: RESULTS SUMMARY`)
  console.log(`Exact matches found: ${exactMatches.length}`)

  // If we found exact matches, return them
  if (exactMatches.length > 0) {
    console.log(`\nFound ${exactMatches.length} exact matches`)
    results.push(...exactMatches)
  } else if (
    originLocation?.searchCity &&
    originLocation?.coordinates &&
    destinationLocation?.searchCity &&
    destinationLocation?.coordinates
  ) {
    // Second pass: Look for nearest matches if no exact matches and both are city searches
    console.log(`\n🔍 STEP 5: LOOKING FOR NEAREST MATCHES (city-specific search)`)

    const nearestPickup = findClosestPickupCity(originLocation.coordinates, originLocation.searchCountry, routes)
    const nearestDropoff = findClosestDropoffCity(
      destinationLocation.coordinates,
      destinationLocation.searchCountry,
      routes,
    )

    if (nearestPickup && nearestDropoff) {
      console.log(`Nearest pickup: ${nearestPickup.city.name} (${nearestPickup.distance}km)`)
      console.log(`Nearest dropoff: ${nearestDropoff.city.name} (${nearestDropoff.distance}km)`)

      // Find trips that have both nearest pickup and dropoff
      for (const trip of routes) {
        const pickupMatch = hasPickupLocation(trip, {
          searchCity: nearestPickup.city.name_en,
          searchCountry: nearestPickup.city.country.name_en,
          coordinates: {
            lat: Number.parseFloat(nearestPickup.city.latitude),
            lng: Number.parseFloat(nearestPickup.city.longitude),
          },
        })
        const dropoffMatch = hasDropoffLocation(trip, {
          searchCity: nearestDropoff.city.name_en,
          searchCountry: nearestDropoff.city.country.name_en,
          coordinates: {
            lat: Number.parseFloat(nearestDropoff.city.latitude),
            lng: Number.parseFloat(nearestDropoff.city.longitude),
          },
        })

        if (pickupMatch && dropoffMatch) {
          console.log(`✅ Trip ${trip.id} matches nearest cities`)
          nearestMatches.push(trip)
        }
      }

      results.push(...nearestMatches)
    } else {
      console.log(`❌ STEP 5 FAILED: No nearest matches found`)
      console.log(`Nearest pickup:`, nearestPickup ? `${nearestPickup.city.name_en}` : "NONE")
      console.log(`Nearest dropoff:`, nearestDropoff ? `${nearestDropoff.city.name_en}` : "NONE")
    }
  } else {
    console.log(`\n🔍 STEP 5: SKIPPED (country-only search, no nearest matching needed)`)
  }

  console.log(`\n🔍 FINAL RESULTS: ${results.length} trips found`)
  if (results.length === 0) {
    console.log(`\n❌ NO RESULTS - POSSIBLE ISSUES:`)
    console.log(`1. Origin location parsing: ${originLocation ? "✅" : "❌"}`)
    console.log(`2. Destination location parsing: ${destinationLocation ? "✅" : "❌"}`)
    if (originLocation) {
      console.log(
        `3. Trips with matching pickup locations: ${routes.filter((t) => hasPickupLocation(t, originLocation)).length}`,
      )
    }
    if (destinationLocation) {
      console.log(
        `4. Trips with matching dropoff locations: ${routes.filter((t) => hasDropoffLocation(t, destinationLocation)).length}`,
      )
    }
  }
  console.log("=== END SEARCH DEBUG ===\n")

  return results
}

// New function for country-level search with match scoring
export function searchCountryRoutes(
  originQuery: string,
  destinationQuery: string,
  routes: any[],
  excludeTrips: any[] = [],
): { trips: any[]; searchCountries: { origin: string; destination: string } } {
  return new Promise(async (resolve) => {
    console.log("\n=== COUNTRY SEARCH DEBUG ===")
    console.log("Origin query:", `"${originQuery}"`)
    console.log("Destination query:", `"${destinationQuery}"`)
    console.log(
      "Exclude trips:",
      excludeTrips.map((t) => t.id),
    )

    await loadLocationData()
    console.log(`Loaded ${citiesCache.length} cities and ${countriesCache.length} countries into cache`)

    // Parse search locations to get countries
    const originLocation = originQuery ? await parseSearchLocation(originQuery) : null
    const destinationLocation = destinationQuery ? await parseSearchLocation(destinationQuery) : null

    console.log("Parsed origin location:", originLocation)
    console.log("Parsed destination location:", destinationLocation)

    if (!originLocation && !destinationLocation) {
      console.log("❌ Cannot perform country search - no valid locations found")
      resolve({
        trips: [],
        searchCountries: { origin: "", destination: "" },
      })
      return
    }

    // Handle cases where only one location is found
    if (!originLocation || !destinationLocation) {
      console.log("⚠️ Only one location found - cannot do country-to-country search")
      resolve({
        trips: [],
        searchCountries: {
          origin: originLocation?.searchCountry || "",
          destination: destinationLocation?.searchCountry || "",
        },
      })
      return
    }

    const searchCountries = {
      origin: originLocation.searchCountry,
      destination: destinationLocation.searchCountry,
    }

    console.log("Search countries:", searchCountries)

    // Get exclude trip IDs for easy lookup
    const excludeIds = new Set(excludeTrips.map((trip) => trip.id))
    console.log("Excluding trip IDs:", Array.from(excludeIds))

    // Simple country-to-country logic (like Popular Routes)
    // Find all trips that have BOTH countries anywhere in their route
    const countryTrips = routes.filter((trip) => {
      // Skip if already in exact matches
      if (excludeIds.has(trip.id)) {
        console.log(`Skipping trip ${trip.id} - already in exact matches`)
        return false
      }

      console.log(`\n--- Checking trip ${trip.id} for country connection ---`)
      console.log(
        `Trip: ${trip.route.origin.city}, ${trip.route.origin.country} → ${trip.route.destination.city}, ${trip.route.destination.country}`,
      )
      console.log(
        `Stops:`,
        trip.route.stops.map((s: any) => `${s.city}, ${s.country}`),
      )

      // Get all countries this trip touches
      const tripCountries = new Set([
        trip.route.origin.country,
        trip.route.destination.country,
        ...trip.route.stops.map((stop: any) => stop.country),
      ])

      console.log(`Trip countries:`, Array.from(tripCountries))
      console.log(`Looking for:`, [searchCountries.origin, searchCountries.destination])

      // Simple check: does this trip touch BOTH countries?
      const hasOriginCountry = tripCountries.has(searchCountries.origin)
      const hasDestinationCountry = tripCountries.has(searchCountries.destination)
      const connects = hasOriginCountry && hasDestinationCountry

      console.log(`Has origin country (${searchCountries.origin}):`, hasOriginCountry)
      console.log(`Has destination country (${searchCountries.destination}):`, hasDestinationCountry)
      console.log(`Connects both countries:`, connects)

      if (connects) {
        console.log(`✅ Trip ${trip.id} connects ${searchCountries.origin} ↔ ${searchCountries.destination}`)
      } else {
        console.log(`❌ Trip ${trip.id} does not connect both countries`)
      }

      return connects
    })

    console.log(`Found ${countryTrips.length} country-level trips`)
    countryTrips.forEach((trip) => {
      console.log(
        `Country trip: ${trip.id} - ${trip.route.origin.city}, ${trip.route.origin.country} → ${trip.route.destination.city}, ${trip.route.destination.country}`,
      )
    })

    // Score and sort trips by match quality
    const scoredTrips = countryTrips.map((trip) => {
      let score = 0

      // Higher score for city matches (like Popular Routes logic)
      if (originLocation.searchCity) {
        if (
          trip.route.origin.city === originLocation.searchCity ||
          trip.route.destination.city === originLocation.searchCity ||
          trip.route.stops.some((stop: any) => stop.city === originLocation.searchCity)
        ) {
          score += 10
          console.log(`Trip ${trip.id} gets +10 for origin city match`)
        }
      }

      if (destinationLocation.searchCity) {
        if (
          trip.route.origin.city === destinationLocation.searchCity ||
          trip.route.destination.city === destinationLocation.searchCity ||
          trip.route.stops.some((stop: any) => stop.city === destinationLocation.searchCity)
        ) {
          score += 10
          console.log(`Trip ${trip.id} gets +10 for destination city match`)
        }
      }

      // Additional scoring for route direction preference
      if (
        trip.route.origin.country === searchCountries.origin &&
        trip.route.destination.country === searchCountries.destination
      ) {
        score += 5
        console.log(`Trip ${trip.id} gets +5 for correct direction`)
      }

      console.log(`Trip ${trip.id} final score: ${score}`)
      return { trip, score }
    })

    // Sort by score (highest first), then by departure date
    scoredTrips.sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score // Higher score first
      }
      return new Date(a.trip.departureDate).getTime() - new Date(b.trip.departureDate).getTime()
    })

    const sortedTrips = scoredTrips.map((item) => item.trip)

    console.log("Final country matches (sorted by score):")
    scoredTrips.forEach((item) => {
      console.log(
        `Trip ${item.trip.id}: ${item.trip.route.origin.city} → ${item.trip.route.destination.city} (score: ${item.score})`,
      )
    })
    console.log("=== END COUNTRY SEARCH DEBUG ===\n")

    resolve({
      trips: sortedTrips,
      searchCountries,
    })
  })
}
