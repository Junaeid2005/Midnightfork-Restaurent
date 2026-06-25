import { MenuItem } from '../types';

export const initialMenuItems: MenuItem[] = [
  // Appetizers
  {
    id: 'app1',
    name: 'Crispy Truffle Calamari',
    description: 'Tender calamari tossed with fresh herbs, garlic, and truffle oil, served with a citrus garlic aioli.',
    price: 18.00,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'app2',
    name: 'Midnight Glazed Wings',
    description: 'Crispy chicken wings glazed with a sweet, smoky and spicy dark plum barbecue sauce.',
    price: 15.00,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isBestSeller: true
  },
  {
    id: 'app3',
    name: 'Whipped Burrata Crostini',
    description: 'Creamy whipped burrata on artisanal grilled bread, topped with heirloom cherry tomatoes, basil pesto, and dark balsamic glaze.',
    price: 16.00,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isRecommended: true
  },
  {
    id: 'app4',
    name: 'Roasted Garlic Hummus Board',
    description: 'Smoked garlic hummus topped with toasted pine nuts, premium olive oil, served with warm house-made flatbread.',
    price: 14.00,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1577906096429-f73bc2c31243?auto=format&fit=crop&w=500&q=80',
    isAvailable: true
  },
  {
    id: 'app5',
    name: 'Spicy Tuna Tartare Crisps',
    description: 'Truffle-infused premium Ahi tuna tartare layered over crispy house wonton chips with fresh avocado smash and sriracha aioli.',
    price: 19.00,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'app6',
    name: 'Golden Caviar Deviled Eggs',
    description: 'Gourmet organic deviled eggs filled with whipped truffle-cream yolks, crowned with pristine Sturgeon caviar and micro-greens.',
    price: 21.00,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isRecommended: true
  },

  // Burgers
  {
    id: 'burg1',
    name: 'The Midnight Fork Wagyu',
    description: 'Dry-aged Wagyu beef patty, molten white cheddar, caramelized balsamic onions, and black truffle mayo on a toasted brioche bun.',
    price: 22.00,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    id: 'burg2',
    name: 'Smoky Purple BBQ Burger',
    description: 'Angus beef patty, smoked gouda, crispy onion straws, red cabbage slaw, and our signature dark purple barbecue sauce.',
    price: 19.00,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isRecommended: true
  },
  {
    id: 'burg3',
    name: 'Truffle Mushroom Swiss',
    description: 'Gourmet beef patty topped with sautéed wild forest mushrooms, melted Swiss cheese, and luxurious black truffle aioli.',
    price: 20.00,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=80',
    isAvailable: true
  },
  {
    id: 'burg4',
    name: 'Royal Foie Gras Burger',
    description: 'Aged Wagyu beef patty, seared artisanal foie gras, black currant onion reduction, and truffle glaze on a gold-flecked brioche bun.',
    price: 36.00,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1582196016295-f844bd4f3ad9?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'burg5',
    name: 'Smoked Portobello Pecan Burger',
    description: 'Grilled balsamic-marinated portobello cap, rich pecan-herb cheese spread, crispy baby arugula, and roasted garlic aioli.',
    price: 18.00,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isRecommended: true
  },

  // Pizza
  {
    id: 'piz1',
    name: 'Black Garlic & Fig Artisanal',
    description: 'Savoury gorgonzola, fresh figs, caramelized balsamic onions, finished with a drizzle of black garlic oil and baby arugula.',
    price: 24.00,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'piz2',
    name: 'Classic Margherita Elegante',
    description: 'San Marzano tomato base, fresh buffalo mozzarella, fragrant fresh basil, and a splash of extra virgin olive oil.',
    price: 18.00,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=500&q=80',
    isAvailable: true
  },
  {
    id: 'piz3',
    name: 'Spicy Salami & Hot Honey',
    description: 'Spicy Calabrian salami, fresh mozzarella, tomato sauce, finished with a heavy drizzle of house-infused hot honey.',
    price: 22.00,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isBestSeller: true
  },
  {
    id: 'piz4',
    name: 'White Truffle Carbonara Pizza',
    description: 'Creamy carbonara base, pecorino romano, smoked pancetta, soft-cooked organic egg yolk, topped with fresh white truffle shavings.',
    price: 28.00,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isRecommended: true
  },
  {
    id: 'piz5',
    name: 'Crimson Beet & Goat Cheese Flatbread',
    description: 'Vibrant roasted purple beet puree, creamy goat cheese, caramelized onions, toasted pumpkin seeds, and fresh thyme on crispy flatbread.',
    price: 19.00,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80',
    isAvailable: true
  },

  // Main Course
  {
    id: 'main1',
    name: 'Pan-Seared USDA Ribeye',
    description: 'USDA Prime ribeye seared with rosemary garlic butter, served alongside purple potato purée and grilled seasonal asparagus.',
    price: 42.00,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isFeatured: true,
    isBestSeller: true
  },
  {
    id: 'main2',
    name: 'Salmon Al Limone',
    description: 'Crispy-skin Atlantic salmon filet over a bed of lemon-infused saffron risotto, sautéed baby spinach, and dill beurre blanc.',
    price: 34.00,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isRecommended: true
  },
  {
    id: 'main3',
    name: 'Velvet Gorgonzola Gnocchi',
    description: 'Hand-rolled potato gnocchi tossed in a vibrant, creamy purple cabbage and gorgonzola sauce, topped with crushed walnuts.',
    price: 28.00,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=500&q=80',
    isAvailable: true
  },
  {
    id: 'main4',
    name: 'Roasted Lavender-Glazed Duck',
    description: 'Succulent roasted duck breast drizzled with lavender and blackberry gastrique, served with parsnip purée and wild berries.',
    price: 38.00,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&w=500&q=80',
    isAvailable: true
  },
  {
    id: 'main5',
    name: 'Midnight Squid Ink Fettuccine',
    description: 'Homemade squid ink fettuccine tossed with pan-seared sea scallops, jumbo tiger prawns, in a silky saffron cream sauce with edible gold leaf.',
    price: 39.00,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'main6',
    name: 'Slow-Braised Angus Short Rib',
    description: '72-hour slow-cooked premium beef short rib over a rich parsnip-celery root cream mash, served with glazed organic micro-carrots.',
    price: 45.00,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isRecommended: true
  },

  // Drinks
  {
    id: 'drk1',
    name: 'Midnight Orchid Elixir',
    description: 'A magical blend of lavender syrup, fresh lemonade, butterfly pea flower tea, and sparkling water. Watch it turn purple!',
    price: 10.00,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isBestSeller: true
  },
  {
    id: 'drk2',
    name: 'Smoked Vanilla Espresso Martini',
    description: 'Freshly pulled espresso shot, premium coffee liqueur, and house-made smoked vanilla bean syrup, shaken to a silky froth.',
    price: 14.00,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1545438102-799c3991ffb2?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isRecommended: true
  },
  {
    id: 'drk3',
    name: 'Charcoal Activated Lemonade',
    description: 'Organic lemonade infused with food-grade activated charcoal, fresh mint, and agave nectar for an intriguing dark look.',
    price: 8.00,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80',
    isAvailable: true
  },
  {
    id: 'drk4',
    name: 'Violet Lavender Smoke Tonic',
    description: 'Smoked butterfly pea gin, premium floral lavender syrup, botanical bitters, and sparkling tonic, served in a cherrywood smoke dome.',
    price: 16.00,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'drk5',
    name: 'Golden Saffron Mango Lassi',
    description: 'A luxurious blend of Alphonso mango nectar, Greek yogurt, cardamom essence, and milk-infused Kashmiri saffron thread, topped with 24k gold leaf.',
    price: 11.00,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isRecommended: true
  },

  // Desserts
  {
    id: 'des1',
    name: 'Dark Chocolate Lava Cake',
    description: 'Decadent dark chocolate sponge cake with a molten truffle center, accompanied by vanilla bean ice cream and wild berries.',
    price: 12.00,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isBestSeller: true,
    isFeatured: true
  },
  {
    id: 'des2',
    name: 'Purple Velvet Cheesecake',
    description: 'Creamy New York-style cheesecake layered with rich purple ube yam purée, set on a toasted butter cracker crust.',
    price: 11.00,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1524351199679-46cddf530c04?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isRecommended: true
  },
  {
    id: 'des3',
    name: 'Saffron Panna Cotta',
    description: 'Silky, delicate vanilla panna cotta subtly infused with saffron thread, topped with roasted pistachio crumble and gold leaf.',
    price: 12.00,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80',
    isAvailable: true
  },
  {
    id: 'des4',
    name: 'Golden Leaf Crème Brûlée',
    description: 'Rich Madagascar vanilla bean custard with a perfectly caramelized, glass-like sugar shell, crowned with 24k gold leaf and fresh raspberries.',
    price: 14.00,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'des5',
    name: 'Blackberry Ube Mousse Dome',
    description: 'Vibrant purple ube sponge cake topped with fluffy blackberry mousse and encased in a deep violet glossy mirror glaze.',
    price: 13.00,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80',
    isAvailable: true,
    isRecommended: true
  }
];

