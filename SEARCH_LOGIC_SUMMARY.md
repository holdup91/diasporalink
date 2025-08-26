# Search Logic Summary

## Overview
The search system implements a sophisticated pickup/dropoff matching algorithm that finds trips based on where travelers can collect packages (pickup) and deliver them (dropoff).

## Core Logic Flow

### 1. Input Parsing (`parseSearchLocation`)
- **Location**: `src/utils/geoSearch.ts`
- **Function**: Determines if user input is a city name or country name
- **Process**:
  - Searches `CITIES_DATABASE` for exact matches (name, aliases, translations)
  - If city found: returns `{ searchCity, searchCountry, coordinates }`
  - If country found: returns `{ searchCity: null, searchCountry }`
  - If nothing found: returns `null`

### 2. Origin Matching (Pickup Logic)
- **Function**: `hasPickupLocation(trip, originLocation)`
- **Searches for pickup opportunities**:
  1. **Trip starting point** (always available for pickup)
  2. **Stops with type = 'pickup' or 'both'**
- **Matching Priority**:
  - **Exact city match**: `distance = 0km`, `closestMatch = false`
  - **Country-only search**: Any city in country matches
  - **Nearest city fallback**: If no exact match, finds closest city in same country

### 3. Destination Matching (Dropoff Logic)
- **Function**: `hasDropoffLocation(trip, destinationLocation)`
- **Searches for dropoff opportunities**:
  1. **Trip final destination** (always available for dropoff)
  2. **Stops with type = 'dropoff' or 'both'**
- **Same matching priority as pickup logic**

### 4. Distance Calculation
- **Function**: `calculateDistance(coord1, coord2)`
- **Method**: Haversine formula for accurate geographic distances
- **Used for**: Finding nearest cities when exact matches fail

## Files Impacted

### Core Search Logic
- **`src/utils/geoSearch.ts`**: Main search engine with all matching algorithms
- **`src/types/index.ts`**: Type definitions including stop types
- **`src/App.tsx`**: Search orchestration and result handling

### Data Layer
- **`src/data/mockTrips.ts`**: Trip database with stop types
- **`src/context/LanguageContext.tsx`**: City/country translations

### UI Components
- **`src/components/SearchForm.tsx`**: Search input interface
- **`src/components/TripResults.tsx`**: Results display
- **`src/components/TripDetails.tsx`**: Detailed trip view with stop type indicators
- **`src/components/AutocompleteInput.tsx`**: Location autocomplete

## Search Examples

### "alger" → "barcelone"
1. **Parse**: Algiers, Algeria → Barcelona, Spain
2. **Pickup**: Find trips starting in Algeria or with pickup stops in Algeria
3. **Dropoff**: Find trips ending in Spain or with dropoff stops in Spain
4. **Match**: Trip "Algiers → Marseille via Barcelona" (Barcelona = 'both' type)

### "France" → "Algeria"
1. **Parse**: Any French city → Any Algerian city
2. **Pickup**: All trips starting in France
3. **Dropoff**: All trips ending in Algeria or passing through Algeria
4. **Result**: All France→Algeria routes

## Key Features
- **Flexible stop types**: pickup, dropoff, both
- **Distance-based fallback**: Nearest city matching
- **Multi-language support**: Arabic, French, English
- **Geographic accuracy**: Real coordinates and distances
- **Transit country support**: Finds trips passing through destinations
