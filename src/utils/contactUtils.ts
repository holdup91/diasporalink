import { Phone, MessageCircle } from "lucide-react"
import React from "react"

export function getContactColor(type: string): string {
  switch (type) {
    case "whatsapp":
      return "bg-green-500 hover:bg-green-600"
    case "messenger":
      return "bg-blue-500 hover:bg-blue-600"
    case "phone":
      return "bg-gray-600 hover:bg-gray-700"
    default:
      return "bg-gray-500 hover:bg-gray-600"
  }
}

export function getContactIcon(type: string): React.ReactElement {
  switch (type) {
    case "whatsapp":
      return React.createElement(
        "svg",
        {
          className: "h-4 w-4 sm:h-5 sm:w-5",
          fill: "currentColor",
          viewBox: "0 0 24 24",
        },
        React.createElement("path", {
          d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488",
        }),
      )
    case "messenger":
      return React.createElement(
        "svg",
        {
          className: "h-4 w-4 sm:h-5 sm:w-5",
          fill: "currentColor",
          viewBox: "0 0 24 24",
        },
        React.createElement("path", {
          d: "M12 0C5.374 0 0 4.975 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.626 0 12-4.974 12-11.111C24 4.975 18.626 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8.1l3.13 3.26L19.752 8.1l-6.561 6.863z",
        }),
      )
    case "phone":
      return React.createElement(Phone, { className: "h-4 w-4 sm:h-5 sm:w-5" })
    default:
      return React.createElement(MessageCircle, { className: "h-4 w-4 sm:h-5 sm:w-5" })
  }
}
