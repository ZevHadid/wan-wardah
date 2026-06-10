'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

export default function BookPage() {
  const { id } = useParams()
  const [form, setForm] = useState({
    guest_name: '',
    guest_whatsapp: '',
    check_in: '',
    check_out: '',
    guest_count: 1,
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { error } = await supabase.from('bookings').insert({
      ...form,
      apartment_id: parseInt(id as string)
    })

    if (!error) {
      const waMessage = `Halo! Saya mau booking apartment.%0A%0ANama: ${form.guest_name}%0ACheck-in: ${form.check_in}%0ACheck-out: ${form.check_out}%0AJumlah tamu: ${form.guest_count}%0A%0A${form.message}`
      
      window.open(`https://wa.me/628123456789?text=${waMessage}`, '_blank')
      alert('Booking request sent! Mom will contact you on WhatsApp.')
    } else {
      alert('Error saving booking. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Book Apartment</h1>
      
      <input
        type="text"
        placeholder="Your Name *"
        required
        className="w-full p-2 mb-4 border rounded"
        onChange={e => setForm({...form, guest_name: e.target.value})}
      />
      
      <input
        type="tel"
        placeholder="WhatsApp Number (with country code) *"
        required
        className="w-full p-2 mb-4 border rounded"
        onChange={e => setForm({...form, guest_whatsapp: e.target.value})}
      />
      
      <input
        type="date"
        required
        className="w-full p-2 mb-4 border rounded"
        onChange={e => setForm({...form, check_in: e.target.value})}
      />
      
      <input
        type="date"
        required
        className="w-full p-2 mb-4 border rounded"
        onChange={e => setForm({...form, check_out: e.target.value})}
      />
      
      <input
        type="number"
        placeholder="Number of guests"
        min="1"
        className="w-full p-2 mb-4 border rounded"
        onChange={e => setForm({...form, guest_count: parseInt(e.target.value)})}
      />
      
      <textarea
        placeholder="Special requests or message"
        className="w-full p-2 mb-4 border rounded"
        rows={4}
        onChange={e => setForm({...form, message: e.target.value})}
      />
      
      <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
        Request Booking via WhatsApp
      </button>
    </form>
  )
}
