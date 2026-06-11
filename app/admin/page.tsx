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
      <div className="max-w-md mx-auto p-4 mt-20">
        <div className="card-beige p-8 space-y-6">
          <h1 className="text-2xl font-bold font-serif text-center">Admin Login</h1>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              className="input-beige"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (password === ADMIN_PASSWORD ? setAuthenticated(true) : alert('Salah password'))}
            />
            <button
              onClick={() => {
                if (password === ADMIN_PASSWORD) setAuthenticated(true)
                else alert('Wrong password')
              }}
              className="btn-primary w-full"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-10">
      <header className="flex justify-between items-center border-b border-border pb-6">
        <h1 className="text-3xl font-bold font-serif">Admin Dashboard</h1>
        <button onClick={() => setAuthenticated(false)} className="text-sm text-accent hover:text-primary underline">Logout</button>
      </header>
      
      {/* Apartment Section */}
      <section className="card-beige p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold font-serif">🏠 Pengaturan Apartemen</h2>
          <button 
            onClick={() => setEditing(!editing)} 
            className="text-primary font-semibold text-sm hover:underline"
          >
            {editing ? 'Batal' : 'Edit Detail'}
          </button>
        </div>
        
        {editing ? (
          <form onSubmit={updateApartment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs uppercase font-bold text-accent">Judul</label>
              <input name="title" defaultValue={apartment?.title} className="input-beige" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs uppercase font-bold text-accent">Deskripsi</label>
              <textarea name="description" defaultValue={apartment?.description} className="input-beige" rows={4} />
            </div>
            <div>
              <label className="text-xs uppercase font-bold text-accent">Harga / Malam</label>
              <input name="price" type="number" defaultValue={apartment?.price_per_night} className="input-beige" />
            </div>
            <div>
              <label className="text-xs uppercase font-bold text-accent">Lokasi</label>
              <input name="location" defaultValue={apartment?.location} className="input-beige" />
            </div>
            <div>
              <label className="text-xs uppercase font-bold text-accent">Kapasitas Tamu</label>
              <input name="capacity" type="number" defaultValue={apartment?.capacity} className="input-beige" />
            </div>
            <div className="md:col-span-2 pt-2">
              <button type="submit" className="btn-primary w-full md:w-auto">Simpan Perubahan</button>
            </div>
          </form>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 bg-secondary/10 p-4 rounded-xl">
            <div className="space-y-2">
              <p className="text-sm text-accent font-bold uppercase tracking-widest">Detail Unit</p>
              <p className="font-bold text-lg">{apartment?.title}</p>
              <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3">{apartment?.description}</p>
            </div>
            <div className="space-y-1 text-sm pt-6 md:pt-0">
              <p>💰 <span className="font-bold">Rp {apartment?.price_per_night?.toLocaleString()}</span> / malam</p>
              <p>📍 {apartment?.location}</p>
              <p>👥 Max {apartment?.capacity} tamu</p>
            </div>
          </div>
        )}
        
        {/* Photo Upload */}
        <div className="mt-6 pt-6 border-t border-border space-y-4">
          <h3 className="font-semibold text-accent uppercase tracking-widest text-sm">📸 Gallery Foto</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {apartment?.images?.map((img: string, idx: number) => (
              <div key={idx} className="relative aspect-square group">
                <img src={img} className="w-full h-full object-cover rounded-lg shadow-sm" />
                <button 
                  onClick={() => deletePhoto(img)} 
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <div className="pt-4">
            <label className="inline-flex items-center gap-2 cursor-pointer bg-white border-2 border-dashed border-border p-4 rounded-xl hover:border-primary transition-colors w-full justify-center">
              <span className="text-sm font-medium text-accent">
                {uploading ? '⏳ Mengunggah...' : '➕ Tambah Foto Baru'}
              </span>
              <input type="file" multiple accept="image/*" onChange={uploadPhotos} disabled={uploading} className="hidden" />
            </label>
          </div>
        </div>
      </section>
      
      <div className="grid md:grid-cols-2 gap-10">
        {/* Bookings */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif px-2">📋 Booking Apartemen</h2>
          {bookings.length === 0 && <p className="text-accent italic px-2">Belum ada booking</p>}
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="card-beige p-5 space-y-3 relative overflow-hidden">
                {booking.status === 'confirmed' && <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-bl-lg">Confirmed</div>}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg">{booking.guest_name}</p>
                    <p className="text-xs text-accent font-semibold">📱 {booking.guest_whatsapp}</p>
                  </div>
                  {booking.status === 'pending' && (
                    <button 
                      onClick={() => updateBookingStatus(booking.id, 'confirmed')} 
                      className="text-xs bg-primary text-white px-3 py-1.5 rounded-full font-bold shadow-sm"
                    >
                      Konfirmasi
                    </button>
                  )}
                </div>
                <div className="text-sm space-y-1 text-foreground/80">
                  <p className="flex items-center gap-2 italic">
                    <span className="text-primary">📅</span> {booking.check_in} → {booking.check_out}
                  </p>
                  <p>👥 {booking.guest_count} tamu</p>
                  {booking.message && <div className="mt-2 p-2 bg-background rounded text-xs italic">"{booking.message}"</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Trip Bookings */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-serif px-2">✈️ Booking Trip</h2>
          {trips.length === 0 && <p className="text-accent italic px-2">Belum ada booking trip</p>}
          <div className="space-y-4">
            {trips.map((booking) => (
              <div key={booking.id} className="card-beige p-5 space-y-3 border-l-4 border-secondary">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-lg">{booking.guest_name}</p>
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${booking.status === 'pending' ? 'bg-secondary/30 text-accent' : 'bg-green-100 text-green-700'}`}>
                    {booking.status === 'pending' ? 'Pending' : 'Done'}
                  </span>
                </div>
                <div className="text-sm space-y-1 text-foreground/80">
                  <p className="text-primary font-bold">🎒 {booking.trip_packages?.name || 'CUSTOM TRIP'}</p>
                  <p className="text-xs text-accent font-semibold">📱 {booking.guest_whatsapp}</p>
                  <p>👥 {booking.guest_count} orang</p>
                  {booking.special_requests && (
                    <div className="mt-2 p-2 bg-background rounded text-xs italic line-clamp-2">
                      {booking.special_requests}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
