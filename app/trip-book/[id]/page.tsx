'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

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

  if (!trip) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="w-12 h-12 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
      <p className="font-serif italic text-accent">Memuat detail trip...</p>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="card-beige p-8 space-y-8">
        <header className="text-center space-y-2 border-b border-border pb-6">
          <h1 className="text-3xl font-bold italic">Booking Trip</h1>
          <p className="text-xl font-serif text-primary">{trip.name}</p>
          <p className="text-accent italic">Rp {trip.price_per_person?.toLocaleString()} / orang</p>
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

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-accent uppercase tracking-wider ml-1">Tanggal Berangkat</label>
              <input
                type="date"
                required
                className="input-beige"
                onChange={e => setForm({...form, trip_date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-accent uppercase tracking-wider ml-1">Jumlah Orang</label>
              <input
                type="number"
                placeholder="Jumlah peserta"
                min="1"
                required
                className="input-beige"
                onChange={e => setForm({...form, guest_count: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-accent uppercase tracking-wider ml-1">Catatan Khusus (Opsional)</label>
            <textarea
              placeholder="Ada alergi makanan atau request khusus?"
              className="input-beige"
              rows={3}
              onChange={e => setForm({...form, special_requests: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full text-lg py-4 shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? 'Sedang Memproses...' : 'Kirim & Konfirmasi WhatsApp'}
            </button>
            <p className="text-center text-xs text-accent mt-4 italic">
              * Mami akan menghubungi Anda via WhatsApp untuk detail paket trip
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
