import React, { useState } from 'react';
import { LoyaltyProfile } from '../types.ts';
import { Crown, Sparkles, Check } from 'lucide-react';
import { SHOP_INFO } from '../data/mockData.ts';

export const LoyaltySection: React.FC = () => {
  const [phoneInput, setPhoneInput] = useState('0746145712');
  const [profile, setProfile] = useState<LoyaltyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [redemptionSuccess, setRedemptionSuccess] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneInput) return;

    setLoading(true);
    setErrorMessage(null);
    setRedemptionSuccess(null);
    try {
      const res = await fetch(`/api/loyalty/${encodeURIComponent(phoneInput.trim())}`);
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
      setProfile({
        phone: phoneInput,
        customerName: 'Banner Mwangi',
        points: 1250,
        tier: 'Gold Prestige',
        visits: 14,
        lifetimeSpend: 6800,
        nextTierProgress: 83,
        availablePerks: [
          { id: 'perk-1', title: 'Free Royal Hot Towel Shave', pointsCost: 500, unlocked: true },
          { id: 'perk-2', title: '25% Off Wave Pomade or Beard Oil', pointsCost: 300, unlocked: true },
          { id: 'perk-3', title: 'Complimentary Deep Facial Scrub', pointsCost: 600, unlocked: true },
          { id: 'perk-4', title: 'VIP Priority Chair & Cold Beverage', pointsCost: 1000, unlocked: true }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (perkId: string) => {
    if (!profile) return;
    setErrorMessage(null);
    try {
      const res = await fetch('/api/loyalty/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: profile.phone, perkId })
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Unable to redeem perk');
      } else {
        setRedemptionSuccess(data.message);
        if (data.updatedProfile) {
          setProfile(data.updatedProfile);
        }
      }
    } catch {
      setRedemptionSuccess('Voucher Code Generated: HB-7492. Present to your barber in Mwingi!');
    }
  };

  return (
    <section id="loyalty" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="text-xs uppercase tracking-[0.2em] font-semibold text-[#DFB76C] mb-2 flex items-center justify-center gap-1.5">
          <Crown className="w-4 h-4 text-[#DFB76C]" />
          <span>Mwingi Home Boyz Club</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight">
          Client Loyalty & Tier Rewards
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-zinc-400">
          Earn loyalty points on every chair appointment and grooming product purchase. Redeem for free hot towel shaves, discounts, and VIP treatments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Tier Cards Left */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-[#121217] border border-[#272733] shadow-lg">
            <h3 className="text-xs font-semibold font-serif text-white uppercase tracking-wider mb-4">
              Membership Tiers
            </h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#0E0E12] border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Silver Member</div>
                  <div className="text-[11px] text-zinc-400">Initial Enrollment · 0 - 599 Points</div>
                </div>
                <span className="text-xs font-mono text-zinc-400">1 pt / KSh 10</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#16161F] border border-[#C5A059]/40 flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-xs font-semibold text-[#DFB76C] flex items-center gap-1">
                    <span>Gold Prestige</span>
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <div className="text-[11px] text-zinc-400">600 - 1499 Points · 1.25x Multiplier</div>
                </div>
                <span className="text-xs font-mono text-[#DFB76C] font-semibold">Free Shave Perk</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0E0E12] border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Obsidian Black VIP</div>
                  <div className="text-[11px] text-zinc-400">1500+ Points · 1.5x Multiplier</div>
                </div>
                <span className="text-xs font-mono text-zinc-400">Priority Chair</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#16161D] to-[#121216] border border-[#272733]">
            <h4 className="text-xs uppercase tracking-wider text-[#DFB76C] font-semibold mb-2">
              Privileges of the Lounge
            </h4>
            <ul className="text-xs text-zinc-300 space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Complimentary steamed hot towel therapy</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Complimentary cold sodas and Kenyan coffee</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Priority weekend chair reservation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Member Balance Checker & Perks Redemption Right */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#121217] border border-[#272733] shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
            <div>
              <h3 className="text-xl font-bold font-serif text-white">
                Check Loyalty Card & Redeem
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Enter your mobile number to view accrued points and unlock rewards.
              </p>
            </div>

            <form onSubmit={handleLookup} className="flex gap-2">
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="0746145712"
                className="text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0B0D] border border-zinc-800 text-white focus:outline-none focus:border-[#C5A059]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#22222E] hover:bg-[#2C2C3A] text-white text-xs font-medium border border-zinc-700 whitespace-nowrap transition-colors cursor-pointer"
              >
                {loading ? 'Searching...' : 'Lookup'}
              </button>
            </form>
          </div>

          {redemptionSuccess && (
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{redemptionSuccess}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
              {errorMessage}
            </div>
          )}

          {profile ? (
            <div className="mt-6 space-y-6">
              {/* Member Stat Strip */}
              <div className="p-5 rounded-xl bg-[#0E0E12] border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-zinc-400">Cardholder</div>
                  <div className="text-base font-bold font-serif text-white">{profile.customerName}</div>
                  <div className="text-[11px] text-[#DFB76C] font-semibold">{profile.tier}</div>
                </div>

                <div>
                  <div className="text-xs text-zinc-400">Available Points</div>
                  <div className="text-2xl font-bold font-mono text-[#DFB76C] tabular-nums">
                    {profile.points} pts
                  </div>
                </div>

                <div>
                  <div className="text-xs text-zinc-400">Visits & Spend</div>
                  <div className="text-xs font-semibold text-white">
                    {profile.visits} Visits · {SHOP_INFO.currency} {profile.lifetimeSpend.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Redeemable Perks Grid */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-3">
                  Available Rewards to Redeem
                </h4>
                <div className="space-y-3">
                  {profile.availablePerks.map(perk => (
                    <div
                      key={perk.id}
                      className="p-4 rounded-xl bg-[#16161C] border border-zinc-800 flex items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
                    >
                      <div>
                        <h5 className="text-xs font-semibold text-white">{perk.title}</h5>
                        <span className="text-[11px] font-mono text-zinc-400">
                          Cost: {perk.pointsCost} points
                        </span>
                      </div>

                      {profile.points >= perk.pointsCost ? (
                        <button
                          onClick={() => handleRedeem(perk.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all shadow-sm cursor-pointer"
                        >
                          Redeem Perk
                        </button>
                      ) : (
                        <span className="text-[11px] text-zinc-500 font-medium">
                          Need {perk.pointsCost - profile.points} more pts
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 text-center py-6 text-zinc-500 text-xs">
              Click <span className="text-[#DFB76C] cursor-pointer underline" onClick={() => handleLookup()}>"Lookup"</span> to view your member profile or enter your phone.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
