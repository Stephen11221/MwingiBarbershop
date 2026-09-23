import { Service, Barber, GalleryItem, Review, Product, LoyaltyProfile } from '../types.ts';

export const HERO_IMAGE = '/src/assets/images/mwingi_hero_african_man_1790175777735.jpg';
export const WAVES_FADE_IMAGE = '/src/assets/images/african_man_waves_fade_1790175807521.jpg';
export const BEARD_GROOMING_IMAGE = '/src/assets/images/african_man_beard_grooming_1790175817808.jpg';
export const BARBER_MASTER_IMAGE = '/src/assets/images/barber_crew_african_master_1790175791861.jpg';
export const BARBER_FADE_IMAGE = '/src/assets/images/barber_crew_fade_specialist_1790175830491.jpg';
export const PRODUCT_IMAGE = '/src/assets/images/product_matte_pomade_1790174714855.jpg';

export const SHOP_INFO = {
  name: 'Mwingi Home Boyz Cut',
  tagline: 'Premier Executive Barbershop & Grooming Lounge',
  phone: '0746145712',
  phoneInternational: '+254746145712',
  email: 'bannermwangi0@gmail.com',
  location: 'Mwingi Town, Kitui County, Kenya',
  locationDetails: 'Opposite Equity Bank, Mwingi Central Business Hub',
  currency: 'KSh',
  hours: {
    weekdays: '7:30 AM – 9:00 PM',
    saturday: '7:00 AM – 9:30 PM',
    sunday: '8:00 AM – 8:00 PM'
  }
};

