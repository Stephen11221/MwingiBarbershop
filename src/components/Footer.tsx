import React from 'react';
import { MessageCircle, ShieldCheck, MapPin, Clock, Phone, Mail, Briefcase, Camera } from 'lucide-react';
import { SHOP_INFO } from '../data/mockData.ts';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenBooking: () => void;
  onOpenPhotoUpload?: () => void;
  onNavigateClock?: () => void;
  onNavigateAdminStaff?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenBooking,
  onOpenPhotoUpload,
  onNavigateClock,
  onNavigateAdminStaff
}) => {
  return (
    <footer className="bg-[#08080A] border-t border-[#1C1C22] text-zinc-400 text-xs relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif text-white tracking-wider uppercase">
              MWINGI HOME BOYZ
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Executive Barbershop, Mwingi. Luxury black and gold theme since 2019. Razor-sharp African fades, 360 waves, beard sculpting, and facial steam therapy.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#DFB76C]">
              <span>Sterilized Blades</span>
              <span>·</span>
              <span>Lounge Wi-Fi & Cold Refreshment</span>
            </div>
          </div>

          {/* Location & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Workstation & Location
            </h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#DFB76C] shrink-0 mt-0.5" />
              <div className="space-y-1 text-zinc-300">
                <div className="font-medium text-white">{SHOP_INFO.workstation || 'Mwingi Kitui County along Mwingi level IV hospital'}</div>
                <div className="text-[11px] text-zinc-400">Kitui County, Eastern Kenya</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-[#DFB76C] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div>Mon – Fri: {SHOP_INFO.hours.weekdays}</div>
                <div>Saturday: {SHOP_INFO.hours.saturday}</div>
                <div>Sunday: {SHOP_INFO.hours.sunday}</div>
              </div>
            </div>
          </div>

          {/* Direct Concierge Line */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Direct Contact & Jobs
            </h4>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#DFB76C] shrink-0" />
              <a href={`tel:${SHOP_INFO.phone}`} className="hover:text-white transition-colors">
                {SHOP_INFO.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <a
                href={`https://wa.me/${SHOP_INFO.phoneInternational}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors text-emerald-400 font-medium"
              >
                WhatsApp 0746145712
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#DFB76C] shrink-0" />
              <a href={`mailto:${SHOP_INFO.email}`} className="hover:text-white transition-colors">
                {SHOP_INFO.email}
              </a>
            </div>
            <div className="pt-2 border-t border-zinc-800/80">
              <a
                href="mailto:bannermwangi0@gmail.com?subject=Job%20Application%20-%20Mwingi%20Home%20Boyz%20Barbershop&body=Hello%20Banner%20Mwangi,%0A%0AI%20am%20applying%20for%20a%20Barber%20position%20at%20Mwingi%20Home%20Boyz%20Executive%20Barbershop%20(Mwingi%20Kitui%20County%20along%20Mwingi%20level%20IV%20hospital).%0A%0AMy%20Name:%0APhone:%0AExperience:%0A%0AThank%20you."
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181822] hover:bg-[#20202E] border border-[#DFB76C]/40 text-[#DFB76C] hover:text-white transition-colors text-[11px] font-medium"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Job Applications (bannermwangi0@gmail.com)</span>
              </a>
            </div>
          </div>

          {/* Chair Reservation CTA */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Reserve Your Station
            </h4>
            <p className="text-zinc-400">
              Walk-ins warmly welcomed. Book online to reserve your favorite barber and skip waiting in line.
            </p>
            <button
              onClick={onOpenBooking}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black text-xs font-semibold tracking-wider uppercase transition-opacity hover:opacity-90 cursor-pointer"
            >
              Book Station Now
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#18181E] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} Mwingi Home Boyz Cut. Mwingi, Kitui County.
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span>Surgical Hygiene Certified</span>
            <span>·</span>
            <span>M-Pesa Verified</span>
            <span>·</span>
            {onOpenPhotoUpload && (
              <>
                <button
                  onClick={onOpenPhotoUpload}
                  className="text-[#DFB76C] hover:text-white flex items-center gap-1 transition-colors cursor-pointer font-medium"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload Real Photos</span>
                </button>
                <span>·</span>
              </>
            )}
            <button
              onClick={onOpenAdmin}
              className="text-zinc-400 hover:text-[#DFB76C] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Owner & Appointments</span>
            </button>
            {onNavigateClock && (
              <>
                <span>·</span>
                <button
                  onClick={onNavigateClock}
                  className="text-zinc-400 hover:text-[#DFB76C] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-[#DFB76C]" />
                  <span>Staff Clock Kiosk (/clock)</span>
                </button>
              </>
            )}
            {onNavigateAdminStaff && (
              <>
                <span>·</span>
                <button
                  onClick={onNavigateAdminStaff}
                  className="text-zinc-400 hover:text-[#DFB76C] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#DFB76C]" />
                  <span>Staff Admin (/admin/staff)</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
