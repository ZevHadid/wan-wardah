'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'

export default function TripBookPage() {
  const { id } = useParams()
  const router = useRouter()
  const [trip, setTrip] = useState<any>(null)
  const [form, setForm] = useState({
    guest_name: '',
    guest_whatsapp: '',
    trip_date: '',
    guest_count: 1,
    special_requests: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase
      .from('trip_packages')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => setTrip(data))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.from('trip_bookings').insert([{ 
      ...form, 
      package_id: parseInt(id as string) 
    }])
    
    if (!error) {
      const waMessage = `Halo! Saya mau booking trip: ${trip?.name}%0A%0A` +
        `Nama: ${form.guest_name}%0A` +
        `Tanggal berangkat: ${form.trip_date}%0A` +
        `Jumlah orang: ${form.guest_count}%0A` +
        `Catatan: ${form.special_requests}%0A%0A` +
        `Tolong konfirmasi ketersediaan dan total harga.`
      
      window.open(`https://wa.me/6281336338331?text=${waMessage}`, '_blank')
      alert('Booking trip terkirim! Mami akan konfirmasi via WhatsApp.')
      router.push('/')
    } else {
      alert('Error: ' + error.message)
    }
    setLoading(false)
  }

  if (!trip) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Booking: {trip.name}</h1>
      <p className="text-gray-600 mb-4">Rp {trip.price_per_person?.toLocaleString()}/orang</p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Nama lengkap *"
          required
          className="w-full p-2 border rounded"
          onChange={e => setForm({...form, guest_name: e.target.value})}
        />
        <input
          type="tel"
          placeholder="Nomor WhatsApp *"
          required
          className="w-full p-2 border rounded"
          onChange={e => setForm({...form, guest_whatsapp: e.target.value})}
        />
        <input
          type="date"
          required
          className="w-full p-2 border rounded"
          onChange={e => setForm({...form, trip_date: e.target.value})}
        />
        <input
          type="number"
          placeholder="Jumlah orang"
          min="1"
          required
          className="w-full p-2 border rounded"
          onChange={e => setForm({...form, guest_count: parseInt(e.target.value)})}
        />
        <textarea
          placeholder="Catatan khusus (opsional)"
          className="w-full p-2 border rounded"
          rows={3}
          onChange={e => setForm({...form, special_requests: e.target.value})}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Mengirim...' : 'Kirim & Buka WhatsApp'}
        </button>
      </form>
    </div>
  )
}
