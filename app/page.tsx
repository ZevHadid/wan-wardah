'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [apartment, setApartment] = useState<any>(null)
  const [trips, setTrips] = useState<any[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const { data: apt } = await supabase.from('apartments').select('*')
        if (apt && apt.length > 0) setApartment(apt[0])
        
        const { data: tripData } = await supabase.from('trip_packages').select('*')
        if (tripData) setTrips(tripData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (!apartment) return <div className="p-8 text-center">No apartment found. Please add data in Supabase.</div>

  const images = apartment.images || []

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">{apartment.title}</h1>
      
      {/* Photo Gallery */}
      {images.length > 0 && (
        <div className="mb-4">
          <img 
            src={images[currentImageIndex]} 
            alt="Apartment" 
            className="w-full h-64 object-cover rounded"
          />
          {images.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-16 h-16 flex-shrink-0 rounded overflow-hidden ${idx === currentImageIndex ? 'border-2 border-blue-600' : 'border border-gray-200'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Description */}
      <p className="text-gray-600 mb-4">{apartment.description}</p>
      <p className="font-bold text-xl mb-2">Rp {apartment.price_per_night?.toLocaleString()}/malam</p>
      <p className="mb-4 text-gray-600">📍 {apartment.location} | 👥 Max {apartment.capacity} orang</p>
      
      {/* Special Price Note */}
      <div className="bg-yellow-100 p-3 rounded mb-6 border-l-4 border-yellow-500">
        <p className="font-bold">✨ SPECIAL DIRECT BOOKING PRICE ✨</p>
        <p className="text-sm">Harga ini lebih murah dari Traveloka/Agoda karena tidak ada komisi. Booking langsung = lebih hemat!</p>
      </div>
      
      {/* Book Button */}
      <Link 
        href="/book" 
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold mb-12 hover:bg-blue-700"
      >
        Booking Apartment Sekarang
      </Link>
      
      {/* Trip Packages Section */}
      <h2 className="text-2xl font-bold mt-8 mb-4">✈️ Open Trip Packages</h2>
      <div className="grid gap-6">
        {trips.map((trip) => (
          <div key={trip.id} className="border rounded-lg p-4 shadow-sm">
            {trip.image_url && (
              <img src={trip.image_url} alt={trip.name} className="w-full h-48 object-cover rounded mb-3" />
            )}
            <h3 className="text-xl font-bold">{trip.name}</h3>
            <p className="text-sm text-gray-600 mb-1">{trip.duration}</p>
            <p className="mb-2">{trip.destinations?.join(' → ')}</p>
            <p className="text-sm text-gray-600 mb-2">✅ Includes: {trip.includes?.join(', ')}</p>
            <p className="font-bold text-lg text-green-600 mb-3">Rp {trip.price_per_person?.toLocaleString()}/orang</p>
            <Link 
              href={`/trip-book/${trip.id}`} 
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Pesan Trip Ini
            </Link>
          </div>
        ))}
      </div>

      {/* Custom Private Trip */}
      <div className="border-2 border-dashed border-green-400 p-4 rounded mt-6 bg-green-50">
        <h3 className="font-bold text-lg mb-2">🚗 Custom Private Trip</h3>
        <p className="text-sm mb-3">Buat itinerary sendiri! Pilih destinasi sesuai keinginan. Plus transport + driver.</p>
        <Link 
          href="/custom-trip" 
          className="inline-block bg-green-600 text-white px-4 py-2 rounded"
        >
          Request Custom Trip →
        </Link>
      </div>
    </div>
  )
}
