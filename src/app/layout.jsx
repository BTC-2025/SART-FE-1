import './globals.css'
import '../components/tabs/StoreTab.css'
import '../components/tabs/ProfileTab.css'
import '../components/tabs/WalletTab.css'
import '../components/modals/Modals.css'
import Script from 'next/script'
export const metadata = {
  title: 'SART - Universal Transport Booking Portal',
  description: 'SART Transport Booking Web Demo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* FontAwesome Icons */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        
        {/* Leaflet Map CSS */}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
      </head>
      <body className="light-theme">
        {/* Leaflet Map JS */}
        <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossOrigin="" />
        {children}
      </body>
    </html>
  )
}
