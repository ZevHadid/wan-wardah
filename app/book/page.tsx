'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function BookPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    guest_name: '',
    guest_whatsapp: '',
    check_in: '',
    check_out: '',
    guest_count: 1,
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.from('bookings').insert([form])
    
    if (!error) {
      const waMessage = `Halo! Saya mau booking apartemen Vittoria 16/C.%0A%0A` +
        `Nama: ${form.guest_name}%0A` +
        `Check-in: ${form.check_in}%0A` +
        `Check-out: ${form.check_out}%0A` +
        `Jumlah tamu: ${form.guest_count}%0A` +
        `Pesan: ${form.message}%0A%0A` +
        `Tolong konfirmasi ketersediaan dan total harga. Terima kasih!`
      
      window.open(`https://wa.me/6281336338331?text=${waMessage}`, '_blank')
      alert('Booking terkirim! Mami akan konfirmasi via WhatsApp.')
      router.push('/')
    } else {
      alert('Error: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Booking Apartemen Vittoria 16/C</h1>
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
          placeholder="Nomor WhatsApp (contoh: 628123456789) *"
          required
          className="w-full p-2 border rounded"
          onChange={e => setForm({...form, guest_whatsapp: e.target.value})}
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            required
            className="w-full p-2 border rounded"
            onChange={e => setForm({...form, check_in: e.target.value})}
          />
          <input
            type="date"
            required
            className="w-full p-2 border rounded"
            onChange={e => setForm({...form, check_out: e.target.value})}
          />
        </div>
        <input
          type="number"
          placeholder="Jumlah tamu"
          min="1"
          max="3"
          className="w-full p-2 border rounded"
          onChange={e => setForm({...form, guest_count: parseInt(e.target.value)})}
        />
        <textarea
          placeholder="Catatan (opsional)"
          className="w-full p-2 border rounded"
          rows={3}
          onChange={e => setForm({...form, message: e.target.value})}
        />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Mengirim...' : 'Kirim & Buka WhatsApp'}
        </button>
        <p className="text-xs text-gray-500 text-center mt-4">
          * Mami akan konfirmasi ketersediaan dan total harga via WhatsApp
        </p>
      </form>
    </div>
  )
}
