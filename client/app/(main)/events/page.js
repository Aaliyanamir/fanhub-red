'use client';

import { useState } from 'react';
import { EVENTS } from '@/data/events';
import Breadcrumbs from '@/components/Breadcrumbs';
import { MapPin, Calendar, ExternalLink, Filter, Compass, Ticket } from 'lucide-react';

const CITIES = ['All Cities', 'Los Angeles', 'San Diego', 'Tokyo', 'London'];

export default function EventsPage() {
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedEvent, setSelectedEvent] = useState(EVENTS[0]);

  const filteredEvents = selectedCity === 'All Cities'
    ? EVENTS
    : EVENTS.filter((e) => e.city.toLowerCase() === selectedCity.toLowerCase());

  return (
    <main className="min-h-screen bg-[#090C15] text-gray-50 transition-colors duration-500 pb-40">
      <div className="px-6 md:px-16 pt-8">
        <Breadcrumbs />

        <div className="mt-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#E50914] text-xs font-bold uppercase tracking-wider mb-1">
              <Compass size={16} /> Global Convention Radar
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight">
              Event Discovery & Calendar
            </h1>
            <p className="text-gray-400 text-lg mt-1">
              Discover nearby anime conventions, cosplay meetups, and screening schedules worldwide.
            </p>
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                const matched = EVENTS.find((ev) => e.target.value === 'All Cities' || ev.city === e.target.value);
                if (matched) setSelectedEvent(matched);
              }}
              className="px-4 py-2.5 rounded-2xl bg-gray-900 border border-gray-800 text-xs font-extrabold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-[#E50914] uppercase tracking-wider cursor-pointer"
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Main Layout: Real Google Maps Iframe + Schedule List ────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* REAL GOOGLE MAPS IFRAME CONTAINER (Left 7 Cols) */}
          <div className="lg:col-span-7 flex flex-col rounded-3xl overflow-hidden border border-gray-800 bg-gray-900/80 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-[#E50914]" />
                <h2 className="text-lg font-bold text-white">Interactive Google Location Map</h2>
              </div>
              <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-[#E50914]/20 text-[#E50914] uppercase tracking-wider border border-[#E50914]/30">
                {selectedEvent.city} Venue
              </span>
            </div>

            {/* Google Maps Iframe Container */}
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-black border border-gray-800 shadow-inner">
              <iframe
                key={selectedEvent.id}
                title={`Google Map - ${selectedEvent.title}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedEvent.mapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0 grayscale-[20%] contrast-125"
                loading="lazy"
                allowFullScreen
              />

              {/* Selected Venue Bottom Overlay Banner */}
              <div className="absolute bottom-3 left-3 right-3 z-10 bg-gray-950/95 backdrop-blur-md border border-gray-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-900 border border-gray-800">
                    <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{selectedEvent.title}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} className="text-[#E50914]" /> {selectedEvent.location}
                    </p>
                  </div>
                </div>

                <a
                  href={selectedEvent.ticketLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-red-700 text-white text-xs font-extrabold uppercase tracking-wider shrink-0 flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/50 transition-all"
                >
                  <Ticket size={14} /> Get Tickets <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>

          {/* Convention Schedule Cards List (Right 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar size={20} className="text-[#E50914]" /> Upcoming Convention Lineup
            </h2>

            {filteredEvents.map((evt) => {
              const isSelected = selectedEvent.id === evt.id;
              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className={`p-5 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#E50914] bg-[#E50914]/10 shadow-xl ring-1 ring-[#E50914]'
                      : 'border-gray-800/80 bg-gray-900/60 hover:border-[#E50914]/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914] uppercase tracking-wider">
                        {evt.category}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5">
                        {evt.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-800">
                    <span className="flex items-center gap-1 font-semibold text-[#E50914]">
                      <Calendar size={13} /> {evt.startDate} to {evt.endDate}
                    </span>
                    <span className="font-extrabold text-gray-300 uppercase">{evt.city}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      <div className="pb-32" />
    </main>
  );
}
