// server.ts
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

// src/data/mockData.ts
var HERO_IMAGE = "/src/assets/images/mwingi_hero_african_man_1790175777735.jpg";
var WAVES_FADE_IMAGE = "/src/assets/images/african_man_waves_fade_1790175807521.jpg";
var BEARD_GROOMING_IMAGE = "/src/assets/images/african_man_beard_grooming_1790175817808.jpg";
var BARBER_MASTER_IMAGE = "/src/assets/images/barber_crew_african_master_1790175791861.jpg";
var BARBER_FADE_IMAGE = "/src/assets/images/barber_crew_fade_specialist_1790175830491.jpg";
var PRODUCT_IMAGE = "/src/assets/images/product_matte_pomade_1790174714855.jpg";
var INITIAL_SERVICES = [
  // Signature Cuts & Styling
  {
    id: "srv-1",
    name: "Executive Precision Cut & Razor Finish",
    category: "cuts",
    categoryTitle: "Signature Cuts & Styling",
    durationMinutes: 40,
    price: 500,
    popular: true,
    description: "Bespoke shear and clipper haircut tailored to your head shape, crisp razor hairline detailing, invigorating scalp wash, and premium pomade styling.",
    includes: ["Consultation & Hair Analysis", "Purifying Scalp Rinse", "Straight Razor Hairline Finish", "Aftershave Cologne Mist"]
  },
  {
    id: "srv-2",
    name: "Home Boyz Low/Mid/High Skin Fade & Waves",
    category: "cuts",
    categoryTitle: "Signature Cuts & Styling",
    durationMinutes: 45,
    price: 450,
    popular: true,
    description: "Surgical skin fade blending with deep wave enhancement, foil shaver zero-finish, and razor sharp edge-up.",
    includes: ["Foil Shaver Zero Blending", "Sharp Edge-Up Line", "Wave Pomade & Brush Session", "Cooling Menthol Spray"]
  },
  {
    id: "srv-3",
    name: "Clean Bald Shave & Hot Towel Therapy",
    category: "cuts",
    categoryTitle: "Signature Cuts & Styling",
    durationMinutes: 35,
    price: 400,
    description: "Double warm steamed towels, smooth multi-pass straight razor scalp shaving, and cold stone soothing cream to prevent razor bumps.",
    includes: ["Steamed Towel Prep", "Anti-Bump Oil Massage", "Dual Razor Passes", "Cold Soothing Calming Balm"]
  },
  {
    id: "srv-4",
    name: "Junior / Student Sharp Cut",
    category: "cuts",
    categoryTitle: "Signature Cuts & Styling",
    durationMinutes: 30,
    price: 300,
    description: "Clean, smart school and casual cuts for students and juniors (under 16). Patient styling and neat edging.",
    includes: ["Clean Scissor/Clipper Cut", "Gentle Razor Outline", "Natural Sheen Spray"]
  },
  // Beard Craft & Hot Towel Shaves
  {
    id: "srv-5",
    name: "Beard Sculpting, Razor Edge & Nourishing Oil",
    category: "beards",
    categoryTitle: "Beard Craft & Hot Towel Shaves",
    durationMinutes: 30,
    price: 350,
    popular: true,
    description: "Geometric beard reshaping, bulk graduation, straight razor cheek and neck line-up, and organic beard growth oil application.",
    includes: ["Beard Symmetry Assessment", "Razor Blade Contouring", "Hot Foam Neck Clean", "Argan Beard Oil Massage"]
  },
  {
    id: "srv-6",
    name: "Royal Hot Towel Herbal Shave",
    category: "beards",
    categoryTitle: "Beard Craft & Hot Towel Shaves",
    durationMinutes: 40,
    price: 500,
    description: "Steamed herbal towels with eucalyptus, rich lathering, smooth straight razor glide, and witch hazel closing compress.",
    includes: ["Herbal Steamed Towels", "Warm Foam Lathering", "Precision Razor Shave", "Aftershave Balm Rub"]
  },
  {
    id: "srv-7",
    name: "Beard Dye, Black Tint & Sharpening",
    category: "beards",
    categoryTitle: "Beard Craft & Hot Towel Shaves",
    durationMinutes: 35,
    price: 400,
    description: "Natural black organic tint to cover grey hairs and add fuller depth to your beard, followed by crisp razor outlining.",
    includes: ["Skin-Safe Dye Application", "Beard Density Coloring", "Clean Water Rinse", "Beard Butter Polish"]
  },
  // Facial Treatments & Skin Therapy
  {
    id: "srv-8",
    name: "Deep Cleanse Facial Scrub & Facial Steam",
    category: "facials",
    categoryTitle: "Facial Treatments & Skin Therapy",
    durationMinutes: 45,
    price: 600,
    popular: true,
    description: "Ozone facial steaming opens pores, followed by apricot exfoliating scrub to clear dead skin and soothe post-shave sensitivity.",
    includes: ["Ozone Warm Steam", "Exfoliating Apricot Scrub", "Hot Towel Extraction", "Hyaluronic Hydration"]
  },
  {
    id: "srv-9",
    name: "Activated Charcoal Black Mask & Detox",
    category: "facials",
    categoryTitle: "Facial Treatments & Skin Therapy",
    durationMinutes: 45,
    price: 700,
    description: "Removes deep blackheads, controls excess facial oils, and tightens pores for a crisp, radiant executive look.",
    includes: ["Steam Prep", "Charcoal Peel Mask", "Pore Tightening Toner", "Sunscreen Moisturizer"]
  },
  {
    id: "srv-10",
    name: "Full Glow Rejuvenation Facial Therapy",
    category: "facials",
    categoryTitle: "Facial Treatments & Skin Therapy",
    durationMinutes: 60,
    price: 1e3,
    description: "Ultimate skin transformation: Ultrasonic scrub, facial steam, detox mask, cold ice-roller massage, and anti-fatigue eye cream.",
    includes: ["Ultrasonic Skin Cleansing", "Herbal Facial Steam", "Collagen Mask Therapy", "Cold Roller Lymphatic Massage"]
  },
  // Executive Grooming Packages
  {
    id: "srv-11",
    name: "The Full Home Boyz VIP Package (All-Inclusive)",
    category: "packages",
    categoryTitle: "Executive Grooming Packages",
    durationMinutes: 90,
    price: 1500,
    popular: true,
    description: "Executive Haircut + Sharp Beard Sculpting + Steamed Facial Scrub + Black Mask + Head & Neck Massage + Complimentary Beverage.",
    includes: ["Signature Haircut of Choice", "Full Beard Trim & Razor Line", "Facial Steam & Black Mask", "Head & Shoulder Pressure Massage", "Complimentary Cold Soda or Coffee"]
  },
  {
    id: "srv-12",
    name: "Gentleman\u2019s Quick Refresh Package",
    category: "packages",
    categoryTitle: "Executive Grooming Packages",
    durationMinutes: 55,
    price: 800,
    description: "Fresh Fade or Scissor Cut + Full Beard Razor Outlining + Mint Hot Towel Refresh for a quick meeting or event.",
    includes: ["Skin Fade or Shear Cut", "Beard Trim & Clean Edges", "Mint Steamed Towel", "Bespoke Aftershave Cologne"]
  }
];
var INITIAL_BARBERS = [
  {
    id: "barber-1",
    name: "Banner Mwangi",
    role: "Lead Master Barber & Founder",
    experienceYears: 10,
    specialty: "Executive Precision Cuts, 360 Waves & Skin Fades",
    image: BARBER_MASTER_IMAGE,
    rating: 4.99,
    reviewCount: 380,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    bio: "Renowned barber artisan serving Mwingi with modern European scissor work and surgical African fade techniques."
  },
  {
    id: "barber-2",
    name: "Kelvin Mutua",
    role: "Senior Fade Artisan & Lineup Specialist",
    experienceYears: 7,
    specialty: "Drop Fades, Low Tapers & Surgical Edge-Ups",
    image: BARBER_FADE_IMAGE,
    rating: 4.96,
    reviewCount: 295,
    availableDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    bio: "Millimeter fade accuracy with seamless transitions on all hair types."
  },
  {
    id: "barber-3",
    name: "Brian Musyoka",
    role: "Master Shaver & Beard Architect",
    experienceYears: 8,
    specialty: "Straight Razor Shaves, Beard Dye & Steam Therapy",
    image: BEARD_GROOMING_IMAGE,
    rating: 4.97,
    reviewCount: 310,
    availableDays: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    bio: "Specialist in hot towel straight razor ceremonies and beard contouring."
  },
  {
    id: "barber-4",
    name: "Dennis Kimanzi",
    role: "Facial Aesthetics & Skin Specialist",
    experienceYears: 6,
    specialty: "Charcoal Masks, Blackhead Extraction & Ozone Steam",
    image: WAVES_FADE_IMAGE,
    rating: 4.94,
    reviewCount: 220,
    availableDays: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"],
    bio: "Certified men\u2019s grooming aesthetician for healthy, glowing skin."
  }
];
var INITIAL_GALLERY = [
  {
    id: "gal-1",
    title: "Clean Low Taper Fade & 360 Deep Waves",
    category: "fades",
    categoryLabel: "Precision Fades",
    barberName: "Banner Mwangi",
    image: WAVES_FADE_IMAGE,
    description: "Surgical hairline edge-up with deep crown waves and smooth taper down the sideburns.",
    productUsed: "Home Boyz Wave Pomade"
  },
  {
    id: "gal-2",
    title: "Hot Towel Beard Detailing & Razor Lineup",
    category: "beard",
    categoryLabel: "Beard Sculpting",
    barberName: "Brian Musyoka",
    image: BEARD_GROOMING_IMAGE,
    description: "Steamed herbal towel application and mirror-straight razor cheek contouring.",
    productUsed: "Mwingi Sandalwood Beard Oil"
  },
  {
    id: "gal-3",
    title: "High-Fashion African Executive Fade",
    category: "fades",
    categoryLabel: "Precision Fades",
    barberName: "Kelvin Mutua",
    image: HERO_IMAGE,
    description: "High skin fade connected to sculpted beard with sharp razor cheek lines.",
    productUsed: "Matte Styling Clay"
  },
  {
    id: "gal-4",
    title: "Master Craftsman Station at Mwingi Lounge",
    category: "facials",
    categoryLabel: "Crew at Work",
    barberName: "The Crew",
    image: BARBER_MASTER_IMAGE,
    description: "Professional barber tools, sterilized blades, and welcoming atmosphere.",
    productUsed: "Sterilized Feather Blades"
  }
];
var INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    name: "Home Boyz Matte Wave & Styling Clay",
    category: "hair",
    categoryLabel: "Hair & Waves",
    price: 1200,
    size: "100g / 3.5 oz",
    image: PRODUCT_IMAGE,
    description: "Strong pliable hold with zero greasy shine. Locks in deep 360 waves, textured crops, and clean side parts throughout the day.",
    rating: 4.9,
    reviewsCount: 142,
    stock: 35,
    ingredients: "Beeswax, Kaolin Clay, Shea Butter, Coconut Oil, Cedar Extract"
  },
  {
    id: "prod-2",
    name: "Organic Beard Growth Oil & Sandalwood Elixir",
    category: "beard",
    categoryLabel: "Beard Care",
    price: 1400,
    size: "50ml",
    image: BEARD_GROOMING_IMAGE,
    description: "Cold-pressed Kenyan castor, jojoba, and sweet almond oils. Softens coarse facial hair, prevents itch, and stimulates even beard growth.",
    rating: 4.95,
    reviewsCount: 168,
    stock: 28,
    ingredients: "Pure Castor Oil, Golden Jojoba, Argan, Vitamin E, Sandalwood Essential Oil"
  },
  {
    id: "prod-3",
    name: "Sea Salt Texturizing & Wave Setting Mist",
    category: "hair",
    categoryLabel: "Hair Styling",
    price: 950,
    size: "200ml",
    image: WAVES_FADE_IMAGE,
    description: "Gives natural volume, grit, and crisp texture without stiffness. Perfect pre-styler before wave brushing.",
    rating: 4.86,
    reviewsCount: 88,
    stock: 40,
    ingredients: "Natural Sea Salt, Witch Hazel, Aloe Vera, Magnesium"
  },
  {
    id: "prod-4",
    name: "Activated Charcoal & Volcanic Face Scrub",
    category: "skincare",
    categoryLabel: "Skin Therapy",
    price: 1100,
    size: "150ml",
    image: HERO_IMAGE,
    description: "Clears clogged pores, removes dead skin, and prevents ingrown hairs and razor bumps after shaving.",
    rating: 4.92,
    reviewsCount: 95,
    stock: 22,
    ingredients: "Activated Charcoal, Finely Milled Apricot Kernels, Tea Tree Oil"
  },
  {
    id: "prod-5",
    name: "Damascus Steel Folding Straight Razor",
    category: "hardware",
    categoryLabel: "Hardware",
    price: 3200,
    size: "Standard 85g",
    image: BARBER_MASTER_IMAGE,
    description: "Weighted professional folding razor with ebony handle. Uses standard double-edge safety blades for surgical edging.",
    rating: 5,
    reviewsCount: 54,
    stock: 14,
    ingredients: "Damascus Patterned Steel, Hardwood Handle, Brass Screws"
  },
  {
    id: "prod-6",
    name: "Cooling Menthol & Aloe Aftershave Splash",
    category: "hair",
    categoryLabel: "Aftershave",
    price: 850,
    size: "250ml",
    image: PRODUCT_IMAGE,
    description: "Instant cooling relief after clipper work and straight razor fades. Disinfects and leaves a pleasant masculine fragrance.",
    rating: 4.88,
    reviewsCount: 114,
    stock: 30,
    ingredients: "Menthol, Aloe Vera Gel, Witch Hazel, Eucalyptus"
  }
];
var INITIAL_REVIEWS = [
  {
    id: "rev-1",
    author: "Justus Mutemi",
    rating: 5,
    date: "Yesterday",
    serviceName: "The Full Home Boyz VIP Package",
    barberName: "Banner Mwangi",
    comment: "Best barbershop in Mwingi town by far! Banner has magical hands with the clippers. The hot towel and facial steam made me feel like a VIP. Automated SMS alert was sent right on time.",
    verified: true
  },
  {
    id: "rev-2",
    author: "Samson Kilonzo",
    rating: 5,
    date: "3 days ago",
    serviceName: "Home Boyz Skin Fade & Waves",
    barberName: "Kelvin Mutua",
    comment: "Kelvin gave me the sharpest low drop fade and edge-up. My waves look crisp. Love the modern dark vibe of the shop and the WhatsApp booking.",
    verified: true
  },
  {
    id: "rev-3",
    author: "Erick Mwende",
    rating: 5,
    date: "1 week ago",
    serviceName: "Beard Sculpting & Razor Edge",
    barberName: "Brian Musyoka",
    comment: "Brian sculpted my beard to perfection. Zero razor bumps and the beard oil smells amazing. Fair Kenyan prices for top executive service.",
    verified: true
  },
  {
    id: "rev-4",
    author: "David Musyoki",
    rating: 5,
    date: "2 weeks ago",
    serviceName: "Activated Charcoal Black Mask",
    barberName: "Dennis Kimanzi",
    comment: "Had lots of blackheads and tired skin from Mwingi dust. Dennis cleared everything with steam and the charcoal mask. Will definitely be coming back every fortnight.",
    verified: true
  }
];
var SAMPLE_LOYALTY_PROFILES = {
  "0746145712": {
    phone: "0746145712",
    customerName: "Banner Mwangi",
    points: 1250,
    tier: "Gold Prestige",
    visits: 14,
    lifetimeSpend: 6800,
    nextTierProgress: 83,
    availablePerks: [
      { id: "perk-1", title: "Free Royal Hot Towel Shave", pointsCost: 500, unlocked: true },
      { id: "perk-2", title: "25% Off Wave Pomade or Beard Oil", pointsCost: 300, unlocked: true },
      { id: "perk-3", title: "Complimentary Deep Facial Scrub", pointsCost: 600, unlocked: true },
      { id: "perk-4", title: "VIP Priority Chair & Cold Beverage Pour", pointsCost: 1e3, unlocked: true }
    ]
  }
};

