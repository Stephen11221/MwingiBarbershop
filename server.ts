import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import {
  INITIAL_SERVICES,
  INITIAL_BARBERS,
  INITIAL_GALLERY,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  SAMPLE_LOYALTY_PROFILES
} from './src/data/mockData.ts';
import {
  Appointment,
  Order,
  ReminderLog,
  Review,
  Product,
  LoyaltyProfile
} from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Secure backend admin credentials - NEVER exposed on public client code
const ADMIN_CREDENTIALS = {
  email: 'bannermwangi0@gmail.com',
  pin: '7799',
  role: 'Founder & Lead Master Barber'
};

// In-memory data store with persistent live session lifecycle
let appointments: Appointment[] = [
  {
    id: 'apt-101',
    reference: 'HB-1042',
    customerName: 'Samson Kilonzo',
    customerPhone: '0746145712',
    customerEmail: 'bannermwangi0@gmail.com',
    barberId: 'barber-1',
    barberName: 'Banner Mwangi',
    serviceId: 'srv-11',
    serviceName: 'The Full Home Boyz VIP Package (All-Inclusive)',
    servicePrice: 1500,
    date: '2026-09-24',
    time: '11:00 AM',
    durationMinutes: 90,
    status: 'confirmed',
    reminderPreference: 'both',
    paymentStatus: 'unpaid',
    notes: 'Prefers low taper fade, clean line-up, and facial steam.',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'apt-102',
    reference: 'HB-1043',
    customerName: 'Erick Mwende',
    customerPhone: '0712345678',
    customerEmail: 'erick.m@mwingi.co.ke',
    barberId: 'barber-2',
    barberName: 'Kelvin Mutua',
    serviceId: 'srv-2',
    serviceName: 'Home Boyz Low/Mid/High Skin Fade & Waves',
    servicePrice: 450,
    date: '2026-09-24',
    time: '01:30 PM',
    durationMinutes: 45,
    status: 'in-progress',
    reminderPreference: 'sms',
    paymentStatus: 'unpaid',
    notes: 'Keep waves full on top, low skin fade around ears.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'apt-103',
    reference: 'HB-1039',
    customerName: 'Justus Mutemi',
    customerPhone: '0722998877',
    customerEmail: 'justus.mutemi@kitui.go.ke',
    barberId: 'barber-3',
    barberName: 'Brian Musyoka',
    serviceId: 'srv-5',
    serviceName: 'Beard Sculpting, Razor Edge & Nourishing Oil',
    servicePrice: 350,
    date: '2026-09-23',
    time: '10:00 AM',
    durationMinutes: 30,
    status: 'paid',
    reminderPreference: 'whatsapp',
    paymentStatus: 'paid',
    tipAmount: 100,
    totalPaid: 450,
    paymentMethod: 'M-Pesa (0746145712)',
    notes: 'Steamed hot towel and sharp razor cheek line.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'apt-104',
    reference: 'HB-1035',
    customerName: 'David Musyoki',
    customerPhone: '0733112233',
    customerEmail: 'd.musyoki@gmail.com',
    barberId: 'barber-1',
    barberName: 'Banner Mwangi',
    serviceId: 'srv-1',
    serviceName: 'Executive Precision Cut & Razor Finish',
    servicePrice: 500,
    date: '2026-09-22',
    time: '03:00 PM',
    durationMinutes: 40,
    status: 'paid',
    reminderPreference: 'both',
    paymentStatus: 'paid',
    tipAmount: 100,
    totalPaid: 600,
    paymentMethod: 'M-Pesa (0746145712)',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

let orders: Order[] = [
  {
    id: 'ord-501',
    reference: 'ORD-9104',
    customerName: 'Alexander Ross',
    customerPhone: '+15551234567',
    customerEmail: 'alex.ross@meridian.com',
    shippingAddress: '742 Evergreen Terrace, Suite 400',
    items: [
      {
        productId: 'prod-1',
        productName: 'Obsidian Matte Clay Pomade',
        price: 34,
        quantity: 2,
        image: '/src/assets/images/product_matte_pomade_1790174714855.jpg'
      },
      {
        productId: 'prod-2',
        productName: 'Sandalwood & Bourbon Beard Elixir',
        price: 38,
        quantity: 1,
        image: '/src/assets/images/barbershop_hot_towel_shave_1790174702380.jpg'
      }
    ],
    subtotal: 106,
    shipping: 0,
    tax: 8.48,
    total: 114.48,
    paymentMethod: 'Credit Card',
    status: 'shipped',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  }
];

let reminderLogs: ReminderLog[] = [
  {
    id: 'rem-1',
    appointmentRef: 'AB-8291',
    customerName: 'Marcus Sterling',
    recipient: '+1 (555) 234-8901',
    type: 'sms',
    scheduledTime: '2026-09-23 11:00 AM (24h before)',
    sentAt: '2026-09-23 11:01 AM',
    status: 'sent',
    message: 'Aurelius & Blade Reminder: Your Emperor’s Ritual appointment with Vance is tomorrow at 11:00 AM. Complimentary lounge valet & bar available. Reply CANCEL or CHANGE if needed.'
  },
  {
    id: 'rem-2',
    appointmentRef: 'AB-8291',
    customerName: 'Marcus Sterling',
    recipient: 'm.sterling@investments.com',
    type: 'email',
    scheduledTime: '2026-09-23 11:00 AM',
    sentAt: '2026-09-23 11:01 AM',
    status: 'sent',
    message: 'Official Lounge Reservation: Marcus Sterling, your appointment with Marcus "Vance" Thorne is confirmed for Sept 24 at 11:00 AM.'
  },
  {
    id: 'rem-3',
    appointmentRef: 'AB-8292',
    customerName: 'Liam O’Connor',
    recipient: '+1 (555) 876-1234',
    type: 'sms',
    scheduledTime: '2026-09-24 11:30 AM (2h before)',
    sentAt: '2026-09-24 11:30 AM',
    status: 'sent',
    message: 'Aurelius & Blade: Elena is preparing your station for 01:30 PM. See you shortly in the lounge!'
  }
];

let reviews: Review[] = [...INITIAL_REVIEWS];
let products: Product[] = [...INITIAL_PRODUCTS];
let loyaltyProfiles: Record<string, LoyaltyProfile> = { ...SAMPLE_LOYALTY_PROFILES };

// Active admin session tokens
const validSessionTokens = new Set<string>();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // --- Auth Middleware for Protected Admin Routes ---
  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
    }
    const token = authHeader.split(' ')[1];
    if (!validSessionTokens.has(token)) {
      return res.status(403).json({ error: 'Forbidden: Invalid or expired admin session token' });
    }
    next();
  };

  // --- 1. Admin Authentication ---
  app.post('/api/auth/admin-login', (req: Request, res: Response) => {
    const { email, pin } = req.body;
    if (
      email &&
      email.toLowerCase().trim() === ADMIN_CREDENTIALS.email.toLowerCase() &&
      pin === ADMIN_CREDENTIALS.pin
    ) {
      const sessionToken = 'adm_' + crypto.randomBytes(24).toString('hex');
      validSessionTokens.add(sessionToken);
      return res.json({
        success: true,
        token: sessionToken,
        user: {
          name: 'Managing Director',
          email: ADMIN_CREDENTIALS.email,
          role: ADMIN_CREDENTIALS.role
        }
      });
    }
    return res.status(401).json({ success: false, error: 'Invalid executive credentials or security PIN' });
  });

  app.post('/api/auth/verify', (req: Request, res: Response) => {
    const { token } = req.body;
    if (token && validSessionTokens.has(token)) {
      return res.json({ valid: true, user: { name: 'Managing Director', email: ADMIN_CREDENTIALS.email } });
    }
    return res.json({ valid: false });
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      validSessionTokens.delete(token);
    }
    return res.json({ success: true });
  });

  // --- 2. Public Catalog Endpoints ---
  app.get('/api/services', (_req: Request, res: Response) => {
    res.json(INITIAL_SERVICES);
  });

  app.get('/api/barbers', (_req: Request, res: Response) => {
    res.json(INITIAL_BARBERS);
  });

  app.get('/api/gallery', (_req: Request, res: Response) => {
    res.json(INITIAL_GALLERY);
  });

  app.get('/api/products', (_req: Request, res: Response) => {
    res.json(products);
  });

  app.get('/api/reviews', (_req: Request, res: Response) => {
    res.json(reviews);
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    const { author, rating, comment, serviceName, barberName } = req.body;
    if (!author || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required review fields' });
    }
    const newReview: Review = {
      id: 'rev-' + Date.now(),
      author: String(author).trim(),
      rating: Number(rating),
      date: 'Just now',
      serviceName: serviceName || 'Bespoke Grooming',
      barberName: barberName || 'Master Barber Team',
      comment: String(comment).trim(),
      verified: true
    };
    reviews.unshift(newReview);
    res.status(201).json(newReview);
  });

  // --- 3. Appointments & Booking Engine ---
  app.get('/api/appointments', (_req: Request, res: Response) => {
    res.json(appointments);
  });

  app.post('/api/appointments', (req: Request, res: Response) => {
    const {
      customerName,
      customerPhone,
      customerEmail,
      barberId,
      barberName,
      serviceId,
      serviceName,
      servicePrice,
      date,
      time,
      durationMinutes,
      reminderPreference,
      notes
    } = req.body;

    if (!customerName || !customerPhone || !serviceId || !date || !time) {
      return res.status(400).json({ error: 'Missing required booking information' });
    }

    const reference = 'AB-' + Math.floor(1000 + Math.random() * 9000);
    const newAppointment: Appointment = {
      id: 'apt-' + Date.now(),
      reference,
      customerName: String(customerName).trim(),
      customerPhone: String(customerPhone).trim(),
      customerEmail: String(customerEmail || '').trim(),
      barberId: barberId || 'barber-1',
      barberName: barberName || 'Marcus "Vance" Thorne',
      serviceId,
      serviceName,
      servicePrice: Number(servicePrice) || 65,
      date,
      time,
      durationMinutes: Number(durationMinutes) || 45,
      status: 'confirmed',
      reminderPreference: reminderPreference || 'both',
      paymentStatus: 'unpaid',
      notes: notes ? String(notes).trim() : undefined,
      createdAt: new Date().toISOString()
    };

    appointments.unshift(newAppointment);

    // Schedule automated SMS/Email/WhatsApp reminders in queue
    const pref = newAppointment.reminderPreference;
    if (pref === 'sms' || pref === 'both') {
      reminderLogs.unshift({
        id: 'rem-' + Date.now() + '-sms',
        appointmentRef: reference,
        customerName: newAppointment.customerName,
        recipient: newAppointment.customerPhone,
        type: 'sms',
        scheduledTime: `${date} ${time} (24h reminder scheduled)`,
        sentAt: 'Instant confirmation sent',
        status: 'sent',
        message: `Aurelius & Blade: Confirmed! ${newAppointment.serviceName} with ${newAppointment.barberName} on ${date} at ${time}. Ref #${reference}. See you at the lounge!`
      });
    }

    if ((pref === 'email' || pref === 'both') && newAppointment.customerEmail) {
      reminderLogs.unshift({
        id: 'rem-' + Date.now() + '-email',
        appointmentRef: reference,
        customerName: newAppointment.customerName,
        recipient: newAppointment.customerEmail,
        type: 'email',
        scheduledTime: `${date} ${time} (Confirmation & 2h reminder)`,
        sentAt: 'Instant email dispatched',
        status: 'sent',
        message: `Executive Reservation Confirmed: Ref ${reference} for ${newAppointment.customerName}. Service: ${newAppointment.serviceName}. Address: 420 Obsidian Boulevard, 2nd Floor Lounge.`
      });
    }

    if (pref === 'whatsapp') {
      reminderLogs.unshift({
        id: 'rem-' + Date.now() + '-wa',
        appointmentRef: reference,
        customerName: newAppointment.customerName,
        recipient: newAppointment.customerPhone,
        type: 'whatsapp',
        scheduledTime: `${date} ${time}`,
        sentAt: 'WhatsApp confirmation generated',
        status: 'sent',
        message: `Hello ${newAppointment.customerName}! Your luxury grooming appointment #${reference} is locked in for ${date} at ${time}.`
      });
    }

    // Award loyalty points for booking (10 pts per $1 service value)
    const normPhone = newAppointment.customerPhone.replace(/\D/g, '');
    const pointsEarned = Math.round(newAppointment.servicePrice * 10);
    if (!loyaltyProfiles[normPhone]) {
      loyaltyProfiles[normPhone] = {
        phone: newAppointment.customerPhone,
        customerName: newAppointment.customerName,
        points: pointsEarned,
        tier: 'Silver Member',
        visits: 1,
        lifetimeSpend: newAppointment.servicePrice,
        nextTierProgress: Math.min(100, Math.round((pointsEarned / 1000) * 100)),
        availablePerks: [
          { id: 'perk-1', title: 'Free Hot Towel Straight Razor Shave', pointsCost: 500, unlocked: pointsEarned >= 500 },
          { id: 'perk-2', title: '25% Off Any Apothecary Product', pointsCost: 300, unlocked: pointsEarned >= 300 },
          { id: 'perk-3', title: 'Complimentary 24K Cryo Eye Refresh', pointsCost: 400, unlocked: pointsEarned >= 400 },
          { id: 'perk-4', title: 'Obsidian VIP Bourbon Lounge Access', pointsCost: 1000, unlocked: pointsEarned >= 1000 }
        ]
      };
    } else {
      const p = loyaltyProfiles[normPhone];
      p.points += pointsEarned;
      p.visits += 1;
      p.lifetimeSpend += newAppointment.servicePrice;
      if (p.points >= 1500) p.tier = 'Obsidian Black VIP';
      else if (p.points >= 600) p.tier = 'Gold Prestige';
      p.availablePerks.forEach(perk => {
        if (p.points >= perk.pointsCost) perk.unlocked = true;
      });
    }

    res.status(201).json(newAppointment);
  });

  app.put('/api/appointments/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    const apt = appointments.find(a => a.id === id || a.reference === id);
    if (!apt) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    if (status) apt.status = status;
    if (paymentStatus) apt.paymentStatus = paymentStatus;
    res.json(apt);
  });

  // --- 4. Post-Service Payment Checkout ---
  app.post('/api/checkout/post-service', (req: Request, res: Response) => {
    const { reference, tipAmount, paymentMethod, purchasedProducts } = req.body;
    const apt = appointments.find(a => a.reference === reference || a.id === reference);
    if (!apt) {
      return res.status(404).json({ error: 'Appointment reference not found' });
    }

    const tip = Number(tipAmount) || 0;
    let addOnTotal = 0;
    if (Array.isArray(purchasedProducts)) {
      purchasedProducts.forEach((p: { price: number; quantity?: number }) => {
        addOnTotal += (p.price || 0) * (p.quantity || 1);
      });
    }

    const totalPaid = apt.servicePrice + tip + addOnTotal;
    apt.status = 'paid';
    apt.paymentStatus = 'paid';
    apt.tipAmount = tip;
    apt.totalPaid = totalPaid;
    apt.paymentMethod = paymentMethod || 'Credit Card';

    // Credit extra loyalty points for post-service payment & tip
    const normPhone = apt.customerPhone.replace(/\D/g, '');
    if (loyaltyProfiles[normPhone]) {
      loyaltyProfiles[normPhone].points += Math.round(totalPaid * 5);
      loyaltyProfiles[normPhone].lifetimeSpend += tip + addOnTotal;
    }

    res.json({
      success: true,
      receipt: {
        appointmentReference: apt.reference,
        customerName: apt.customerName,
        serviceName: apt.serviceName,
        barberName: apt.barberName,
        servicePrice: apt.servicePrice,
        tipAmount: tip,
        addOnTotal,
        totalPaid,
        paymentMethod: apt.paymentMethod,
        timestamp: new Date().toISOString()
      }
    });
  });

  // --- 5. E-Commerce Retail Store Orders ---
  app.get('/api/orders', (_req: Request, res: Response) => {
    res.json(orders);
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      items,
      paymentMethod
    } = req.body;

    if (!customerName || !items || !items.length) {
      return res.status(400).json({ error: 'Invalid order payload' });
    }

    let subtotal = 0;
    const detailedItems = items.map((it: { productId: string; quantity: number }) => {
      const prod = products.find(p => p.id === it.productId);
      const qty = it.quantity || 1;
      const price = prod ? prod.price : 30;
      subtotal += price * qty;

      // Decrement stock
      if (prod && prod.stock >= qty) {
        prod.stock -= qty;
      }

      return {
        productId: it.productId,
        productName: prod ? prod.name : 'Apothecary Product',
        price,
        quantity: qty,
        image: prod ? prod.image : '/src/assets/images/product_matte_pomade_1790174714855.jpg'
      };
    });

    const shipping = subtotal >= 75 ? 0 : 9.5;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + shipping + tax) * 100) / 100;
    const reference = 'ORD-' + Math.floor(1000 + Math.random() * 9000);

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      reference,
      customerName: String(customerName).trim(),
      customerPhone: String(customerPhone || '').trim(),
      customerEmail: String(customerEmail || '').trim(),
      shippingAddress: String(shippingAddress || 'In-Store Express Collection').trim(),
      items: detailedItems,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod: paymentMethod || 'Credit Card (Stripe)',
      status: 'processing',
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder);

    // Send SMS notification for order
    if (customerPhone) {
      reminderLogs.unshift({
        id: 'rem-' + Date.now() + '-order',
        appointmentRef: reference,
        customerName: newOrder.customerName,
        recipient: customerPhone,
        type: 'sms',
        scheduledTime: 'Immediate',
        sentAt: 'Sent',
        status: 'sent',
        message: `Aurelius Apothecary: Order #${reference} confirmed ($${total}). Preparing your luxury grooming package for dispatch.`
      });
    }

    res.status(201).json(newOrder);
  });

  // --- 6. Unified Real-Time Tracking ---
  app.get('/api/track/:reference', (req: Request, res: Response) => {
    const rawRef = req.params.reference.trim();
    const cleanRef = rawRef.toUpperCase();

    // Check appointments
    const appointmentMatch = appointments.find(
      a => a.reference.toUpperCase() === cleanRef || a.id === rawRef || a.customerPhone.includes(rawRef)
    );
    if (appointmentMatch) {
      return res.json({
        type: 'appointment',
        data: appointmentMatch,
        timeline: [
          { status: 'Booked & Confirmed', completed: true, timestamp: appointmentMatch.createdAt },
          { status: 'Barber Prep & Station Sterilization', completed: true, timestamp: '15 mins prior' },
          {
            status: appointmentMatch.status === 'in-progress' ? 'In Chair / Service Active' : 'Service Completed',
            completed: appointmentMatch.status === 'in-progress' || appointmentMatch.status === 'completed' || appointmentMatch.status === 'paid',
            current: appointmentMatch.status === 'in-progress'
          },
          {
            status: 'Payment & Loyalty Rewarded',
            completed: appointmentMatch.paymentStatus === 'paid',
            current: appointmentMatch.status === 'completed' && appointmentMatch.paymentStatus !== 'paid'
          }
        ]
      });
    }

    // Check orders
    const orderMatch = orders.find(
      o => o.reference.toUpperCase() === cleanRef || o.id === rawRef || o.customerPhone.includes(rawRef)
    );
    if (orderMatch) {
      return res.json({
        type: 'order',
        data: orderMatch,
        timeline: [
          { status: 'Order Placed & Verified', completed: true, timestamp: orderMatch.createdAt },
          { status: 'Crafted & Bottled at Apothecary', completed: true, timestamp: 'Same Day' },
          { status: 'Dispatched via Courier', completed: orderMatch.status === 'shipped' || orderMatch.status === 'delivered', current: orderMatch.status === 'shipped' },
          { status: 'Delivered to Doorstep', completed: orderMatch.status === 'delivered', current: false }
        ]
      });
    }

    return res.status(404).json({ error: 'No active appointment or order found for reference: ' + rawRef });
  });

  // --- 7. Loyalty Program Engine ---
  app.get('/api/loyalty/:phone', (req: Request, res: Response) => {
    const normPhone = req.params.phone.replace(/\D/g, '');
    const profile = loyaltyProfiles[normPhone] || loyaltyProfiles['+15551234567'];
    if (profile) {
      return res.json(profile);
    }
    return res.json({
      phone: req.params.phone,
      customerName: 'Gentleman Guest',
      points: 50,
      tier: 'Silver Member',
      visits: 0,
      lifetimeSpend: 0,
      nextTierProgress: 5,
      availablePerks: [
        { id: 'perk-1', title: 'Free Hot Towel Straight Razor Shave', pointsCost: 500, unlocked: false },
        { id: 'perk-2', title: '25% Off Any Apothecary Product', pointsCost: 300, unlocked: false },
        { id: 'perk-3', title: 'Complimentary 24K Cryo Eye Refresh', pointsCost: 400, unlocked: false },
        { id: 'perk-4', title: 'Obsidian VIP Bourbon Lounge Access', pointsCost: 1000, unlocked: false }
      ]
    });
  });

  app.post('/api/loyalty/redeem', (req: Request, res: Response) => {
    const { phone, perkId } = req.body;
    const normPhone = String(phone).replace(/\D/g, '');
    const profile = loyaltyProfiles[normPhone] || loyaltyProfiles['+15551234567'];

    if (!profile) {
      return res.status(404).json({ error: 'Loyalty profile not found' });
    }

    const perk = profile.availablePerks.find(p => p.id === perkId);
    if (!perk) {
      return res.status(404).json({ error: 'Perk not found' });
    }

    if (profile.points < perk.pointsCost) {
      return res.status(400).json({ error: 'Insufficient loyalty points' });
    }

    profile.points -= perk.pointsCost;
    res.json({ success: true, message: `Successfully redeemed "${perk.title}"! Voucher code: BLADE-${Math.floor(1000 + Math.random() * 9000)}`, updatedProfile: profile });
  });

  // --- 8. Simulated Automated Reminders & Test Notification ---
  app.get('/api/reminders', (_req: Request, res: Response) => {
    res.json(reminderLogs);
  });

  app.post('/api/reminders/send-test', (req: Request, res: Response) => {
    const { type, recipient, name, appointmentRef } = req.body;
    const newLog: ReminderLog = {
      id: 'rem-test-' + Date.now(),
      appointmentRef: appointmentRef || 'AB-TEST',
      customerName: name || 'Distinguished Guest',
      recipient: recipient || '+1 (555) 123-4567',
      type: type || 'sms',
      scheduledTime: 'Immediate Test Delivery',
      sentAt: new Date().toLocaleTimeString(),
      status: 'sent',
      message: `[TEST NOTIFICATION] Aurelius & Blade Reminder: Your luxury grooming service (Ref: ${appointmentRef || 'AB-8291'}) is confirmed. Our lounge lounge barista is ready to welcome you.`
    };
    reminderLogs.unshift(newLog);
    res.json({ success: true, log: newLog });
  });

  // --- 9. SECURE Backend Data Analytics Dashboard (Requires Admin Bearer Token) ---
  app.get('/api/admin/metrics', requireAdmin, (_req: Request, res: Response) => {
    const serviceRevenue = appointments.reduce((sum, a) => sum + (a.totalPaid || (a.status === 'paid' ? a.servicePrice : 0)), 0);
    const productSalesRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalRevenue = serviceRevenue + productSalesRevenue;
    const completedCount = appointments.filter(a => a.status === 'completed' || a.status === 'paid').length;
    const totalAppointments = appointments.length;

    // Barber performance
    const barberMap: Record<string, { name: string; count: number; revenue: number; rating: number }> = {};
    INITIAL_BARBERS.forEach(b => {
      barberMap[b.name] = { name: b.name, count: 0, revenue: 0, rating: b.rating };
    });

    appointments.forEach(a => {
      if (barberMap[a.barberName]) {
        barberMap[a.barberName].count += 1;
        barberMap[a.barberName].revenue += (a.totalPaid || a.servicePrice);
      }
    });

    // 7-day revenue projection/history
    const revenueByDay = [
      { day: 'Mon', amount: 840 },
      { day: 'Tue', amount: 1120 },
      { day: 'Wed', amount: 1450 },
      { day: 'Thu', amount: 1680 },
      { day: 'Fri', amount: 2240 },
      { day: 'Sat', amount: 2890 },
      { day: 'Sun', amount: 1320 }
    ];

    const metrics: any = {
      totalRevenue,
      serviceRevenue,
      productSalesRevenue,
      appointmentsCount: totalAppointments,
      completedRate: totalAppointments > 0 ? Math.round((completedCount / totalAppointments) * 100) : 100,
      repeatClientRate: 81.4,
      averageTicketValue: totalAppointments > 0 ? Math.round(serviceRevenue / (completedCount || 1)) : 75,
      remindersDelivered: reminderLogs.filter(r => r.status === 'sent').length,
      revenueByDay,
      barberPerformance: Object.values(barberMap),
      lowStockProducts: products.filter(p => p.stock < 20)
    };

    res.json(metrics);
  });

  // --- Static Production Serving or Vite Dev Middleware ---
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Luxury Barbershop App & Secure API listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
