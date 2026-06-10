'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function CustomTripPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    guest_name: '',
    guest_whatsapp: '',
    destinations: '',
    duration: '',
    guest_count: 1,
    budget: '',
    special_requests: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.from('trip_bookings').insert([{
      guest_name: form.guest_name,
      guest_whatsapp: form.guest_whatsapp,
      package_id: null,
      trip_date: null,
      guest_count: form.guest_count,
      special_requests: `CUSTOM TRIP REQUEST:%0A Destinasi: ${form.destinations}%0A Durasi: ${form.duration}%0A Budget: ${form.budget}%0A Detail: ${form.special_requests}`,
      status: 'pending'
    }])
    
    if (!error) {
      const waMessage = `Halo! Saya mau REQUEST CUSTOM TRIP.%0A%0A` +
        `Nama: ${form.guest_name}%0A` +
        `Destinasi: ${form.destinations}%0A` +
        `Durasi: ${form.duration}%0A` +
        `Jumlah orang: ${form.guest_count}%0A` +
        `Budget estimasi: ${form.budget}%0A` +
        `Request khusus: ${form.special_requests}%0A%0A` +
        `Tolong buatkan itinerary dan informasikan harga total.`
      
      window.open(`https://wa.me/6281336338331?text=${waMessage}`, '_blank')
      alert('Custom trip request terkirim! Mami akan hubungi via WhatsApp.')
      router.push('/')
    } else {
      alert('Error: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Custom Private Trip</h1>
      <p className="text-gray-600 mb-4">Buat itinerary sesuai keinginanmu. Termasuk transport + driver.</p>
      
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
          type="text"
          placeholder="Destinasi yang diinginkan (contoh: Bandung, Jogja, Bali) *"
          required
          className="w-full p-2 border rounded"
          onChange={e => setForm({...form, destinations: e.target.value})}
        />
        <input
          type="text"
          placeholder="Durasi (contoh: 3 hari 2 malam) *"
          required
          className="w-full p-2 border rounded"
          onChange={e => setForm({...form, duration: e.target.value})}
        />
        <input
          type="number"
          placeholder="Jumlah orang"
          min="1"
          className="w-full p-2 border rounded"
          onChange={e => setForm({...form, guest_count: parseInt(e.target.value)})}
        />
        <input
          type="text"
          placeholder="Budget estimasi (opsional)"
          className="w-full p-2 border rounded"
          onChange={e => setForm({...form, budget: e.target.value})}
        />
        <textarea
          placeholder="Request khusus (hotel bintang berapa, mau visit tempat apa aja, dll)"
          className="w-full p-2 border rounded"
          rows={4}
          onChange={e => setForm({...form, special_requests: e.target.value})}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Mengirim...' : 'Kirim Request Custom Trip'}
        </button>
      </form>
    </div>
  )
}
