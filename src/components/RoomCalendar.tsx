"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { Booking } from "@/types";
import { format, isSameDay, parseISO } from "date-fns";
import "react-calendar/dist/Calendar.css";
// Custom styling for the calendar to match Tailwind theme
import "./RoomCalendar.css";

interface RoomCalendarProps {
    bookings: Booking[];
}

export function RoomCalendar({ bookings }: RoomCalendarProps) {
    const [date, setDate] = useState<Date>(new Date());
    const [selectedDateBookings, setSelectedDateBookings] = useState<Booking[]>([]);

    // Update selected bookings when date changes
    useEffect(() => {
        const bookingsOnDate = bookings.filter((booking) =>
            isSameDay(parseISO(booking.start_date), date)
        );
        setSelectedDateBookings(bookingsOnDate);
    }, [date, bookings]);

    const tileContent = ({ date: tileDate, view }: { date: Date; view: string }) => {
        if (view === "month") {
            const dayBookings = bookings.filter((booking) =>
                isSameDay(parseISO(booking.start_date), tileDate)
            );

            if (dayBookings.length > 0) {
                // Check if there are any approved bookings
                const hasApproved = dayBookings.some(b => b.status === "approved");
                const hasPending = dayBookings.some(b => b.status === "pending");

                return (
                    <div className="flex justify-center mt-1 gap-1">
                        {hasApproved && <div className="w-2 h-2 rounded-full bg-red-500" title="Booked" />}
                        {!hasApproved && hasPending && <div className="w-2 h-2 rounded-full bg-yellow-500" title="Pending" />}
                    </div>
                );
            }
        }
        return null;
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Room Availability</h3>
                <div className="calendar-container p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <Calendar
                        onChange={(val) => setDate(val as Date)}
                        value={date}
                        tileContent={tileContent}
                        className="w-full border-none"
                        minDate={new Date()}
                    />
                </div>
                <div className="mt-4 flex gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span>Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span>Pending</span>
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Schedule for {format(date, "MMMM d, yyyy")}
                </h3>

                <div className="bg-gray-50 rounded-lg p-6 min-h-[300px]">
                    {selectedDateBookings.length > 0 ? (
                        <div className="space-y-4">
                            {selectedDateBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className={`p-4 rounded-lg border-l-4 ${booking.status === 'approved'
                                            ? 'bg-white border-red-500 shadow-sm'
                                            : 'bg-white border-yellow-500 shadow-sm'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {booking.start_time} - {booking.end_time}
                                            </p>
                                            <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${booking.status === 'approved'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                    {booking.notes && (
                                        <p className="text-gray-500 text-sm mt-2">{booking.notes}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <p className="text-lg">No bookings for this date</p>
                            <p className="text-sm">This room is free all day!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
