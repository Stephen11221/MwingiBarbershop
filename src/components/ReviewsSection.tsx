import React, { useState } from 'react';
import { Review, Service, Barber } from '../types.ts';
import { Star, CheckCircle, MessageSquarePlus, X } from 'lucide-react';

interface ReviewsSectionProps {
  reviews: Review[];
  services: Service[];
  barbers: Barber[];
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'verified'>) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  services,
  barbers,
  onAddReview
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [serviceName, setServiceName] = useState(services[0]?.name || 'Executive Precision Cut');
  const [barberName, setBarberName] = useState(barbers[0]?.name || 'Banner Mwangi');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment) return;

    onAddReview({
      author,
      rating,
      serviceName,
      barberName,
      comment
    });

    setModalOpen(false);
    setAuthor('');
    setComment('');
  };

  return (
    <section id="reviews" className="py-24 bg-[#0E0E12] border-t border-[#1E1E24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-semibold text-[#DFB76C] mb-2">
              Client Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight">
              Verified Lounge Experience Reviews
            </h2>
            <div className="flex items-center gap-2 mt-3 text-xs text-zinc-400">
              <div className="flex items-center text-[#DFB76C]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-semibold text-white">4.98 out of 5</span>
              <span>·</span>
              <span>Based on 1,240+ verified client visits</span>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="mt-6 md:mt-0 px-4 py-2.5 rounded-xl bg-[#1B1B22] hover:bg-[#252530] text-zinc-200 hover:text-white border border-zinc-700 text-xs font-semibold tracking-wider uppercase flex items-center gap-2 transition-colors self-start md:self-auto"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#DFB76C]" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map(review => (
            <div
              key={review.id}
              className="p-6 rounded-2xl bg-[#131317] border border-[#22222A] flex flex-col justify-between hover:border-zinc-700 transition-colors shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-serif font-bold text-white">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <span>{review.author}</span>
                        {review.verified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 font-medium">
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                            Verified Visit
                          </span>
                        )}
                      </h4>
                      <div className="text-[11px] text-zinc-400">
                        {review.serviceName} · Crafted by {review.barberName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-[#DFB76C]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1C1C24] text-[11px] text-zinc-400">
                Visited {review.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#121217] border border-[#272733] rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-serif text-white mb-1">
              Share Your Lounge Experience
            </h3>
            <p className="text-xs text-zinc-400 mb-5">
              Your feedback maintains our standard of bespoke craftsmanship and service excellence.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Lord Charles"
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0B0D] border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-[#DFB76C] hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${star <= rating ? 'fill-current' : 'text-zinc-600'}`} />
                    </button>
                  ))}
                  <span className="text-zinc-400 text-xs ml-2">{rating} of 5 Stars</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 mb-1">Service Received</label>
                  <select
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0B0D] border border-zinc-800 text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1">Master Barber</label>
                  <select
                    value={barberName}
                    onChange={(e) => setBarberName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0B0D] border border-zinc-800 text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    {barbers.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Your Review *</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe your haircut, straight razor shave, or facial treatment..."
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0B0D] border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
