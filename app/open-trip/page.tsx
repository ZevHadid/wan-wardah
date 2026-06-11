'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function OpenTripPage() {
  const [lang, setLang] = useState<'id' | 'en'>('en')

  const content = {
    en: {
      title: "Open Trip Jakarta × Bogor",
      duration: "3 Days 2 Nights",
      subtitle: "The most viral spots, Instagrammable meals, and TikTok-worthy moments.",
      startingPrice: "IDR 3.500.000",
      includes: "Includes accommodation, transport, breakfast, guide",
      itinerary: [
        {
          day: "01",
          tag: "Day One · Jakarta",
          title: "Jakarta Vibes — Skyline & Viral Cafes",
          items: [
            { time: "07:00 – 08:30", name: "Breakfast at Viral Lakeside Cafe", desc: "Experience the magical lakeside vibes and aesthetic gelato/coffee near our apartment." },
            { time: "09:00 – 12:00", name: "Shopping Spree", desc: "Choose between Heritage (Pasar Baru), Wholesale (Tanah Abang), or Street Style (Blok M)." },
            { time: "12:30 – 14:00", name: "Authentic Padang Lunch", desc: "Traditional 'hidang' style meal. Must try: Rendang and special Indonesian tea." },
            { time: "14:30 – 18:00", name: "TikTok Viral Spots", desc: "Visit Thamrin Nine (Highest deck in Indonesia), Kota Tua (Heritage), and SCBD Habitat Park." }
          ]
        },
        {
          day: "02",
          tag: "Day Two · Bogor",
          title: "Bogor Escape — Rain City & Mountain Air",
          items: [
            { time: "07:00 – 08:30", name: "Morning Forest Coffee", desc: "Visit the viral pine forest cafe in Bogor for a refreshing mountain start." },
            { time: "12:00 – 13:30", name: "HeHa Waterfall Lunch", desc: "Dine at the largest artificial waterfall in Indonesia. Massive TikTok potential!" },
            { time: "14:00 – 17:30", name: "Nature & Glasshouse", desc: "Enchanting Valley petting zoo and the new Botanical Garden Glasshouse." }
          ]
        }
      ],
      cta: "Book This Open Trip"
    },
    id: {
      title: "Open Trip Jakarta × Bogor",
      duration: "3 Hari 2 Malam",
      subtitle: "Spot paling viral, makanan Instagrammable, dan momen TikTok-worthy.",
      startingPrice: "Rp 3.500.000",
      includes: "Termasuk akomodasi, transport, sarapan, guide",
      itinerary: [
        {
          day: "01",
          tag: "Hari Pertama · Jakarta",
          title: "Jakarta Vibes — Skyline & Kafe Viral",
          items: [
            { time: "07:00 – 08:30", name: "Sarapan di Kafe Tepi Danau Viral", desc: "Nikmati suasana danau yang magis dan gelato/kopi estetik dekat apartemen." },
            { time: "09:00 – 12:00", name: "Wisata Belanja", desc: "Pilih antara Heritage (Pasar Baru), Grosir (Tanah Abang), atau Street Style (Blok M)." },
            { time: "12:30 – 14:00", name: "Makan Siang Padang Autentik", desc: "Sistem hidang tradisional. Wajib coba: Rendang dan Teh Botol/Es Teh." },
            { time: "14:30 – 18:00", name: "Spot Viral TikTok", desc: "Kunjungi Thamrin Nine (Dek tertinggi di Indonesia), Kota Tua, dan SCBD Habitat Park." }
          ]
        },
        {
          day: "02",
          tag: "Hari Kedua · Bogor",
          title: "Bogor Escape — Kota Hujan & Udara Gunung",
          items: [
            { time: "07:00 – 08:30", name: "Kopi Hutan Pagi", desc: "Kunjungi kafe hutan pinus viral di Bogor untuk memulai hari yang segar." },
            { time: "12:00 – 13:30", name: "Makan Siang di HeHa Waterfall", desc: "Makan di air terjun buatan terbesar di Indonesia. Pasti masuk FYP!" },
            { time: "14:00 – 17:30", name: "Alam & Rumah Kaca", desc: "Enchanting Valley petting zoo dan Rumah Kaca baru di Kebun Raya Bogor." }
          ]
        }
      ],
      cta: "Pesan Open Trip Ini"
    }
  }

  const t = content[lang]

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20">
      <div className="flex justify-end mb-6">
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

      <header className="text-center space-y-4 mb-12">
        <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold tracking-widest uppercase">
          {t.duration}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight">
          {t.title}
        </h1>
        <p className="text-xl text-accent italic max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </header>

      <div className="card-beige bg-primary text-white p-8 mb-16 shadow-xl shadow-primary/20 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <p className="text-sm uppercase tracking-widest opacity-80 font-bold">{lang === 'en' ? 'Starting Price' : 'Harga Mulai'}</p>
          <p className="text-5xl font-bold font-serif">{t.startingPrice}</p>
          <p className="text-sm opacity-80 italic">{t.includes}</p>
        </div>
        <Link href="/custom-trip" className="bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform">
          {t.cta}
        </Link>
      </div>

      <div className="space-y-16">
        {t.itinerary.map((day, idx) => (
          <div key={idx} className="space-y-8">
            <div className="flex items-end gap-4 border-b border-border pb-4">
              <span className="text-7xl font-serif font-bold text-border leading-none italic">{day.day}</span>
              <div className="space-y-1">
                <p className="text-xs font-bold text-primary uppercase tracking-widest">{day.tag}</p>
                <h3 className="text-2xl font-bold italic">{day.title}</h3>
              </div>
            </div>

            <div className="grid gap-6">
              {day.items.map((item, i) => (
                <div key={i} className="card-beige p-6 group hover:border-primary/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <span className="text-primary font-bold whitespace-nowrap bg-primary/5 px-3 py-1 rounded text-sm self-start">
                      {item.time}
                    </span>
                    <div className="space-y-2">
                      <h4 className="text-xl font-bold">{item.name}</h4>
                      <p className="text-accent leading-relaxed italic">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 card-beige p-10 bg-secondary/10 border-secondary/30 text-center space-y-6">
        <h2 className="text-3xl font-serif font-bold italic">{lang === 'en' ? 'Ready for Your Next Viral Content?' : 'Siap Menuju FYP?'}</h2>
        <p className="text-accent italic max-w-xl mx-auto">
          {lang === 'en' 
            ? "Limited to 8 pax per trip to ensure quality content and personalized experience." 
            : "Terbatas untuk 8 orang per trip untuk kualitas konten dan pengalaman personal yang maksimal."}
        </p>
        <Link href="/custom-trip" className="btn-primary inline-flex items-center gap-2 px-12 py-4">
          {t.cta} →
        </Link>
      </div>
    </div>
  )
}