// server.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var ADMIN_CREDENTIALS = {
  email: "bannermwangi0@gmail.com",
  pin: "7799",
  role: "Founder & Lead Master Barber"
};
var appointments = [
  {
    id: "apt-101",
    reference: "HB-1042",
    customerName: "Samson Kilonzo",
    customerPhone: "0746145712",
    customerEmail: "bannermwangi0@gmail.com",
    barberId: "barber-1",
    barberName: "Banner Mwangi",
    serviceId: "srv-11",
    serviceName: "The Full Home Boyz VIP Package (All-Inclusive)",
    servicePrice: 1500,
    date: "2026-09-24",
    time: "11:00 AM",
    durationMinutes: 90,
    status: "confirmed",
    reminderPreference: "both",
    paymentStatus: "unpaid",
    notes: "Prefers low taper fade, clean line-up, and facial steam.",
    createdAt: new Date(Date.now() - 36e5 * 8).toISOString()
  },
  {
    id: "apt-102",
    reference: "HB-1043",
    customerName: "Erick Mwende",
    customerPhone: "0712345678",
    customerEmail: "erick.m@mwingi.co.ke",
    barberId: "barber-2",
    barberName: "Kelvin Mutua",
    serviceId: "srv-2",
    serviceName: "Home Boyz Low/Mid/High Skin Fade & Waves",
    servicePrice: 450,
    date: "2026-09-24",
    time: "01:30 PM",
    durationMinutes: 45,
    status: "in-progress",
    reminderPreference: "sms",
    paymentStatus: "unpaid",
    notes: "Keep waves full on top, low skin fade around ears.",
    createdAt: new Date(Date.now() - 36e5 * 5).toISOString()
  },
  {
    id: "apt-103",
    reference: "HB-1039",
    customerName: "Justus Mutemi",
    customerPhone: "0722998877",
    customerEmail: "justus.mutemi@kitui.go.ke",
    barberId: "barber-3",
    barberName: "Brian Musyoka",
    serviceId: "srv-5",
    serviceName: "Beard Sculpting, Razor Edge & Nourishing Oil",
    servicePrice: 350,
    date: "2026-09-23",
    time: "10:00 AM",
    durationMinutes: 30,
    status: "paid",
    reminderPreference: "whatsapp",
    paymentStatus: "paid",
    tipAmount: 100,
    totalPaid: 450,
    paymentMethod: "M-Pesa (0746145712)",
    notes: "Steamed hot towel and sharp razor cheek line.",
    createdAt: new Date(Date.now() - 36e5 * 24).toISOString()
  },
  {
    id: "apt-104",
    reference: "HB-1035",
    customerName: "David Musyoki",
    customerPhone: "0733112233",
    customerEmail: "d.musyoki@gmail.com",
    barberId: "barber-1",
    barberName: "Banner Mwangi",
    serviceId: "srv-1",
    serviceName: "Executive Precision Cut & Razor Finish",
    servicePrice: 500,
    date: "2026-09-22",
    time: "03:00 PM",
    durationMinutes: 40,
    status: "paid",
    reminderPreference: "both",
    paymentStatus: "paid",
    tipAmount: 100,
    totalPaid: 600,
    paymentMethod: "M-Pesa (0746145712)",
    createdAt: new Date(Date.now() - 36e5 * 48).toISOString()
  }
];
var orders = [
  {
    id: "ord-501",
    reference: "ORD-9104",
    customerName: "Alexander Ross",
    customerPhone: "+15551234567",
    customerEmail: "alex.ross@meridian.com",
    shippingAddress: "742 Evergreen Terrace, Suite 400",
    items: [
      {
        productId: "prod-1",
        productName: "Obsidian Matte Clay Pomade",
        price: 34,
        quantity: 2,
        image: "/src/assets/images/product_matte_pomade_1790174714855.jpg"
      },
      {
        productId: "prod-2",
        productName: "Sandalwood & Bourbon Beard Elixir",
        price: 38,
        quantity: 1,
        image: "/src/assets/images/barbershop_hot_towel_shave_1790174702380.jpg"
      }
    ],
    subtotal: 106,
    shipping: 0,
    tax: 8.48,
    total: 114.48,
    paymentMethod: "Credit Card",
    status: "shipped",
    createdAt: new Date(Date.now() - 36e5 * 18).toISOString()
  }
];
var reminderLogs = [
  {
    id: "rem-1",
    appointmentRef: "AB-8291",
    customerName: "Marcus Sterling",
    recipient: "+1 (555) 234-8901",
    type: "sms",
    scheduledTime: "2026-09-23 11:00 AM (24h before)",
    sentAt: "2026-09-23 11:01 AM",
    status: "sent",
    message: "Aurelius & Blade Reminder: Your Emperor\u2019s Ritual appointment with Vance is tomorrow at 11:00 AM. Complimentary lounge valet & bar available. Reply CANCEL or CHANGE if needed."
  },
  {
    id: "rem-2",
    appointmentRef: "AB-8291",
    customerName: "Marcus Sterling",
    recipient: "m.sterling@investments.com",
    type: "email",
    scheduledTime: "2026-09-23 11:00 AM",
    sentAt: "2026-09-23 11:01 AM",
    status: "sent",
    message: 'Official Lounge Reservation: Marcus Sterling, your appointment with Marcus "Vance" Thorne is confirmed for Sept 24 at 11:00 AM.'
  },
  {
    id: "rem-3",
    appointmentRef: "AB-8292",
    customerName: "Liam O\u2019Connor",
    recipient: "+1 (555) 876-1234",
    type: "sms",
    scheduledTime: "2026-09-24 11:30 AM (2h before)",
    sentAt: "2026-09-24 11:30 AM",
    status: "sent",
    message: "Aurelius & Blade: Elena is preparing your station for 01:30 PM. See you shortly in the lounge!"
  }
];
var reviews = [...INITIAL_REVIEWS];
var products = [...INITIAL_PRODUCTS];
var loyaltyProfiles = { ...SAMPLE_LOYALTY_PROFILES };
var validSessionTokens = /* @__PURE__ */ new Set();
async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3e3;
  app.use(express.json());
  const requireAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Admin authentication token required" });
    }
    const token = authHeader.split(" ")[1];
    if (!validSessionTokens.has(token)) {
      return res.status(403).json({ error: "Forbidden: Invalid or expired admin session token" });
    }
    next();
  };
  app.post("/api/auth/admin-login", (req, res) => {
    const { email, pin } = req.body;
    if (email && email.toLowerCase().trim() === ADMIN_CREDENTIALS.email.toLowerCase() && pin === ADMIN_CREDENTIALS.pin) {
      const sessionToken = "adm_" + crypto.randomBytes(24).toString("hex");
      validSessionTokens.add(sessionToken);
      return res.json({
        success: true,
        token: sessionToken,
        user: {
          name: "Managing Director",
          email: ADMIN_CREDENTIALS.email,
          role: ADMIN_CREDENTIALS.role
        }
      });
    }
    return res.status(401).json({ success: false, error: "Invalid executive credentials or security PIN" });
  });
  app.post("/api/auth/verify", (req, res) => {
    const { token } = req.body;
    if (token && validSessionTokens.has(token)) {
      return res.json({ valid: true, user: { name: "Managing Director", email: ADMIN_CREDENTIALS.email } });
    }
    return res.json({ valid: false });
  });
  app.post("/api/auth/logout", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      validSessionTokens.delete(token);
    }
    return res.json({ success: true });
  });
  app.get("/api/services", (_req, res) => {
    res.json(INITIAL_SERVICES);
  });
  app.get("/api/barbers", (_req, res) => {
    res.json(INITIAL_BARBERS);
  });
  app.get("/api/gallery", (_req, res) => {
    res.json(INITIAL_GALLERY);
  });
  app.get("/api/products", (_req, res) => {
    res.json(products);
  });
  app.get("/api/reviews", (_req, res) => {
    res.json(reviews);
  });
  app.post("/api/reviews", (req, res) => {
    const { author, rating, comment, serviceName, barberName } = req.body;
    if (!author || !rating || !comment) {
      return res.status(400).json({ error: "Missing required review fields" });
    }
    const newReview = {
      id: "rev-" + Date.now(),
      author: String(author).trim(),
      rating: Number(rating),
      date: "Just now",
      serviceName: serviceName || "Bespoke Grooming",
      barberName: barberName || "Master Barber Team",
      comment: String(comment).trim(),
      verified: true
    };
    reviews.unshift(newReview);
    res.status(201).json(newReview);
  });
  app.get("/api/appointments", (_req, res) => {
    res.json(appointments);
  });
  app.post("/api/appointments", (req, res) => {
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
      return res.status(400).json({ error: "Missing required booking information" });
    }
    const reference = "AB-" + Math.floor(1e3 + Math.random() * 9e3);
    const newAppointment = {
      id: "apt-" + Date.now(),
      reference,
      customerName: String(customerName).trim(),
      customerPhone: String(customerPhone).trim(),
      customerEmail: String(customerEmail || "").trim(),
      barberId: barberId || "barber-1",
      barberName: barberName || 'Marcus "Vance" Thorne',
      serviceId,
      serviceName,
      servicePrice: Number(servicePrice) || 65,
      date,
      time,
      durationMinutes: Number(durationMinutes) || 45,
      status: "confirmed",
      reminderPreference: reminderPreference || "both",
      paymentStatus: "unpaid",
      notes: notes ? String(notes).trim() : void 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    appointments.unshift(newAppointment);
    const pref = newAppointment.reminderPreference;
    if (pref === "sms" || pref === "both") {
      reminderLogs.unshift({
        id: "rem-" + Date.now() + "-sms",
        appointmentRef: reference,
        customerName: newAppointment.customerName,
        recipient: newAppointment.customerPhone,
        type: "sms",
        scheduledTime: `${date} ${time} (24h reminder scheduled)`,
        sentAt: "Instant confirmation sent",
        status: "sent",
        message: `Aurelius & Blade: Confirmed! ${newAppointment.serviceName} with ${newAppointment.barberName} on ${date} at ${time}. Ref #${reference}. See you at the lounge!`
      });
    }
    if ((pref === "email" || pref === "both") && newAppointment.customerEmail) {
      reminderLogs.unshift({
        id: "rem-" + Date.now() + "-email",
        appointmentRef: reference,
        customerName: newAppointment.customerName,
        recipient: newAppointment.customerEmail,
        type: "email",
        scheduledTime: `${date} ${time} (Confirmation & 2h reminder)`,
        sentAt: "Instant email dispatched",
        status: "sent",
        message: `Executive Reservation Confirmed: Ref ${reference} for ${newAppointment.customerName}. Service: ${newAppointment.serviceName}. Address: 420 Obsidian Boulevard, 2nd Floor Lounge.`
      });
    }
    if (pref === "whatsapp") {
      reminderLogs.unshift({
        id: "rem-" + Date.now() + "-wa",
        appointmentRef: reference,
        customerName: newAppointment.customerName,
        recipient: newAppointment.customerPhone,
        type: "whatsapp",
        scheduledTime: `${date} ${time}`,
        sentAt: "WhatsApp confirmation generated",
        status: "sent",
        message: `Hello ${newAppointment.customerName}! Your luxury grooming appointment #${reference} is locked in for ${date} at ${time}.`
      });
    }
    const normPhone = newAppointment.customerPhone.replace(/\D/g, "");
    const pointsEarned = Math.round(newAppointment.servicePrice * 10);
    if (!loyaltyProfiles[normPhone]) {
      loyaltyProfiles[normPhone] = {
        phone: newAppointment.customerPhone,
        customerName: newAppointment.customerName,
        points: pointsEarned,
        tier: "Silver Member",
        visits: 1,
        lifetimeSpend: newAppointment.servicePrice,
        nextTierProgress: Math.min(100, Math.round(pointsEarned / 1e3 * 100)),
        availablePerks: [
          { id: "perk-1", title: "Free Hot Towel Straight Razor Shave", pointsCost: 500, unlocked: pointsEarned >= 500 },
          { id: "perk-2", title: "25% Off Any Apothecary Product", pointsCost: 300, unlocked: pointsEarned >= 300 },
          { id: "perk-3", title: "Complimentary 24K Cryo Eye Refresh", pointsCost: 400, unlocked: pointsEarned >= 400 },
          { id: "perk-4", title: "Obsidian VIP Bourbon Lounge Access", pointsCost: 1e3, unlocked: pointsEarned >= 1e3 }
        ]
      };
    } else {
      const p = loyaltyProfiles[normPhone];
      p.points += pointsEarned;
      p.visits += 1;
      p.lifetimeSpend += newAppointment.servicePrice;
      if (p.points >= 1500) p.tier = "Obsidian Black VIP";
      else if (p.points >= 600) p.tier = "Gold Prestige";
      p.availablePerks.forEach((perk) => {
        if (p.points >= perk.pointsCost) perk.unlocked = true;
      });
    }
    res.status(201).json(newAppointment);
  });
  app.put("/api/appointments/:id/status", (req, res) => {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    const apt = appointments.find((a) => a.id === id || a.reference === id);
    if (!apt) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    if (status) apt.status = status;
    if (paymentStatus) apt.paymentStatus = paymentStatus;
    res.json(apt);
  });
  app.post("/api/checkout/post-service", (req, res) => {
    const { reference, tipAmount, paymentMethod, purchasedProducts } = req.body;
    const apt = appointments.find((a) => a.reference === reference || a.id === reference);
    if (!apt) {
      return res.status(404).json({ error: "Appointment reference not found" });
    }
    const tip = Number(tipAmount) || 0;
    let addOnTotal = 0;
    if (Array.isArray(purchasedProducts)) {
      purchasedProducts.forEach((p) => {
        addOnTotal += (p.price || 0) * (p.quantity || 1);
      });
    }
    const totalPaid = apt.servicePrice + tip + addOnTotal;
    apt.status = "paid";
    apt.paymentStatus = "paid";
    apt.tipAmount = tip;
    apt.totalPaid = totalPaid;
    apt.paymentMethod = paymentMethod || "Credit Card";
    const normPhone = apt.customerPhone.replace(/\D/g, "");
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
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  });
  app.get("/api/orders", (_req, res) => {
    res.json(orders);
  });
  app.post("/api/orders", (req, res) => {
    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      items,
      paymentMethod
    } = req.body;
    if (!customerName || !items || !items.length) {
      return res.status(400).json({ error: "Invalid order payload" });
    }
    let subtotal = 0;
    const detailedItems = items.map((it) => {
      const prod = products.find((p) => p.id === it.productId);
      const qty = it.quantity || 1;
      const price = prod ? prod.price : 30;
      subtotal += price * qty;
      if (prod && prod.stock >= qty) {
        prod.stock -= qty;
      }
      return {
        productId: it.productId,
        productName: prod ? prod.name : "Apothecary Product",
        price,
        quantity: qty,
        image: prod ? prod.image : "/src/assets/images/product_matte_pomade_1790174714855.jpg"
      };
    });
    const shipping = subtotal >= 75 ? 0 : 9.5;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + shipping + tax) * 100) / 100;
    const reference = "ORD-" + Math.floor(1e3 + Math.random() * 9e3);
    const newOrder = {
      id: "ord-" + Date.now(),
      reference,
      customerName: String(customerName).trim(),
      customerPhone: String(customerPhone || "").trim(),
      customerEmail: String(customerEmail || "").trim(),
      shippingAddress: String(shippingAddress || "In-Store Express Collection").trim(),
      items: detailedItems,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod: paymentMethod || "Credit Card (Stripe)",
      status: "processing",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    orders.unshift(newOrder);
    if (customerPhone) {
      reminderLogs.unshift({
        id: "rem-" + Date.now() + "-order",
        appointmentRef: reference,
        customerName: newOrder.customerName,
        recipient: customerPhone,
        type: "sms",
        scheduledTime: "Immediate",
        sentAt: "Sent",
        status: "sent",
        message: `Aurelius Apothecary: Order #${reference} confirmed ($${total}). Preparing your luxury grooming package for dispatch.`
      });
    }
    res.status(201).json(newOrder);
  });
  app.get("/api/track/:reference", (req, res) => {
    const rawRef = req.params.reference.trim();
    const cleanRef = rawRef.toUpperCase();
    const appointmentMatch = appointments.find(
      (a) => a.reference.toUpperCase() === cleanRef || a.id === rawRef || a.customerPhone.includes(rawRef)
    );
    if (appointmentMatch) {
      return res.json({
        type: "appointment",
        data: appointmentMatch,
        timeline: [
          { status: "Booked & Confirmed", completed: true, timestamp: appointmentMatch.createdAt },
          { status: "Barber Prep & Station Sterilization", completed: true, timestamp: "15 mins prior" },
          {
            status: appointmentMatch.status === "in-progress" ? "In Chair / Service Active" : "Service Completed",
            completed: appointmentMatch.status === "in-progress" || appointmentMatch.status === "completed" || appointmentMatch.status === "paid",
            current: appointmentMatch.status === "in-progress"
          },
          {
            status: "Payment & Loyalty Rewarded",
            completed: appointmentMatch.paymentStatus === "paid",
            current: appointmentMatch.status === "completed" && appointmentMatch.paymentStatus !== "paid"
          }
        ]
      });
    }
    const orderMatch = orders.find(
      (o) => o.reference.toUpperCase() === cleanRef || o.id === rawRef || o.customerPhone.includes(rawRef)
    );
    if (orderMatch) {
      return res.json({
        type: "order",
        data: orderMatch,
        timeline: [
          { status: "Order Placed & Verified", completed: true, timestamp: orderMatch.createdAt },
          { status: "Crafted & Bottled at Apothecary", completed: true, timestamp: "Same Day" },
          { status: "Dispatched via Courier", completed: orderMatch.status === "shipped" || orderMatch.status === "delivered", current: orderMatch.status === "shipped" },
          { status: "Delivered to Doorstep", completed: orderMatch.status === "delivered", current: false }
        ]
      });
    }
    return res.status(404).json({ error: "No active appointment or order found for reference: " + rawRef });
  });
  app.get("/api/loyalty/:phone", (req, res) => {
    const normPhone = req.params.phone.replace(/\D/g, "");
    const profile = loyaltyProfiles[normPhone] || loyaltyProfiles["+15551234567"];
    if (profile) {
      return res.json(profile);
    }
    return res.json({
      phone: req.params.phone,
      customerName: "Gentleman Guest",
      points: 50,
      tier: "Silver Member",
      visits: 0,
      lifetimeSpend: 0,
      nextTierProgress: 5,
      availablePerks: [
        { id: "perk-1", title: "Free Hot Towel Straight Razor Shave", pointsCost: 500, unlocked: false },
        { id: "perk-2", title: "25% Off Any Apothecary Product", pointsCost: 300, unlocked: false },
        { id: "perk-3", title: "Complimentary 24K Cryo Eye Refresh", pointsCost: 400, unlocked: false },
        { id: "perk-4", title: "Obsidian VIP Bourbon Lounge Access", pointsCost: 1e3, unlocked: false }
      ]
    });
  });
  app.post("/api/loyalty/redeem", (req, res) => {
    const { phone, perkId } = req.body;
    const normPhone = String(phone).replace(/\D/g, "");
    const profile = loyaltyProfiles[normPhone] || loyaltyProfiles["+15551234567"];
    if (!profile) {
      return res.status(404).json({ error: "Loyalty profile not found" });
    }
    const perk = profile.availablePerks.find((p) => p.id === perkId);
    if (!perk) {
      return res.status(404).json({ error: "Perk not found" });
    }
    if (profile.points < perk.pointsCost) {
      return res.status(400).json({ error: "Insufficient loyalty points" });
    }
    profile.points -= perk.pointsCost;
    res.json({ success: true, message: `Successfully redeemed "${perk.title}"! Voucher code: BLADE-${Math.floor(1e3 + Math.random() * 9e3)}`, updatedProfile: profile });
  });
  app.get("/api/reminders", (_req, res) => {
    res.json(reminderLogs);
  });
  app.post("/api/reminders/send-test", (req, res) => {
    const { type, recipient, name, appointmentRef } = req.body;
    const newLog = {
      id: "rem-test-" + Date.now(),
      appointmentRef: appointmentRef || "AB-TEST",
      customerName: name || "Distinguished Guest",
      recipient: recipient || "+1 (555) 123-4567",
      type: type || "sms",
      scheduledTime: "Immediate Test Delivery",
      sentAt: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
      status: "sent",
      message: `[TEST NOTIFICATION] Aurelius & Blade Reminder: Your luxury grooming service (Ref: ${appointmentRef || "AB-8291"}) is confirmed. Our lounge lounge barista is ready to welcome you.`
    };
    reminderLogs.unshift(newLog);
    res.json({ success: true, log: newLog });
  });
  app.get("/api/admin/metrics", requireAdmin, (_req, res) => {
    const serviceRevenue = appointments.reduce((sum, a) => sum + (a.totalPaid || (a.status === "paid" ? a.servicePrice : 0)), 0);
    const productSalesRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalRevenue = serviceRevenue + productSalesRevenue;
    const completedCount = appointments.filter((a) => a.status === "completed" || a.status === "paid").length;
    const totalAppointments = appointments.length;
    const barberMap = {};
    INITIAL_BARBERS.forEach((b) => {
      barberMap[b.name] = { name: b.name, count: 0, revenue: 0, rating: b.rating };
    });
    appointments.forEach((a) => {
      if (barberMap[a.barberName]) {
        barberMap[a.barberName].count += 1;
        barberMap[a.barberName].revenue += a.totalPaid || a.servicePrice;
      }
    });
    const revenueByDay = [
      { day: "Mon", amount: 840 },
      { day: "Tue", amount: 1120 },
      { day: "Wed", amount: 1450 },
      { day: "Thu", amount: 1680 },
      { day: "Fri", amount: 2240 },
      { day: "Sat", amount: 2890 },
      { day: "Sun", amount: 1320 }
    ];
    const metrics = {
      totalRevenue,
      serviceRevenue,
      productSalesRevenue,
      appointmentsCount: totalAppointments,
      completedRate: totalAppointments > 0 ? Math.round(completedCount / totalAppointments * 100) : 100,
      repeatClientRate: 81.4,
      averageTicketValue: totalAppointments > 0 ? Math.round(serviceRevenue / (completedCount || 1)) : 75,
      remindersDelivered: reminderLogs.filter((r) => r.status === "sent").length,
      revenueByDay,
      barberPerformance: Object.values(barberMap),
      lowStockProducts: products.filter((p) => p.stock < 20)
    };
    res.json(metrics);
  });
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Luxury Barbershop App & Secure API listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
