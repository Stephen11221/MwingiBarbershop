import React, { useState, useEffect } from 'react';
import {
  Service,
  Barber,
  GalleryItem,
  Product,
  Review,
  Appointment,
  CartItem,
  Order
} from './types.ts';
import {
  INITIAL_SERVICES,
  INITIAL_BARBERS,
  INITIAL_GALLERY,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS
} from './data/mockData.ts';

import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { ThreeDScrollCanvas } from './components/ThreeDScrollCanvas.tsx';
import { SectionGrouper, GroupSectionId } from './components/SectionGrouper.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { BarbersSection } from './components/BarbersSection.tsx';
import { GallerySection } from './components/GallerySection.tsx';
import { ShopSection } from './components/ShopSection.tsx';
import { LoyaltySection } from './components/LoyaltySection.tsx';
import { ReviewsSection } from './components/ReviewsSection.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { TrackingAndPaymentModal } from './components/TrackingAndPaymentModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton.tsx';
import { Footer } from './components/Footer.tsx';

export default function App() {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [barbers, setBarbers] = useState<Barber[]>(INITIAL_BARBERS);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Section Grouping & Filtering state
  const [activeGroupSection, setActiveGroupSection] = useState<GroupSectionId>('all');

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mwingi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal controls
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preSelectedService, setPreSelectedService] = useState<Service | null>(null);
  const [preSelectedBarber, setPreSelectedBarber] = useState<Barber | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mwingi_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Initial API Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resServices, resBarbers, resProducts, resReviews, resAppointments] = await Promise.all([
          fetch('/api/services').catch(() => null),
          fetch('/api/barbers').catch(() => null),
          fetch('/api/products').catch(() => null),
          fetch('/api/reviews').catch(() => null),
          fetch('/api/appointments').catch(() => null)
        ]);

        if (resServices?.ok) setServices(await resServices.json());
        if (resBarbers?.ok) setBarbers(await resBarbers.json());
        if (resProducts?.ok) setProducts(await resProducts.json());
        if (resReviews?.ok) setReviews(await resReviews.json());
        if (resAppointments?.ok) setAppointments(await resAppointments.json());
      } catch (err) {
        console.warn('Backend API loaded with initial state', err);
      }
    };
    fetchData();
  }, []);

  // Cart actions
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Booking handlers
  const handleSelectService = (service: Service) => {
    setPreSelectedService(service);
    setPreSelectedBarber(null);
    setIsBookingOpen(true);
  };

  const handleSelectBarber = (barber: Barber) => {
    setPreSelectedBarber(barber);
    setIsBookingOpen(true);
  };

  const handleBookStyle = (_styleName: string) => {
    const matchedService = services.find(s => s.name.toLowerCase().includes('fade')) || services[0];
    setPreSelectedService(matchedService);
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = (newApt: Appointment) => {
    setAppointments(prev => [newApt, ...prev]);
  };

  // Review handler
  const handleAddReview = async (newRev: Omit<Review, 'id' | 'date' | 'verified'>) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRev)
      });
      if (res.ok) {
        const saved = await res.json();
        setReviews(prev => [saved, ...prev]);
      }
    } catch {
      const localRev: Review = {
        ...newRev,
        id: 'rev-' + Date.now(),
        date: 'Just now',
        verified: true
      };
      setReviews(prev => [localRev, ...prev]);
    }
  };

  // Appointment status update
  const handleUpdateAppointmentStatus = (id: string, status: Appointment['status'], paymentStatus?: Appointment['paymentStatus']) => {
    setAppointments(prev =>
      prev.map(a =>
        a.id === id || a.reference === id
          ? { ...a, status, ...(paymentStatus ? { paymentStatus } : {}) }
          : a
      )
    );
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative min-h-screen bg-[#0B0B0D] text-[#E4E4E7] flex flex-col font-sans selection:bg-[#C5A059]/30 selection:text-[#F4E8C1] overflow-x-hidden">
      {/* 3D WebGL Scroll Animation in Background */}
      <ThreeDScrollCanvas />

      {/* 3-Zone Top Bar Navigation */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBooking={() => {
          setPreSelectedService(null);
          setPreSelectedBarber(null);
          setIsBookingOpen(true);
        }}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeGroupTab={activeGroupSection}
        onSelectGroupTab={(tab) => setActiveGroupSection(tab as GroupSectionId)}
      />

      {/* Main Barbershop Experience */}
      <main className="flex-1 relative z-10">
        <HeroSection
          onBookNow={() => {
            setPreSelectedService(null);
            setIsBookingOpen(true);
          }}
          onExploreServices={() => {
            setActiveGroupSection('services');
            const el = document.getElementById('services');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onTrackOrPay={() => setIsTrackingOpen(true)}
        />

        {/* Interactive Section Grouper / Filter to declutter home page */}
        <SectionGrouper
          activeSection={activeGroupSection}
          onSelectSection={(sec) => {
            setActiveGroupSection(sec);
            if (sec !== 'all') {
              const el = document.getElementById(sec);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        />

        {/* CONDITIONAL VIEW RENDERING BASED ON USER'S GROUP SELECTION */}
        {/* 1. The Master Crew - Minimalist: Only Barber Photo, Name, Specialty & Book Button */}
        {(activeGroupSection === 'all' || activeGroupSection === 'crew') && (
          <BarbersSection
            barbers={barbers}
            onBookBarber={handleSelectBarber}
          />
        )}

        {/* 2. Categorized Grooming Services & Rates */}
        {(activeGroupSection === 'all' || activeGroupSection === 'services') && (
          <ServicesSection
            services={services}
            onSelectService={handleSelectService}
          />
        )}

        {/* 3. Recent Styles Gallery */}
        {(activeGroupSection === 'all' || activeGroupSection === 'gallery') && (
          <GallerySection
            galleryItems={galleryItems}
            onBookStyle={handleBookStyle}
          />
        )}

        {/* 4. Products Apothecary */}
        {(activeGroupSection === 'all' || activeGroupSection === 'shop') && (
          <ShopSection
            products={products}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* 5. Loyalty Program & Perks */}
        {(activeGroupSection === 'all' || activeGroupSection === 'loyalty') && (
          <LoyaltySection />
        )}

        {/* 6. Customer Reviews (Curated on 'all' overview) */}
        {activeGroupSection === 'all' && (
          <ReviewsSection
            reviews={reviews}
            services={services}
            barbers={barbers}
            onAddReview={handleAddReview}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* Modals & Drawers */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        services={services}
        barbers={barbers}
        preSelectedService={preSelectedService}
        preSelectedBarber={preSelectedBarber}
        onBookingSuccess={handleBookingSuccess}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderSuccess={(order: Order) => {
          console.log('Order created:', order.reference);
        }}
      />

      <TrackingAndPaymentModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        products={products}
        onPaymentSuccess={() => {
          fetch('/api/appointments')
            .then(res => res.json())
            .then(data => setAppointments(data))
            .catch(() => {});
        }}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        appointments={appointments}
        onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
      />

      {/* Persistent WhatsApp Concierge DM Button */}
      <WhatsAppFloatingButton />
    </div>
  );
}
