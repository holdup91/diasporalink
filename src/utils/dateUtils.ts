export const formatDate = (dateString: string, language = "en"): string => {
  const date = new Date(dateString)

  if (language === "ar") {
    const arabicMonths = [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ]

    const day = date.getDate()
    const month = arabicMonths[date.getMonth()]
    const year = date.getFullYear()

    return `${day} ${month} ${year}`
  }

  // Simple date formatting without external dependencies
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }

  // Use appropriate locale
  const locale = language === "fr" ? "fr-FR" : "en-US"

  return date.toLocaleDateString(locale, options)
}

export const isDateTodayOrFuture = (dateString: string): boolean => {
  const date = new Date(dateString)
  const today = new Date()

  // Set both dates to start of day for comparison
  date.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const result = date.getTime() >= today.getTime()
  console.log(`Date check: ${dateString} -> ${date.toISOString()} vs today ${today.toISOString()} = ${result}`)
  return result
}

export const getDaysUntilDeparture = (departureDate: string): number => {
  const departure = new Date(departureDate)
  const today = new Date()
  const diffTime = departure.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
