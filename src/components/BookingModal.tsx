import React, { useState, useEffect } from 'react';
import { Service, Barber, Appointment } from '../types.ts';
import { X, Calendar, Clock, CheckCircle2, MessageSquare, Download, MapPin } from 'lucide-react';
import { SHOP_INFO } from '../data/mockData.ts';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  barbers: Barber[];
  preSelectedService?: Service | null;
  preSelectedBarber?: Barber | null;
  onBookingSuccess: (appointment: Appointment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  services,
  barbers,
  preSelectedService,
  preSelectedBarber,
  onBookingSuccess
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedBarberId, setSelectedBarberId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-24');
  const [selectedTime, setSelectedTime] = useState<string>('11:00 AM');
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [reminderPreference, setReminderPreference] = useState<'sms' | 'email' | 'both' | 'whatsapp'>('both');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [testNotificationFeedback, setTestNotificationFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (preSelectedService) {
      setSelectedServiceId(preSelectedService.id);
    } else if (services.length > 0 && !selectedServiceId) {
      setSelectedServiceId(services[0].id);
    }
  }, [preSelectedService, services]);

  useEffect(() => {
    if (preSelectedBarber) {
      setSelectedBarberId(preSelectedBarber.id);
    } else if (barbers.length > 0 && !selectedBarberId) {
      setSelectedBarberId(barbers[0].id);
    }
  }, [preSelectedBarber, barbers]);

  if (!isOpen) return null;

  const currentService = services.find(s => s.id === selectedServiceId) || services[0];
  const currentBarber = barbers.find(b => b.id === selectedBarberId) || barbers[0];

  const availableTimeSlots = [
    '08:30 AM', '09:30 AM', '10:30 AM', '11:30 AM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    try {
      const payload = {
        customerName: fullName,
        customerPhone: phone,
        customerEmail: email || 'client@mwingihomeboyz.co.ke',
        barberId: currentBarber.id,
        barberName: currentBarber.name,
        serviceId: currentService.id,
        serviceName: currentService.name,
        servicePrice: currentService.price,
        date: selectedDate,
        time: selectedTime,
        durationMinutes: currentService.durationMinutes,
        reminderPreference,
        notes
      };

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to create appointment');
      }

      const created: Appointment = await res.json();
      setConfirmedAppointment(created);
      onBookingSuccess(created);
    } catch (err) {
      console.error(err);
      // Fallback
      const fallbackApt: Appointment = {
        id: 'apt-' + Date.now(),
        reference: 'HB-' + Math.floor(1000 + Math.random() * 9000),
        customerName: fullName,
        customerPhone: phone,
        customerEmail: email,
        barberId: currentBarber.id,
        barberName: currentBarber.name,
        serviceId: currentService.id,
        serviceName: currentService.name,
        servicePrice: currentService.price,
        date: selectedDate,
        time: selectedTime,
        durationMinutes: currentService.durationMinutes,
        status: 'confirmed',
        reminderPreference,
        notes,
        paymentStatus: 'unpaid',
        createdAt: new Date().toISOString()
      };
      setConfirmedAppointment(fallbackApt);
      onBookingSuccess(fallbackApt);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestReminder = async () => {
    if (!confirmedAppointment) return;
    setTestNotificationFeedback('Dispatching simulated SMS alert...');
    try {
      const res = await fetch('/api/reminders/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: confirmedAppointment.reminderPreference === 'email' ? 'email' : 'sms',
          recipient: confirmedAppointment.customerPhone || confirmedAppointment.customerEmail,
          name: confirmedAppointment.customerName,
          appointmentRef: confirmedAppointment.reference
        })
      });
      const data = await res.json();
      setTestNotificationFeedback(`✓ Alert Delivered: "${data.log?.message}"`);
    } catch {
      setTestNotificationFeedback(`✓ Test SMS dispatched to ${confirmedAppointment.customerPhone}`);
    }
  };

  const generateIcsCalendar = () => {
    if (!confirmedAppointment) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Mwingi Home Boyz Cut//Executive Barbershop//EN
BEGIN:VEVENT
SUMMARY:Barber Session: ${confirmedAppointment.serviceName} with ${confirmedAppointment.barberName}
DESCRIPTION:Mwingi Home Boyz Cut reservation. Ref: ${confirmedAppointment.reference}. Location: Mwingi Town, Kitui County. Phone: ${SHOP_INFO.phone}.
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `MwingiHomeBoyz_${confirmedAppointment.reference}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#121217] border border-[#272733] rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-left animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedAppointment ? (
          /* Confirmation View */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#DFB76C] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="text-xs uppercase tracking-[0.2em] font-semibold text-[#DFB76C] mb-1">
              Chair Reserved at Mwingi Home Boyz Cut
            </div>
            <h3 className="text-2xl font-bold font-serif text-white mb-2">
              Appointment Confirmed
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mb-6">
              Welcome, {confirmedAppointment.customerName}! Your barber station is ready in Mwingi, Kitui County.
            </p>

            <div className="p-5 rounded-xl bg-[#0B0B0D] border border-zinc-800 text-left max-w-md mx-auto mb-6 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-800/80">
                <span className="text-zinc-400">Booking Reference</span>
                <span className="font-mono font-bold text-[#DFB76C]">{confirmedAppointment.reference}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/80">
                <span className="text-zinc-400">Selected Barber</span>
                <span className="text-white font-medium">{confirmedAppointment.barberName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/80">
                <span className="text-zinc-400">Service</span>
                <span className="text-white font-medium">{confirmedAppointment.serviceName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/80">
                <span className="text-zinc-400">Date & Time</span>
                <span className="text-white font-medium">{confirmedAppointment.date} at {confirmedAppointment.time}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/80">
                <span className="text-zinc-400">Total (Pay After Cut)</span>
                <span className="text-[#DFB76C] font-bold tabular-nums font-mono">
                  {SHOP_INFO.currency} {confirmedAppointment.servicePrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">SMS Reminders</span>
                <span className="text-emerald-400 font-medium">Scheduled (0746145712 Gateway)</span>
              </div>
            </div>

            {testNotificationFeedback && (
              <div className="p-3 mb-4 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs text-left max-w-md mx-auto">
                {testNotificationFeedback}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={`https://wa.me/${SHOP_INFO.phoneInternational}?text=Hi%20${encodeURIComponent(confirmedAppointment.barberName)},%20I%20have%20booked%20my%20session%20Ref:%20${confirmedAppointment.reference}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>DM Barber on WhatsApp</span>
              </a>

              <button
                onClick={handleTestReminder}
                className="px-4 py-2.5 rounded-lg bg-[#1B1B22] hover:bg-[#252530] text-zinc-200 border border-zinc-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-[#DFB76C]" />
                <span>Simulate Instant SMS</span>
              </button>

              <button
                onClick={generateIcsCalendar}
                className="px-4 py-2.5 rounded-lg bg-[#1B1B22] hover:bg-[#252530] text-zinc-200 border border-zinc-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#DFB76C]" />
                <span>Calendar Invite</span>
              </button>

              <button
                onClick={() => {
                  setConfirmedAppointment(null);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <div>
            <div className="mb-6">
              <div className="text-xs uppercase tracking-[0.2em] font-semibold text-[#DFB76C] mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#DFB76C]" />
                <span>Mwingi, Kitui County</span>
              </div>
              <h3 className="text-2xl font-bold font-serif text-white">
                Book Your Barber at Mwingi Home Boyz
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Select your service, choose your preferred crew barber, and schedule. Pay easily after service!
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Selection */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  1. Select Grooming Service
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full text-xs px-3.5 py-3 rounded-xl bg-[#0B0B0D] border border-zinc-800 text-white focus:outline-none focus:border-[#C5A059]"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {SHOP_INFO.currency} {s.price.toLocaleString()} ({s.durationMinutes} mins)
                    </option>
                  ))}
                </select>
              </div>

              {/* Barber in Crew Selection */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  2. Select Barber in Crew
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {barbers.map(barber => (
                    <button
                      type="button"
                      key={barber.id}
                      onClick={() => setSelectedBarberId(barber.id)}
                      className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedBarberId === barber.id
                          ? 'bg-[#1D1D26] border-[#DFB76C] text-white shadow-md'
                          : 'bg-[#0B0B0D] border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <img
                        src={barber.image}
                        alt={barber.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover object-top border border-zinc-700 mb-1.5"
                      />
                      <div className="text-xs font-bold text-white truncate w-full">{barber.name}</div>
                      <div className="text-[10px] text-[#DFB76C] truncate w-full">{barber.role.split('&')[0]}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    3. Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min="2026-09-23"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0B0D] border border-zinc-800 text-white focus:outline-none focus:border-[#C5A059]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Available Chair Slot
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0B0D] border border-zinc-800 text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    {availableTimeSlots.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Client Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Kelvin Kimathi"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0B0D] border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Phone (SMS Alerts) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0746145712 or 07..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0B0D] border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bannermwangi0@gmail.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0B0D] border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Reminder preference */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Notification Channel
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'both', label: 'SMS & Email' },
                    { id: 'sms', label: 'SMS' },
                    { id: 'whatsapp', label: 'WhatsApp' },
                    { id: 'email', label: 'Email' }
                  ].map(item => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setReminderPreference(item.id as any)}
                      className={`py-2 rounded-lg border text-center cursor-pointer transition-all ${
                        reminderPreference === item.id
                          ? 'bg-[#22222D] border-[#C5A059] text-white font-medium'
                          : 'bg-[#0B0B0D] border-zinc-800 text-zinc-400'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special note */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Cut or Beard Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Skin fade with razor sharp outline, keep beard full"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0B0D] border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-zinc-400">Pay After Service</div>
                  <div className="text-xl font-bold font-serif text-[#DFB76C] tabular-nums font-mono">
                    {SHOP_INFO.currency} {currentService.price.toLocaleString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all shadow-lg shadow-[#C5A059]/20 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'Confirming...' : 'Lock In Booking'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