export const INITIAL_SERVICES: Service[] = [
  // Signature Cuts & Styling
  {
    id: 'srv-1',
    name: 'Executive Precision Cut & Razor Finish',
    category: 'cuts',
    categoryTitle: 'Signature Cuts & Styling',
    durationMinutes: 40,
    price: 500,
    popular: true,
    description: 'Bespoke shear and clipper haircut tailored to your head shape, crisp razor hairline detailing, invigorating scalp wash, and premium pomade styling.',
    includes: ['Consultation & Hair Analysis', 'Purifying Scalp Rinse', 'Straight Razor Hairline Finish', 'Aftershave Cologne Mist']
  },
  {
    id: 'srv-2',
    name: 'Home Boyz Low/Mid/High Skin Fade & Waves',
    category: 'cuts',
    categoryTitle: 'Signature Cuts & Styling',
    durationMinutes: 45,
    price: 450,
    popular: true,
    description: 'Surgical skin fade blending with deep wave enhancement, foil shaver zero-finish, and razor sharp edge-up.',
    includes: ['Foil Shaver Zero Blending', 'Sharp Edge-Up Line', 'Wave Pomade & Brush Session', 'Cooling Menthol Spray']
  },
  {
    id: 'srv-3',
    name: 'Clean Bald Shave & Hot Towel Therapy',
    category: 'cuts',
    categoryTitle: 'Signature Cuts & Styling',
    durationMinutes: 35,
    price: 400,
    description: 'Double warm steamed towels, smooth multi-pass straight razor scalp shaving, and cold stone soothing cream to prevent razor bumps.',
    includes: ['Steamed Towel Prep', 'Anti-Bump Oil Massage', 'Dual Razor Passes', 'Cold Soothing Calming Balm']
  },
  {
    id: 'srv-4',
    name: 'Junior / Student Sharp Cut',
    category: 'cuts',
    categoryTitle: 'Signature Cuts & Styling',
    durationMinutes: 30,
    price: 300,
    description: 'Clean, smart school and casual cuts for students and juniors (under 16). Patient styling and neat edging.',
    includes: ['Clean Scissor/Clipper Cut', 'Gentle Razor Outline', 'Natural Sheen Spray']
  },

  // Beard Craft & Hot Towel Shaves
  {
    id: 'srv-5',
    name: 'Beard Sculpting, Razor Edge & Nourishing Oil',
    category: 'beards',
    categoryTitle: 'Beard Craft & Hot Towel Shaves',
    durationMinutes: 30,
    price: 350,
    popular: true,
    description: 'Geometric beard reshaping, bulk graduation, straight razor cheek and neck line-up, and organic beard growth oil application.',
    includes: ['Beard Symmetry Assessment', 'Razor Blade Contouring', 'Hot Foam Neck Clean', 'Argan Beard Oil Massage']
  },
  {
    id: 'srv-6',
    name: 'Royal Hot Towel Herbal Shave',
    category: 'beards',
    categoryTitle: 'Beard Craft & Hot Towel Shaves',
    durationMinutes: 40,
    price: 500,
    description: 'Steamed herbal towels with eucalyptus, rich lathering, smooth straight razor glide, and witch hazel closing compress.',
    includes: ['Herbal Steamed Towels', 'Warm Foam Lathering', 'Precision Razor Shave', 'Aftershave Balm Rub']
  },
  {
    id: 'srv-7',
    name: 'Beard Dye, Black Tint & Sharpening',
    category: 'beards',
    categoryTitle: 'Beard Craft & Hot Towel Shaves',
    durationMinutes: 35,
    price: 400,
    description: 'Natural black organic tint to cover grey hairs and add fuller depth to your beard, followed by crisp razor outlining.',
    includes: ['Skin-Safe Dye Application', 'Beard Density Coloring', 'Clean Water Rinse', 'Beard Butter Polish']
  },

  // Facial Treatments & Skin Therapy
  {
    id: 'srv-8',
    name: 'Deep Cleanse Facial Scrub & Facial Steam',
    category: 'facials',
    categoryTitle: 'Facial Treatments & Skin Therapy',
    durationMinutes: 45,
    price: 600,
    popular: true,
    description: 'Ozone facial steaming opens pores, followed by apricot exfoliating scrub to clear dead skin and soothe post-shave sensitivity.',
    includes: ['Ozone Warm Steam', 'Exfoliating Apricot Scrub', 'Hot Towel Extraction', 'Hyaluronic Hydration']
  },
  {
    id: 'srv-9',
    name: 'Activated Charcoal Black Mask & Detox',
    category: 'facials',
    categoryTitle: 'Facial Treatments & Skin Therapy',
    durationMinutes: 45,
    price: 700,
    description: 'Removes deep blackheads, controls excess facial oils, and tightens pores for a crisp, radiant executive look.',
    includes: ['Steam Prep', 'Charcoal Peel Mask', 'Pore Tightening Toner', 'Sunscreen Moisturizer']
  },
  {
    id: 'srv-10',
    name: 'Full Glow Rejuvenation Facial Therapy',
    category: 'facials',
    categoryTitle: 'Facial Treatments & Skin Therapy',
    durationMinutes: 60,
    price: 1000,
    description: 'Ultimate skin transformation: Ultrasonic scrub, facial steam, detox mask, cold ice-roller massage, and anti-fatigue eye cream.',
    includes: ['Ultrasonic Skin Cleansing', 'Herbal Facial Steam', 'Collagen Mask Therapy', 'Cold Roller Lymphatic Massage']
  },

  // Executive Grooming Packages
  {
    id: 'srv-11',
    name: 'The Full Home Boyz VIP Package (All-Inclusive)',
    category: 'packages',
    categoryTitle: 'Executive Grooming Packages',
    durationMinutes: 90,
    price: 1500,
    popular: true,
    description: 'Executive Haircut + Sharp Beard Sculpting + Steamed Facial Scrub + Black Mask + Head & Neck Massage + Complimentary Beverage.',
    includes: ['Signature Haircut of Choice', 'Full Beard Trim & Razor Line', 'Facial Steam & Black Mask', 'Head & Shoulder Pressure Massage', 'Complimentary Cold Soda or Coffee']
  },
  {
    id: 'srv-12',
    name: 'Gentleman’s Quick Refresh Package',
    category: 'packages',
    categoryTitle: 'Executive Grooming Packages',
    durationMinutes: 55,
    price: 800,
    description: 'Fresh Fade or Scissor Cut + Full Beard Razor Outlining + Mint Hot Towel Refresh for a quick meeting or event.',
    includes: ['Skin Fade or Shear Cut', 'Beard Trim & Clean Edges', 'Mint Steamed Towel', 'Bespoke Aftershave Cologne']
  }
];

