"use client"

import { useQueries, useQuery } from 'convex/react'
import React from 'react'
import { api } from '../../../convex/_generated/api'
import Spinner from './Spinner';
import { Calendar, Ticket } from 'lucide-react';
import EventCard from '@/components/shared/EventCard';

const EventList = () => {
  const events = useQuery(api.event.get);

  if (!events) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const upcomingEvents = events
  .filter((event) => event.eventDate > Date.now())
  .sort((a,b) => a.eventDate - b.eventDate);

  const pastEvents = events
  .filter((event) => event.eventDate <= Date.now())
  .sort((a,b) => b.eventDate - a.eventDate);

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>

       {/* Header section */}
      <div className="flex item-center justify-between md-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Upcoming Events
          </h1>
          <p className="mt-2 text-gray-600">
            Discover & Book tickets for amazing events
          </p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          <div className="flexx items-center gap-2 text-gray-600">
            <Calendar className='w-5 h-5' />
            <span className="font-medium">
              {upcomingEvents.length} Upcoming Event
            </span>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md-12">
          {upcomingEvents.map((event) => (
            <EventCard key={event._id} eventId={event._id} />
          ))}
        </div>
        ) : (
          <div className="br-gray-50 rounded-lg p-12 text-center md-12">
            <Ticket className="w-12 h-12 text-gray-400 mx-auto md-4" />
              <h3 className="text-lg font-medium text-gray-900">
                No Upcoming Event
              </h3>
              <p className="text-gray-600 mt-1">Check back kater for new events</p>
          </div>
          )},

          {/* Past Events */}
      {pastEvents.length > 0 && (
        <>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Past Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard key={event._id} eventId={event._id} />
          ))}
          </div>
        </>
        )}
        
    </div>
  )
}

export default EventList