'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const ADMIN_PASSWORD = 'wanwardah123'

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [apartment, setApartment] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [trips, setTrips] = useState<any[]>([])
  const [editing, setEditing] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (authenticated) loadData()
  }, [authenticated])

  async function loadData() {
    const { data: apt } = await supabase.from('apartments').select('*').single()
    setApartment(apt)
    
    const { data: bookingsData } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
    setBookings(bookingsData || [])
    
    const { data: tripsData } = await supabase
      .from('trip_bookings')
      .select('*, trip_packages(name)')
      .order('created_at', { ascending: false })
    setTrips(tripsData || [])
  }

  async function updateBookingStatus(id: number, status: string) {
    await supabase.from('bookings').update({ status }).eq('id', id)
    loadData()
  }

  async function updateApartment(e: React.FormEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    const { error } = await supabase
      .from('apartments')
      .update({
        title: formData.get('title'),
        description: formData.get('description'),
        price_per_night: parseInt(formData.get('price') as string),
        location: formData.get('location'),
        capacity: parseInt(formData.get('capacity') as string)
      })
      .eq('id', apartment.id)
    
    if (!error) {
      setEditing(false)
      loadData()
      alert('Updated!')
    }
  }

  async function uploadPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setUploading(true)
    const newImages = [...(apartment.images || [])]
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileName = `${Date.now()}-${file.name}`
      
      const { error: uploadError, data } = await supabase.storage
        .from('apartment-photos')
        .upload(fileName, file)
      
      if (uploadError) {
        alert('Upload failed: ' + uploadError.message)
        continue
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('apartment-photos')
        .getPublicUrl(fileName)
      
      newImages.push(publicUrl)
    }
    
    const { error } = await supabase
      .from('apartments')
      .update({ images: newImages })
      .eq('id', apartment.id)
    
    if (!error) {
      setApartment({ ...apartment, images: newImages })
      alert('Photos uploaded!')
    }
    
    setUploading(false)
  }

  async function deletePhoto(photoUrl: string) {
    const newImages = apartment.images.filter((p: string) => p !== photoUrl)
    const { error } = await supabase
      .from('apartments')
      .update({ images: newImages })
      .eq('id', apartment.id)
    
    if (!error) {
      setApartment({ ...apartment, images: newImages })
    }
  }

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto p-8 mt-20">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-xl font-bold mb-4">Admin Login</h1>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={() => {
              if (password === ADMIN_PASSWORD) setAuthenticated(true)
              else alert('Wrong password')
            }}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard - Wan Wardah</h1>
      
      {/* Apartment Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">🏠 Apartemen: Vittoria 16/C</h2>
          <button onClick={() => setEditing(!editing)} className="text-blue-600">
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        
        {editing ? (
          <form onSubmit={updateApartment} className="space-y-3">
            <input name="title" defaultValue={apartment?.title} className="w-full p-2 border rounded" />
            <textarea name="description" defaultValue={apartment?.description} className="w-full p-2 border rounded" rows={3} />
            <input name="price" type="number" defaultValue={apartment?.price_per_night} className="w-full p-2 border rounded" />
            <input name="location" defaultValue={apartment?.location} className="w-full p-2 border rounded" />
            <input name="capacity" type="number" defaultValue={apartment?.capacity} className="w-full p-2 border rounded" />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
          </form>
        ) : (
          <div>
            <p className="font-semibold">{apartment?.title}</p>
            <p className="text-gray-600 text-sm">{apartment?.description}</p>
            <p className="mt-2">💰 Rp {apartment?.price_per_night?.toLocaleString()}/malam</p>
            <p>📍 {apartment?.location}</p>
            <p>👥 Max {apartment?.capacity} tamu</p>
          </div>
        )}
        
        {/* Photo Upload */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold mb-3">📸 Foto Apartemen</h3>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {apartment?.images?.map((img: string, idx: number) => (
              <div key={idx} className="relative">
                <img src={img} className="w-full h-24 object-cover rounded" />
                <button onClick={() => deletePhoto(img)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-1 text-xs">×</button>
              </div>
            ))}
          </div>
          <input type="file" multiple accept="image/*" onChange={uploadPhotos} disabled={uploading} />
          {uploading && <p className="text-sm mt-2">Uploading...</p>}
          <p className="text-xs text-gray-500 mt-2">Klik atau drag foto untuk upload. Support JPG, PNG.</p>
        </div>
      </div>
      
      {/* Bookings */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">📋 Booking Apartemen</h2>
        {bookings.length === 0 && <p className="text-gray-500">Belum ada booking</p>}
        {bookings.map((booking) => (
          <div key={booking.id} className="border rounded p-4 mb-3">
            <div className="flex justify-between flex-wrap gap-2">
              <div>
                <p className="font-semibold">{booking.guest_name}</p>
                <p className="text-sm">📱 {booking.guest_whatsapp}</p>
                <p className="text-sm">📅 {booking.check_in} → {booking.check_out}</p>
                <p className="text-sm">👥 {booking.guest_count} tamu</p>
                {booking.message && <p className="text-sm text-gray-500">📝 {booking.message}</p>}
              </div>
              <div>
                <span className={`px-2 py-1 rounded text-xs ${booking.status === 'pending' ? 'bg-yellow-200' : 'bg-green-200'}`}>
                  {booking.status === 'pending' ? 'Menunggu' : 'Dikonfirmasi'}
                </span>
                {booking.status === 'pending' && (
                  <button onClick={() => updateBookingStatus(booking.id, 'confirmed')} className="ml-2 bg-green-600 text-white px-3 py-1 rounded text-sm">
                    Konfirmasi
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Trip Bookings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">✈️ Booking Trip</h2>
        {trips.length === 0 && <p className="text-gray-500">Belum ada booking trip</p>}
        {trips.map((booking) => (
          <div key={booking.id} className="border rounded p-4 mb-3">
            <p className="font-semibold">{booking.guest_name}</p>
            <p className="text-sm">📱 {booking.guest_whatsapp}</p>
            <p className="text-sm">🎒 {booking.trip_packages?.name || 'CUSTOM TRIP'}</p>
            <p className="text-sm">👥 {booking.guest_count} orang</p>
            {booking.special_requests && <p className="text-sm text-gray-500">📝 {booking.special_requests}</p>}
            <span className={`px-2 py-1 rounded text-xs ${booking.status === 'pending' ? 'bg-yellow-200' : 'bg-green-200'}`}>
              {booking.status === 'pending' ? 'Menunggu' : 'Dikonfirmasi'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