// The Crew: Clean, focused, only the crew without unnecessary bloated details
export const INITIAL_BARBERS: Barber[] = [
  {
    id: 'barber-1',
    name: 'Banner Mwangi',
    role: 'Lead Master Barber & Founder',
    experienceYears: 10,
    specialty: 'Executive Precision Cuts, 360 Waves & Skin Fades',
    image: BARBER_MASTER_IMAGE,
    rating: 4.99,
    reviewCount: 380,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    bio: 'Renowned barber artisan serving Mwingi with modern European scissor work and surgical African fade techniques.'
  },
  {
    id: 'barber-2',
    name: 'Kelvin Mutua',
    role: 'Senior Fade Artisan & Lineup Specialist',
    experienceYears: 7,
    specialty: 'Drop Fades, Low Tapers & Surgical Edge-Ups',
    image: BARBER_FADE_IMAGE,
    rating: 4.96,
    reviewCount: 295,
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    bio: 'Millimeter fade accuracy with seamless transitions on all hair types.'
  },
  {
    id: 'barber-3',
    name: 'Brian Musyoka',
    role: 'Master Shaver & Beard Architect',
    experienceYears: 8,
    specialty: 'Straight Razor Shaves, Beard Dye & Steam Therapy',
    image: BEARD_GROOMING_IMAGE,
    rating: 4.97,
    reviewCount: 310,
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    bio: 'Specialist in hot towel straight razor ceremonies and beard contouring.'
  },
  {
    id: 'barber-4',
    name: 'Dennis Kimanzi',
    role: 'Facial Aesthetics & Skin Specialist',
    experienceYears: 6,
    specialty: 'Charcoal Masks, Blackhead Extraction & Ozone Steam',
    image: WAVES_FADE_IMAGE,
    rating: 4.94,
    reviewCount: 220,
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
    bio: 'Certified men’s grooming aesthetician for healthy, glowing skin.'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Clean Low Taper Fade & 360 Deep Waves',
    category: 'fades',
    categoryLabel: 'Precision Fades',
    barberName: 'Banner Mwangi',
    image: WAVES_FADE_IMAGE,
    description: 'Surgical hairline edge-up with deep crown waves and smooth taper down the sideburns.',
    productUsed: 'Home Boyz Wave Pomade'
  },
  {
    id: 'gal-2',
    title: 'Hot Towel Beard Detailing & Razor Lineup',
    category: 'beard',
    categoryLabel: 'Beard Sculpting',
    barberName: 'Brian Musyoka',
    image: BEARD_GROOMING_IMAGE,
    description: 'Steamed herbal towel application and mirror-straight razor cheek contouring.',
    productUsed: 'Mwingi Sandalwood Beard Oil'
  },
  {
    id: 'gal-3',
    title: 'High-Fashion African Executive Fade',
    category: 'fades',
    categoryLabel: 'Precision Fades',
    barberName: 'Kelvin Mutua',
    image: HERO_IMAGE,
    description: 'High skin fade connected to sculpted beard with sharp razor cheek lines.',
    productUsed: 'Matte Styling Clay'
  },
  {
    id: 'gal-4',
    title: 'Master Craftsman Station at Mwingi Lounge',
    category: 'facials',
    categoryLabel: 'Crew at Work',
    barberName: 'The Crew',
    image: BARBER_MASTER_IMAGE,
    description: 'Professional barber tools, sterilized blades, and welcoming atmosphere.',
    productUsed: 'Sterilized Feather Blades'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Home Boyz Matte Wave & Styling Clay',
    category: 'hair',
    categoryLabel: 'Hair & Waves',
    price: 1200,
    size: '100g / 3.5 oz',
    image: PRODUCT_IMAGE,
    description: 'Strong pliable hold with zero greasy shine. Locks in deep 360 waves, textured crops, and clean side parts throughout the day.',
    rating: 4.9,
    reviewsCount: 142,
    stock: 35,
    ingredients: 'Beeswax, Kaolin Clay, Shea Butter, Coconut Oil, Cedar Extract'
  },
  {
    id: 'prod-2',
    name: 'Organic Beard Growth Oil & Sandalwood Elixir',
    category: 'beard',
    categoryLabel: 'Beard Care',
    price: 1400,
    size: '50ml',
    image: BEARD_GROOMING_IMAGE,
    description: 'Cold-pressed Kenyan castor, jojoba, and sweet almond oils. Softens coarse facial hair, prevents itch, and stimulates even beard growth.',
    rating: 4.95,
    reviewsCount: 168,
    stock: 28,
    ingredients: 'Pure Castor Oil, Golden Jojoba, Argan, Vitamin E, Sandalwood Essential Oil'
  },
  {
    id: 'prod-3',
    name: 'Sea Salt Texturizing & Wave Setting Mist',
    category: 'hair',
    categoryLabel: 'Hair Styling',
    price: 950,
    size: '200ml',
    image: WAVES_FADE_IMAGE,
    description: 'Gives natural volume, grit, and crisp texture without stiffness. Perfect pre-styler before wave brushing.',
    rating: 4.86,
    reviewsCount: 88,
    stock: 40,
    ingredients: 'Natural Sea Salt, Witch Hazel, Aloe Vera, Magnesium'
  },
  {
    id: 'prod-4',
    name: 'Activated Charcoal & Volcanic Face Scrub',
    category: 'skincare',
    categoryLabel: 'Skin Therapy',
    price: 1100,
    size: '150ml',
    image: HERO_IMAGE,
    description: 'Clears clogged pores, removes dead skin, and prevents ingrown hairs and razor bumps after shaving.',
    rating: 4.92,
    reviewsCount: 95,
    stock: 22,
    ingredients: 'Activated Charcoal, Finely Milled Apricot Kernels, Tea Tree Oil'
  },
  {
    id: 'prod-5',
    name: 'Damascus Steel Folding Straight Razor',
    category: 'hardware',
    categoryLabel: 'Hardware',
    price: 3200,
    size: 'Standard 85g',
    image: BARBER_MASTER_IMAGE,
    description: 'Weighted professional folding razor with ebony handle. Uses standard double-edge safety blades for surgical edging.',
    rating: 5.0,
    reviewsCount: 54,
    stock: 14,
    ingredients: 'Damascus Patterned Steel, Hardwood Handle, Brass Screws'
  },
  {
    id: 'prod-6',
    name: 'Cooling Menthol & Aloe Aftershave Splash',
    category: 'hair',
    categoryLabel: 'Aftershave',
    price: 850,
    size: '250ml',
    image: PRODUCT_IMAGE,
    description: 'Instant cooling relief after clipper work and straight razor fades. Disinfects and leaves a pleasant masculine fragrance.',
    rating: 4.88,
    reviewsCount: 114,
    stock: 30,
    ingredients: 'Menthol, Aloe Vera Gel, Witch Hazel, Eucalyptus'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Justus Mutemi',
    rating: 5,
    date: 'Yesterday',
    serviceName: 'The Full Home Boyz VIP Package',
    barberName: 'Banner Mwangi',
    comment: 'Best barbershop in Mwingi town by far! Banner has magical hands with the clippers. The hot towel and facial steam made me feel like a VIP. Automated SMS alert was sent right on time.',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Samson Kilonzo',
    rating: 5,
    date: '3 days ago',
    serviceName: 'Home Boyz Skin Fade & Waves',
    barberName: 'Kelvin Mutua',
    comment: 'Kelvin gave me the sharpest low drop fade and edge-up. My waves look crisp. Love the modern dark vibe of the shop and the WhatsApp booking.',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Erick Mwende',
    rating: 5,
    date: '1 week ago',
    serviceName: 'Beard Sculpting & Razor Edge',
    barberName: 'Brian Musyoka',
    comment: 'Brian sculpted my beard to perfection. Zero razor bumps and the beard oil smells amazing. Fair Kenyan prices for top executive service.',
    verified: true
  },
  {
    id: 'rev-4',
    author: 'David Musyoki',
    rating: 5,
    date: '2 weeks ago',
    serviceName: 'Activated Charcoal Black Mask',
    barberName: 'Dennis Kimanzi',
    comment: 'Had lots of blackheads and tired skin from Mwingi dust. Dennis cleared everything with steam and the charcoal mask. Will definitely be coming back every fortnight.',
    verified: true
  }
];

export const SAMPLE_LOYALTY_PROFILES: Record<string, LoyaltyProfile> = {
  '0746145712': {
    phone: '0746145712',
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
      { id: 'perk-4', title: 'VIP Priority Chair & Cold Beverage Pour', pointsCost: 1000, unlocked: true }
    ]
  }
};
