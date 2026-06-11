'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BookPage() {
  const { id } = useParams()
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
    
    const { error } = await supabase.from('bookings').insert([{
      ...form,
      apartment_id: parseInt(id as string)
    }])

    if (!error) {
      const waMessage = `Halo! Saya mau booking apartemen di Jakarta.%0A%0A` +
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
      alert('Error saving booking. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="card-beige p-8 space-y-8">
        <header className="text-center space-y-2 border-b border-border pb-6">
          <h1 className="text-3xl font-bold italic">Booking Apartemen</h1>
          <p className="text-accent italic">Cozy Apartment in Jakarta (Unit #{id})</p>
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

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-accent uppercase tracking-wider ml-1">Check-In</label>
              <input
                type="date"
                required
                className="input-beige"
                onChange={e => setForm({...form, check_in: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-accent uppercase tracking-wider ml-1">Check-Out</label>
              <input
                type="date"
                required
                className="input-beige"
                onChange={e => setForm({...form, check_out: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-accent uppercase tracking-wider ml-1">Jumlah Tamu</label>
            <input
              type="number"
              placeholder="Maksimal 3 orang"
              min="1"
              max="3"
              className="input-beige"
              onChange={e => setForm({...form, guest_count: parseInt(e.target.value)})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-accent uppercase tracking-wider ml-1">Catatan (Opsional)</label>
            <textarea
              placeholder="Ada permintaan khusus?"
              className="input-beige"
              rows={3}
              onChange={e => setForm({...form, message: e.target.value})}
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
              * Mami akan menghubungi Anda via WhatsApp untuk detail pembayaran
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
