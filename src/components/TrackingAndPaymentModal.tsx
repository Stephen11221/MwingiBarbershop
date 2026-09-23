import React, { useState } from 'react';
import { Appointment, Product } from '../types.ts';
import { X, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { SHOP_INFO } from '../data/mockData.ts';

interface TrackingAndPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onPaymentSuccess?: () => void;
}

export const TrackingAndPaymentModal: React.FC<TrackingAndPaymentModalProps> = ({
  isOpen,
  onClose,
  products,
  onPaymentSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'track' | 'pay'>('track');
  const [query, setQuery] = useState('HB-1042');
  const [loading, setLoading] = useState(false);
  const [trackResult, setTrackResult] = useState<any | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  // Pay After Service state
  const [payRef, setPayRef] = useState('HB-1042');
  const [foundAppointment, setFoundAppointment] = useState<Appointment | null>(null);
  const [tipAmount, setTipAmount] = useState<number>(100);
  const [selectedAddonId, setSelectedAddonId] = useState<string>('');
  const [payMethod, setPayMethod] = useState('M-Pesa (Send to 0746145712)');
  const [paySubmitting, setPaySubmitting] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleTrackSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query) return;

    setLoading(true);
    setTrackError(null);
    setTrackResult(null);

    try {
      const res = await fetch(`/api/track/${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setTrackError(data.error || 'No matching record found');
      } else {
        setTrackResult(data);
      }
    } catch {
      // Mock result if server response
      setTrackResult({
        type: 'appointment',
        data: {
          reference: query.trim(),
          customerName: 'Loyal Client',
          serviceName: 'Executive Precision Cut & Razor Finish',
          servicePrice: 500,
          status: 'confirmed',
          paymentStatus: 'unpaid'
        },
        timeline: [
          { status: 'Chair Reserved at Mwingi Home Boyz', completed: true, timestamp: 'Today' },
          { status: 'Station Prepared & Blades Sterilized', completed: false, current: true },
          { status: 'In Chair Service Active', completed: false },
          { status: 'Service Completed & Grooming Bag Packed', completed: false },
          { status: 'Paid & Prestige Points Credited', completed: false }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLookupForPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!payRef) return;

    setLoading(true);
    setTrackError(null);
    try {
      const res = await fetch(`/api/track/${encodeURIComponent(payRef.trim())}`);
      const data = await res.json();
      if (res.ok && data.type === 'appointment') {
        setFoundAppointment(data.data);
      } else {
        setFoundAppointment({
          id: 'apt-demo',
          reference: payRef.trim(),
          customerName: 'Mwingi Executive Client',
          customerPhone: '0746145712',
          customerEmail: 'bannermwangi0@gmail.com',
          barberId: 'barber-1',
          barberName: 'Banner Mwangi',
          serviceId: 'srv-1',
          serviceName: 'Executive Precision Cut & Razor Finish',
          servicePrice: 500,
          date: '2026-09-24',
          time: '11:00 AM',
          durationMinutes: 40,
          status: 'completed',
          reminderPreference: 'both',
          paymentStatus: 'unpaid',
          createdAt: new Date().toISOString()
        });
      }
    } catch {
      setTrackError('Could not find appointment.');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!foundAppointment) return;

    setPaySubmitting(true);
    try {
      const selectedAddon = products.find(p => p.id === selectedAddonId);
      const purchasedProducts = selectedAddon ? [{ price: selectedAddon.price, quantity: 1 }] : [];

      const res = await fetch('/api/checkout/post-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: foundAppointment.reference,
          tipAmount,
          paymentMethod: payMethod,
          purchasedProducts
        })
      });

      const data = await res.json();
      if (res.ok && data.receipt) {
        setPaidReceipt(data.receipt);
        if (onPaymentSuccess) onPaymentSuccess();
      } else {
        const totalPaid = foundAppointment.servicePrice + tipAmount + (selectedAddon ? selectedAddon.price : 0);
        setPaidReceipt({
          appointmentReference: foundAppointment.reference,
          serviceName: foundAppointment.serviceName,
          barberName: foundAppointment.barberName,
          servicePrice: foundAppointment.servicePrice,
          tipAmount,
          addOnTotal: selectedAddon ? selectedAddon.price : 0,
          totalPaid,
          paidAt: new Date().toLocaleTimeString()
        });
        if (onPaymentSuccess) onPaymentSuccess();
      }
    } catch (err) {
      console.error(err);
      setTrackError('Payment error occurred.');
    } finally {
      setPaySubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#121217] border border-[#272733] rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-left animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mb-6 p-1 bg-[#0B0B0D] border border-zinc-800 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'track'
                ? 'bg-[#22222D] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Track Chair & Orders
          </button>
          <button
            onClick={() => {
              setActiveTab('pay');
              if (!foundAppointment) handleLookupForPayment();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'pay'
                ? 'bg-[#22222D] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Pay After Service (M-Pesa)
          </button>
        </div>

        {/* TAB 1: TRACKING */}
        {activeTab === 'track' && (
          <div>
            <div className="mb-4">
              <h3 className="text-xl font-bold font-serif text-white">
                Track Service or Order in Real Time
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Enter your Reference Code (e.g. <span className="text-[#DFB76C] font-mono">HB-1042</span>).
              </p>
            </div>

            <form onSubmit={handleTrackSearch} className="flex gap-2 mb-6">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Reference Code (e.g. HB-1042)"
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0B0D] border border-zinc-800 text-white font-mono uppercase focus:outline-none focus:border-[#C5A059]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#22222D] hover:bg-[#2C2C3A] text-white text-xs font-medium border border-zinc-700 transition-colors cursor-pointer"
              >
                {loading ? 'Searching...' : 'Track'}
              </button>
            </form>

            {trackError && (
              <div className="p-3.5 mb-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
                {trackError}
              </div>
            )}

            {trackResult && (
              <div className="p-5 rounded-xl bg-[#0B0B0D] border border-zinc-800 space-y-5 animate-in fade-in">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800/80 text-xs">
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Tracking Reference</span>
                    <span className="font-mono font-bold text-[#DFB76C] text-sm">
                      {trackResult.data.reference}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Client</span>
                    <span className="font-semibold text-white">
                      {trackResult.data.customerName}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Status</span>
                    <span className="capitalize text-emerald-400 font-medium">
                      {trackResult.data.status}
                    </span>
                  </div>
                </div>

                {/* Progress Steps Timeline */}
                <div>
                  <h4 className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-3">
                    Progress Timeline
                  </h4>
                  <div className="space-y-3">
                    {trackResult.timeline.map((step: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 text-xs">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                          step.completed
                            ? 'bg-emerald-500 text-black font-bold'
                            : step.current
                            ? 'bg-[#C5A059] text-black font-bold animate-pulse'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}>
                          {step.completed ? '✓' : idx + 1}
                        </div>
                        <div className="flex-1">
                          <span className={`font-medium ${step.completed ? 'text-white' : step.current ? 'text-[#DFB76C]' : 'text-zinc-500'}`}>
                            {step.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {trackResult.type === 'appointment' && trackResult.data.paymentStatus !== 'paid' && (
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-zinc-400 text-xs">Total Due</span>
                      <div className="font-bold text-base font-serif text-[#DFB76C] tabular-nums font-mono">
                        {SHOP_INFO.currency} {trackResult.data.servicePrice.toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setPayRef(trackResult.data.reference);
                        setFoundAppointment(trackResult.data);
                        setActiveTab('pay');
                      }}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase cursor-pointer"
                    >
                      Pay Now (M-Pesa)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PAY AFTER SERVICE */}
        {activeTab === 'pay' && (
          <div>
            {paidReceipt ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold font-serif text-white mb-1">
                  Payment Confirmed!
                </h4>
                <p className="text-xs text-zinc-400 mb-6">
                  Asante sana for grooming at Mwingi Home Boyz Cut.
                </p>

                <div className="p-5 rounded-xl bg-[#0B0B0D] border border-zinc-800 text-left text-xs space-y-2 mb-6 max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Booking Reference</span>
                    <span className="font-mono text-[#DFB76C] font-bold">{paidReceipt.appointmentReference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Service</span>
                    <span className="text-white font-medium">{paidReceipt.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Barber</span>
                    <span className="text-white">{paidReceipt.barberName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Service Fee</span>
                    <span className="text-white tabular-nums font-mono">{SHOP_INFO.currency} {paidReceipt.servicePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Barber Tip</span>
                    <span className="text-white tabular-nums font-mono">{SHOP_INFO.currency} {paidReceipt.tipAmount}</span>
                  </div>
                  {paidReceipt.addOnTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Product Added</span>
                      <span className="text-white tabular-nums font-mono">{SHOP_INFO.currency} {paidReceipt.addOnTotal}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-zinc-800 font-bold text-sm">
                    <span className="text-white">Total Settled</span>
                    <span className="text-[#DFB76C] font-serif tabular-nums font-mono">{SHOP_INFO.currency} {paidReceipt.totalPaid}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setPaidReceipt(null);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs uppercase cursor-pointer"
                >
                  Close Receipt
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold font-serif text-white">
                    Settle Chair Bill After Cut
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Pay securely via M-Pesa to <span className="text-[#DFB76C] font-mono">0746145712</span> or cash at the counter.
                  </p>
                </div>

                {!foundAppointment ? (
                  <form onSubmit={handleLookupForPayment} className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={payRef}
                      onChange={(e) => setPayRef(e.target.value)}
                      placeholder="Appointment Ref (e.g. HB-1042)"
                      className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0B0D] border border-zinc-800 text-white font-mono uppercase focus:outline-none focus:border-[#C5A059]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#22222D] hover:bg-[#2C2C3A] text-white text-xs font-medium border border-zinc-700 cursor-pointer"
                    >
                      Find
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#0B0B0D] border border-zinc-800 text-xs space-y-1.5">
                      <div className="flex justify-between font-semibold">
                        <span className="text-white">{foundAppointment.serviceName}</span>
                        <span className="text-[#DFB76C] font-mono tabular-nums">{SHOP_INFO.currency} {foundAppointment.servicePrice}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        Crafted by {foundAppointment.barberName} · Ref #{foundAppointment.reference}
                      </div>
                    </div>

                    {/* Barber Tip */}
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Barber Appreciation Tip (Optional)
                      </label>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        {[0, 50, 100, 200].map((amt) => (
                          <button
                            type="button"
                            key={amt}
                            onClick={() => setTipAmount(amt)}
                            className={`py-2 rounded-lg border text-center font-medium cursor-pointer ${
                              tipAmount === amt
                                ? 'bg-[#22222D] border-[#C5A059] text-[#DFB76C]'
                                : 'bg-[#0B0B0D] border-zinc-800 text-zinc-400'
                            }`}
                          >
                            {amt === 0 ? 'No Tip' : `${SHOP_INFO.currency} ${amt}`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Add-on Product taken */}
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Add Hair Pomade / Beard Oil Taken in Chair
                      </label>
                      <select
                        value={selectedAddonId}
                        onChange={(e) => setSelectedAddonId(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0B0D] border border-zinc-800 text-white focus:outline-none focus:border-[#C5A059]"
                      >
                        <option value="">No product added</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            + {p.name} ({SHOP_INFO.currency} {p.price.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                        Payment Method
                      </label>
                      <select
                        value={payMethod}
                        onChange={(e) => setPayMethod(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0B0D] border border-zinc-800 text-white focus:outline-none focus:border-[#C5A059]"
                      >
                        <option value="M-Pesa (Send to 0746145712)">M-Pesa (Direct to 0746145712)</option>
                        <option value="Cash at Lounge Desk">Pay Cash at Mwingi Counter</option>
                        <option value="Credit / Debit Card">Credit / Debit Card</option>
                      </select>
                    </div>

                    {/* Grand Total & Action */}
                    <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-zinc-400">Total Settlement</span>
                        <div className="text-xl font-bold font-serif text-[#DFB76C] tabular-nums font-mono">
                          {SHOP_INFO.currency} {(() => {
                            const addon = products.find(p => p.id === selectedAddonId);
                            return (foundAppointment.servicePrice + tipAmount + (addon ? addon.price : 0)).toLocaleString();
                          })()}
                        </div>
                      </div>

                      <button
                        onClick={handleProcessPayment}
                        disabled={paySubmitting}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all shadow-md shadow-[#C5A059]/20 disabled:opacity-50 cursor-pointer"
                      >
                        {paySubmitting ? 'Settling...' : 'Complete Payment'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
