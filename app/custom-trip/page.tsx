'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
    <div className="max-w-2xl mx-auto px-4">
      <div className="card-beige p-8 space-y-8">
        <header className="text-center space-y-2 border-b border-border pb-6">
          <h1 className="text-3xl font-bold italic">Custom Private Trip</h1>
          <p className="text-accent italic">Rancang perjalanan impian Anda sendiri</p>
        </header>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-accent uppercase tracking-wider ml-1">Nama Lengkap</label>
              <input
                type="text"
                placeholder="cth: Budi Santoso"
                required
                className="input-beige"
                onChange={e => setForm({...form, guest_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-accent uppercase tracking-wider ml-1">Nomor WhatsApp</label>
              <input
                type="tel"
                placeholder="cth: 628123456789"
                required
                className="input-beige"
                onChange={e => setForm({...form, guest_whatsapp: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-accent uppercase tracking-wider ml-1">Destinasi Impian</label>
            <input
              type="text"
              placeholder="cth: Bandung, Jogja, atau Bali"
              required
              className="input-beige"
              onChange={e => setForm({...form, destinations: e.target.value})}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-accent uppercase tracking-wider ml-1">Durasi</label>
              <input
                type="text"
                placeholder="cth: 3 hari 2 malam"
                required
                className="input-beige"
                onChange={e => setForm({...form, duration: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-accent uppercase tracking-wider ml-1">Jumlah Orang</label>
              <input
                type="number"
                placeholder="cth: 5"
                min="1"
                className="input-beige"
                onChange={e => setForm({...form, guest_count: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-accent uppercase tracking-wider ml-1">Estimasi Budget (Opsional)</label>
            <input
              type="text"
              placeholder="Sebutkan range budget Anda"
              className="input-beige"
              onChange={e => setForm({...form, budget: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-accent uppercase tracking-wider ml-1">Permintaan Khusus</label>
            <textarea
              placeholder="Hotel bintang berapa? Tempat wisata apa yang wajib dikunjungi?"
              className="input-beige"
              rows={4}
              onChange={e => setForm({...form, special_requests: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full text-lg py-4 shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? 'Sedang Memproses...' : 'Kirim Request Custom Trip'}
            </button>
            <p className="text-center text-xs text-accent mt-4 italic">
              * Mami akan menghubungi Anda via WhatsApp untuk mendiskusikan itinerary
            </p>
          </div>
        </form>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-accent hover:text-primary transition-colors text-sm font-medium">
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}