export const sampleReviews = [
  {
    id: 'rev1',
    author: 'Elena Rostova',
    rating: 5,
    comment: 'The Midnight Fork Burger was quite literally the best burger I have ever tasted in my entire life. The wagyu beef melts in your mouth and the black truffle mayo is incredible. Atmosphere is gorgeous!',
    date: '2026-06-12'
  },
  {
    id: 'rev2',
    author: 'Julian Thorne',
    rating: 5,
    comment: 'Exceptional service and exquisite cocktails. The Midnight Orchid Elixir was a visual marvel and tasted fantastic. Will absolutely be booking again for our anniversary.',
    date: '2026-06-20'
  },
  {
    id: 'rev3',
    author: 'Sarah Jenkins',
    rating: 4,
    comment: 'The pan-seared USDA Ribeye was cooked to a perfect medium-rare. The purple potato purée was beautiful and delicious. Highly recommend this premium luxury experience.',
    date: '2026-06-24'
  }
];

export const sampleTestimonials = [
  {
    id: 'test1',
    author: 'Chef Liam Vance',
    role: 'Gastronomy Critic',
    rating: 5,
    comment: 'Midnight Fork redefines modern premium dining. The fusion of elegant aesthetics with masterclass culinary execution makes it a pinnacle of gastronomic luxury.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'test2',
    author: 'Sophia Martinez',
    role: 'Food & Lifestyle Influencer',
    rating: 5,
    comment: 'Absolutely obsessed with the Dark Purple theme! The aesthetic is flawless and the food matches the level of visual artistry. The Ube Cheesecake is a must-have!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'test3',
    author: 'Marcus Vance',
    role: 'Connoisseur member',
    rating: 5,
    comment: 'Their online reservation is so slick, and the Personal bKash payment process with reference tracking was extremely seamless. Verified within 10 minutes by the admin!',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
  }
];

export const sampleGalleryImages = [
  {
    id: 'gal1',
    url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    caption: 'The main luxury dining hall at Midnight Fork'
  },
  {
    id: 'gal2',
    url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
    caption: 'Our culinary artists craft with absolute precision'
  },
  {
    id: 'gal3',
    url: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80',
    caption: 'The VIP Private Lounge featuring deep purple lighting'
  },
  {
    id: 'gal4',
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    caption: 'Award-winning dessert platters paired with vintage grape'
  }
];
