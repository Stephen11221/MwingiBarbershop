import React, { useState } from 'react';
import { Product } from '../types.ts';
import { Star, Check, Plus, Sparkles, Cog, Award } from 'lucide-react';
import { SHOP_INFO, GOLD_PRODUCTS_3D_IMAGE } from '../data/mockData.ts';

interface ShopSectionProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ShopSection: React.FC<ShopSectionProps> = ({
  products,
  onAddToCart
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'hair', label: 'Hair & Wave Styling' },
    { id: 'beard', label: 'Organic Beard Oils' },
    { id: 'skincare', label: 'Facial Scrubs & Masks' },
    { id: 'hardware', label: 'Pro Barber Razors' }
  ];

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  const handleAdd = (product: Product) => {
    onAddToCart(product);
    setAddedAnimationId(product.id);
    setTimeout(() => setAddedAnimationId(null), 1200);
  };

  return (
    <section id="shop" className="py-20 bg-[#0E0E12] border-t border-[#1E1E24] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3D Gold Mechanic Product Series Banner */}
        <div className="mb-14 rounded-2xl bg-gradient-to-r from-[#14141A] via-[#1F1C14] to-[#14141A] border border-[#DFB76C]/30 overflow-hidden shadow-2xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 p-6 sm:p-10 z-10">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DFB76C] uppercase tracking-[0.2em] mb-2.5">
                <Cog className="w-3.5 h-3.5 text-[#DFB76C] animate-spin" style={{ animationDuration: '10s' }} />
                <span>3D Mechanical Gold Edition</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white tracking-tight mb-3">
                Precision Gold Formulations & Tools
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6 font-light max-w-lg">
                Crafted for lasting hold and effortless wash-out. Formulated with organic Kenyan shea butter, argan extract, and sandalwood essential oils in signature gold-finish canisters.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#DFB76C]">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 border border-[#DFB76C]/30">
                  <Award className="w-3.5 h-3.5" />
                  <span>Certified Home Boyz Formula</span>
                </div>
                <div className="text-zinc-400 text-[11px]">
                  Pick up at salon counter or ship anywhere in Kenya
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative h-64 sm:h-72 lg:h-80 overflow-hidden">
              <img
                src={GOLD_PRODUCTS_3D_IMAGE}
                alt="3D Gold Mechanic Barber Grooming Products"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center filter brightness-95 contrast-105 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#14141A] via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-semibold text-[#DFB76C] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#DFB76C]" />
              <span>Mwingi Home Boyz Store</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-tight">
              Premium Hair & Beard Formulations
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-zinc-400 max-w-xl">
              Authentic pomades, organic growth oils, and grooming hardware available in Mwingi Town.
            </p>
          </div>

          {/* Categories */}
          <div className="mt-6 md:mt-0 flex flex-wrap items-center gap-1.5 p-1 bg-[#141419] border border-[#22222A] rounded-xl overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#252530] text-white shadow-sm border border-zinc-700 font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="group flex flex-col justify-between rounded-2xl bg-[#131317] border border-[#22222A] overflow-hidden hover:border-[#DFB76C]/50 transition-all hover:-translate-y-1 shadow-xl"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/3] w-full bg-[#18181F] overflow-hidden flex items-center justify-center p-3">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-lg filter brightness-95"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-zinc-800 text-[11px] font-mono text-zinc-300">
                  {product.size}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                    <span className="text-[#DFB76C] uppercase tracking-wider font-semibold text-[11px]">
                      {product.categoryLabel}
                    </span>
                    <div className="flex items-center gap-1 text-zinc-300">
                      <Star className="w-3.5 h-3.5 fill-[#DFB76C] text-[#DFB76C]" />
                      <span className="font-semibold text-xs">{product.rating}</span>
                      <span className="text-zinc-500 font-normal">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold font-serif text-white group-hover:text-[#DFB76C] transition-colors mb-2">
                    {product.name}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                    {product.description}
                  </p>

                  {product.ingredients && (
                    <div className="text-[11px] text-zinc-400 mb-4">
                      <span className="text-zinc-400">Extracts:</span> {product.ingredients}
                    </div>
                  )}
                </div>

                {/* Price in KSh & Add to Bag */}
                <div className="pt-4 border-t border-[#1C1C24] flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold font-serif text-[#DFB76C] tabular-nums font-mono">
                      {SHOP_INFO.currency} {product.price.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-emerald-400">
                      In Stock · Collect or Delivery
                    </span>
                  </div>

                  <button
                    onClick={() => handleAdd(product)}
                    className={`px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                      addedAnimationId === product.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black hover:opacity-95 shadow-md shadow-[#C5A059]/20'
                    }`}
                  >
                    {addedAnimationId === product.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
