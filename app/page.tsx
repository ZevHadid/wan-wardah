'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Home() {
  const [apartment, setApartment] = useState<any>(null)
  const [trips, setTrips] = useState<any[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<'id' | 'en'>('en')

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

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <div className="w-12 h-12 border-4 border-secondary border-t-primary rounded-full animate-spin"></div>
      <p className="font-serif italic text-accent">
        {lang === 'en' ? 'Preparing the best experience for you...' : 'Menyiapkan pengalaman terbaik untuk Anda...'}
      </p>
    </div>
  )
  
  if (!apartment) return (
    <div className="max-w-md mx-auto mt-20 text-center p-8 card-beige">
      <h2 className="text-2xl font-bold mb-4">No Data Yet</h2>
      <p className="text-accent mb-6">Please add data in Supabase.</p>
    </div>
  )

  const images = apartment.images || []

  // Anonymize the title for display
  const displayTitle = lang === 'en' ? "Cozy Apartment in West Jakarta" : "Apartemen Nyaman di Jakarta Barat";

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-12">
      {/* Language Toggle */}
      <div className="flex justify-end">
        <div className="bg-secondary/20 p-1 rounded-lg border border-border">
          <button 
            onClick={() => setLang('id')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${lang === 'id' ? 'bg-white shadow-sm text-primary' : 'text-accent hover:text-primary'}`}
          >
            ID
          </button>
          <button 
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${lang === 'en' ? 'bg-white shadow-sm text-primary' : 'text-accent hover:text-primary'}`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Apartment Hero Section */}
      <section className="space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{displayTitle}</h1>
          <p className="text-accent flex items-center justify-center gap-2">
            <span>📍 {lang === 'en' ? 'West Jakarta' : 'Jakarta Barat'}</span>
            <span className="w-1 h-1 bg-border rounded-full"></span>
            <span>👥 Max {apartment.capacity} {lang === 'en' ? 'guests' : 'orang'}</span>
          </p>
        </header>
        
        {/* Photo Gallery */}
        {images.length > 0 && (
          <div className="card-beige shadow-xl group">
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={images[currentImageIndex]} 
                alt="Apartment" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>
            
            {images.length > 1 && (
              <div className="p-4 flex gap-3 overflow-x-auto scrollbar-hide">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${
                      idx === currentImageIndex 
                        ? 'ring-4 ring-primary/50 scale-95' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Details & Pricing */}
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-semibold">
              {lang === 'en' ? 'About This Unit' : 'Tentang Unit Ini'}
            </h2>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line italic">
              {apartment.description}
            </p>
          </div>
          
          <div className="card-beige p-6 space-y-6 border-primary/20 bg-primary/5">
            <div className="space-y-1 text-center md:text-left">
              <p className="text-sm uppercase tracking-wider text-accent font-semibold">
                {lang === 'en' ? 'Starting from' : 'Mulai dari'}
              </p>
              <p className="text-3xl font-bold text-primary">
                Rp {apartment.price_per_night?.toLocaleString()}
                <span className="text-sm text-accent font-normal block">
                  {lang === 'en' ? 'per night' : 'per malam'}
                </span>
              </p>
            </div>
            
            <div className="bg-white/80 p-4 rounded-xl border border-border text-sm space-y-2">
              <p className="font-bold flex items-center gap-2 text-primary">
                <span className="text-lg">✨</span> SPECIAL DIRECT PRICE
              </p>
              <p className="text-accent leading-snug">
                {lang === 'en' 
                  ? 'Booking directly is cheaper! No platform commission fees.' 
                  : 'Booking langsung lebih hemat! Tanpa biaya komisi platform.'}
              </p>
            </div>
            
            <Link 
              href="/book" 
              className="btn-primary w-full text-lg py-4 shadow-lg shadow-primary/20"
            >
              {lang === 'en' ? 'Check Availability' : 'Cek Ketersediaan'}
            </Link>
          </div>
        </div>
      </section>

      {/* Signature Open Trip Section */}
      <section className="relative overflow-hidden rounded-3xl bg-primary text-white p-8 md:p-12 text-center space-y-6 shadow-2xl shadow-primary/30">
        <div className="absolute top-0 right-0 p-4">
          <span className="bg-white text-primary px-3 py-1 rounded-full text-xs font-bold animate-pulse uppercase tracking-tighter">New Program</span>
        </div>
        <div className="relative space-y-3">
          <h2 className="text-3xl md:text-5xl font-bold font-serif italic">Signature Open Trip</h2>
          <p className="text-lg opacity-90 italic max-w-2xl mx-auto">
            {lang === 'en' 
              ? "Jakarta × Bogor 3D2N Experience. Curated for travellers who want the most viral, Instagrammable spots." 
              : "Pengalaman Jakarta × Bogor 3D2N. Dikurasi untuk traveler yang mencari spot paling viral dan Instagrammable."}
          </p>
        </div>
        <Link 
          href="/open-trip" 
          className="relative inline-flex items-center gap-2 bg-white text-primary px-10 py-4 rounded-xl font-bold hover:scale-105 transition-all duration-300 group shadow-lg"
        >
          {lang === 'en' ? 'View Itinerary' : 'Lihat Itinerary'}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </section>
      
      {/* Other Trip Packages Section */}
      <section className="space-y-8 pt-8 border-t border-border">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold italic">
            {lang === 'en' ? 'Private & Open Trip' : 'Private & Open Trip'}
          </h2>
          <p className="text-accent italic">
            {lang === 'en' 
              ? 'Explore the beauty around with our exclusive tour packages' 
              : 'Jelajahi keindahan sekitar dengan paket tour eksklusif kami'}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {trips.map((trip) => (
            <div key={trip.id} className="card-beige group hover:shadow-2xl transition-all duration-500">
              <div className="relative aspect-[16/10] overflow-hidden">
                {trip.image_url && (
                  <img src={trip.image_url} alt={trip.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-primary shadow-sm">
                  {trip.duration}
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold">{trip.name}</h3>
                
                <div className="flex flex-wrap gap-2">
                  {trip.destinations?.map((dest: string, i: number) => (
                    <span key={i} className="text-xs bg-secondary/30 px-2 py-1 rounded text-accent">
                      {dest}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <p className="font-bold text-xl text-primary">
                    Rp {trip.price_per_person?.toLocaleString()}
                    <span className="text-xs text-accent font-normal ml-1">/{lang === 'en' ? 'person' : 'orang'}</span>
                  </p>
                  <Link 
                    href={`/trip-book/${trip.id}`} 
                    className="btn-primary py-2 px-6"
                  >
                    {lang === 'en' ? 'Details' : 'Detail'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Private Trip Call-to-Action */}
        <div className="relative overflow-hidden rounded-3xl bg-secondary/20 border border-secondary p-8 md:p-12 text-center space-y-6">
          <div className="relative space-y-3">
            <h3 className="text-3xl font-bold font-serif italic">🚗 Custom Private Trip</h3>
            <p className="text-lg text-accent max-w-xl mx-auto italic">
              {lang === 'en' 
                ? "Want a different route? Create your own itinerary and determine your dream destination." 
                : "Ingin rute yang berbeda? Buat itinerary Anda sendiri dan tentukan destinasi impian Anda."}
            </p>
          </div>
          
          <Link 
            href="/custom-trip" 
            className="relative inline-flex items-center gap-2 bg-white text-primary border-2 border-primary px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-all duration-300 group shadow-sm"
          >
            {lang === 'en' ? 'Request Custom Trip' : 'Request Custom Trip'} 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
