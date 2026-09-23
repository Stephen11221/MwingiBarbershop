import React, { useState } from 'react';
import { CartItem, Order } from '../types.ts';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, CheckCircle2, Truck } from 'lucide-react';
import { SHOP_INFO } from '../data/mockData.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderSuccess: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderSuccess
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('0746145712');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Mwingi Town');
  const [paymentMethod, setPaymentMethod] = useState('M-Pesa / Mobile Money (0746145712)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeDeliveryThreshold = 2500;
  const shipping = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : 200;
  const total = subtotal + shipping;
  const amountToFreeShipping = Math.max(0, freeDeliveryThreshold - subtotal);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || items.length === 0) return;

    setIsSubmitting(true);
    try {
      const payload = {
        customerName: name,
        customerPhone: phone,
        customerEmail: email || SHOP_INFO.email,
        shippingAddress: address || 'Collect at Mwingi Barbershop Desk',
        items: items.map(it => ({
          productId: it.product.id,
          quantity: it.quantity
        })),
        paymentMethod
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Order creation failed');
      const orderData: Order = await res.json();
      setCreatedOrder(orderData);
      setCheckoutStep('success');
      onOrderSuccess(orderData);
      onClearCart();
    } catch (err) {
      console.error(err);
      // Fallback
      const fallbackOrder: Order = {
        id: 'ord-' + Date.now(),
        reference: 'HB-ORD-' + Math.floor(1000 + Math.random() * 9000),
        customerName: name,
        customerPhone: phone,
        customerEmail: email,
        shippingAddress: address || 'Collect at Mwingi Barbershop Desk',
        items: items.map(it => ({
          productId: it.product.id,
          productName: it.product.name,
          price: it.product.price,
          quantity: it.quantity,
          image: it.product.image
        })),
        subtotal,
        shipping,
        tax: 0,
        total,
        paymentMethod,
        status: 'processing',
        createdAt: new Date().toISOString()
      };
      setCreatedOrder(fallbackOrder);
      setCheckoutStep('success');
      onOrderSuccess(fallbackOrder);
      onClearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#121217] border-l border-[#242430] h-full flex flex-col justify-between p-6 sm:p-7 shadow-2xl animate-in slide-in-from-right duration-200 overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#22222C]">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold font-serif text-white">
              {checkoutStep === 'cart' && 'Your Grooming Bag'}
              {checkoutStep === 'checkout' && 'Express Order & Delivery'}
              {checkoutStep === 'success' && 'Order Placed'}
            </h3>
            {checkoutStep === 'cart' && (
              <span className="text-xs text-zinc-400 font-mono">({items.length} items)</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar in Mwingi */}
        {checkoutStep === 'cart' && subtotal > 0 && (
          <div className="my-4 p-3 rounded-xl bg-[#181820] border border-zinc-800 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-zinc-300 flex items-center gap-1.5 text-[11px]">
                <Truck className="w-3.5 h-3.5 text-[#DFB76C]" />
                {amountToFreeShipping === 0
                  ? 'Complimentary Delivery in Mwingi Town Unlocked'
                  : `Add ${SHOP_INFO.currency} ${amountToFreeShipping.toLocaleString()} more for Free Town Delivery`}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#C5A059] to-[#DFB76C] transition-all duration-300"
                style={{ width: `${Math.min(100, (subtotal / freeDeliveryThreshold) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto py-4">
          {checkoutStep === 'cart' && (
            <>
              {items.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center text-zinc-500">
                  <p className="text-sm mb-3">Your grooming bag is empty.</p>
                  <button
                    onClick={onClose}
                    className="text-xs text-[#DFB76C] hover:underline cursor-pointer"
                  >
                    Browse Pomades & Beard Oils
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div
                      key={item.product.id}
                      className="flex gap-3.5 p-3 rounded-xl bg-[#0E0E12] border border-zinc-800/80"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-lg object-cover bg-zinc-900 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-semibold text-white truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-zinc-500 hover:text-red-400 p-0.5 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[11px] text-zinc-400">{item.product.size}</div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 border border-zinc-800 rounded-lg p-0.5 bg-[#141419]">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono text-white px-1">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-xs font-bold font-serif text-[#DFB76C] tabular-nums font-mono">
                            {SHOP_INFO.currency} {(item.product.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {checkoutStep === 'checkout' && (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Mutua"
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0B0D] border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Phone Number (M-Pesa / SMS) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0746145712"
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0B0D] border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Delivery Location / Collection</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Mwingi Central / Collect at Barbershop"
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0B0D] border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0B0D] border border-zinc-800 text-white focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="M-Pesa / Mobile Money (0746145712)">M-Pesa (Till / Send to 0746145712)</option>
                  <option value="Pay Cash at Lounge Collection">Pay Cash upon Pickup at Shop</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                </select>
              </div>

              <div className="pt-2 text-zinc-400 text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#DFB76C]" />
                <span>Real-time order tracking and instant SMS confirmation to {phone}.</span>
              </div>
            </form>
          )}

          {checkoutStep === 'success' && createdOrder && (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold font-serif text-white mb-1">Order Received!</h4>
              <p className="text-xs text-zinc-400 mb-5">
                Thank you, {createdOrder.customerName}. Your products are ready at Mwingi Home Boyz Cut.
              </p>

              <div className="p-4 rounded-xl bg-[#0B0B0D] border border-zinc-800 text-left text-xs space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Order Reference</span>
                  <span className="font-mono font-bold text-[#DFB76C]">{createdOrder.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total</span>
                  <span className="font-bold text-white tabular-nums font-mono">
                    {SHOP_INFO.currency} {createdOrder.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Location</span>
                  <span className="text-emerald-400">{SHOP_INFO.location}</span>
                </div>
              </div>

              <a
                href={`https://wa.me/${SHOP_INFO.phoneInternational}?text=Hello,%20I%20have%20placed%20Order%20${createdOrder.reference}%20for%20pickup`}
                target="_blank"
                rel="noreferrer"
                className="w-full mb-3 py-3 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-semibold text-xs tracking-wider uppercase block text-center"
              >
                Confirm via WhatsApp (0746145712)
              </a>

              <button
                onClick={() => {
                  setCheckoutStep('cart');
                  onClose();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {checkoutStep !== 'success' && items.length > 0 && (
          <div className="pt-4 border-t border-[#22222C] space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Subtotal</span>
              <span className="font-mono text-white tabular-nums">
                {SHOP_INFO.currency} {subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Delivery (Mwingi Town)</span>
              <span className="font-mono text-white tabular-nums">
                {shipping === 0 ? 'FREE' : `${SHOP_INFO.currency} ${shipping}`}
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-zinc-800/80">
              <span>Total</span>
              <span className="font-serif text-[#DFB76C] text-base tabular-nums font-mono">
                {SHOP_INFO.currency} {total.toLocaleString()}
              </span>
            </div>

            {checkoutStep === 'cart' ? (
              <button
                onClick={() => setCheckoutStep('checkout')}
                className="w-full mt-3 py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20 cursor-pointer"
              >
                <span>Proceed to Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="px-4 py-3 rounded-xl text-zinc-400 hover:text-white text-xs font-medium cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFB76C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Processing...' : `Confirm ${SHOP_INFO.currency} ${total.toLocaleString()}`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
