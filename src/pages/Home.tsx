import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, UtensilsCrossed, Clock, ShieldCheck, Wallet, Star, MapPin, ArrowRight, Flame, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { MenuItem, Review, MenuCategory } from '@/types';
import ProductCard, { getCategoryImage } from '@/components/ProductCard';
import StarRating from '@/components/StarRating';

const heroImage = 'https://images.pexels.com/photos/37417637/pexels-photo-37417637.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const galleryImages = [
  'https://images.pexels.com/photos/6493572/pexels-photo-6493572.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/5474676/pexels-photo-5474676.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/6488931/pexels-photo-6488931.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/14537694/pexels-photo-14537694.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/27582703/pexels-photo-27582703.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/13062440/pexels-photo-13062440.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

const deals = [
  { title: 'Deal 1: Large Pizza + Drink', desc: '1 Large pizza of your choice with 1 liter drink', price: 1500, badge: 'Save 15%' },
  { title: 'Deal 3: Family Feast', desc: '1 large pizza, 8pc chicken, fries, 2 drinks', price: 3200, badge: 'Best Value' },
  { title: 'Deal 2: 2 Medium Pizzas + Garlic Bread', desc: '2 medium pizzas with cheesy garlic bread', price: 2500, badge: 'Popular' },
];

const whyChooseUs = [
  { icon: UtensilsCrossed, title: 'Fresh Ingredients', desc: 'We use only the freshest vegetables, premium meats, and real cheese in every dish.' },
  { icon: Clock, title: 'Fast Delivery', desc: 'Hot food delivered to your door in 30 minutes or less within Bhara Kahu area.' },
  { icon: ShieldCheck, title: 'Hygienic Kitchen', desc: 'Our kitchen maintains the highest cleanliness standards with daily inspections.' },
  { icon: Wallet, title: 'Affordable Prices', desc: 'Premium quality food at prices that fit your budget, plus regular deals and offers.' },
];

export default function Home() {
  const [bestsellers, setBestsellers] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: items }, { data: revs }, { data: cats }] = await Promise.all([
        supabase.from('menu_items').select('*, category:menu_categories(*)').eq('is_bestseller', true).eq('status', 'active').order('sort_order').limit(8),
        supabase.from('reviews').select('*').eq('approved', true).order('created_at', { ascending: false }).limit(6),
        supabase.from('menu_categories').select('*').order('sort_order'),
      ]);
      setBestsellers(items || []);
      setReviews(revs || []);
      setCategories(cats || []);
    })();
  }, []);

  return (
    <div className="bg-[#1a1714]">
      {/* Hero */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Pizza" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1714] via-[#1a1714]/85 to-[#1a1714]/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-[fadeIn_0.6s_ease-in]">
              <Flame size={16} />
              <span>#1 Pizza in Bhara Kahu</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-amber-50 leading-tight mb-4 animate-[fadeIn_0.7s_ease-in]">
              Taste the Best <span className="text-amber-400">Pizza</span> in Town
            </h1>
            <p className="text-lg text-amber-50/70 leading-relaxed mb-8 max-w-xl animate-[fadeIn_0.8s_ease-in]">
              Hand-tossed dough, premium toppings, and our secret sauce. Order online for fast delivery or dine in at our Bhara Kahu branch.
            </p>
            <div className="flex flex-wrap gap-4 animate-[fadeIn_0.9s_ease-in]">
              <Link
                to="/menu"
                className="bg-amber-500 hover:bg-amber-400 text-[#1a1714] px-8 py-3.5 rounded-full font-semibold text-base transition-all hover:scale-105 flex items-center gap-2"
              >
                <ShoppingBag size={20} />
                Order Now
              </Link>
              <Link
                to="/menu"
                className="border-2 border-amber-50/30 hover:border-amber-400 hover:text-amber-400 text-amber-50 px-8 py-3.5 rounded-full font-semibold text-base transition-all flex items-center gap-2"
              >
                View Menu
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Deals Strip */}
      <section className="py-16 bg-[#221d18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-amber-400 mb-2">
              <Tag size={18} />
              <span className="text-sm font-semibold uppercase tracking-wider">Limited Time Offers</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-amber-50">Special Deals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deals.map((deal, i) => (
              <div
                key={i}
                className="relative bg-[#2a2520] rounded-2xl p-6 border border-amber-900/20 hover:border-amber-500/40 transition-all hover:-translate-y-1 group"
              >
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {deal.badge}
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center mb-4">
                  <Flame className="text-amber-400" size={24} />
                </div>
                <h3 className="text-amber-50 font-bold text-lg mb-2 pr-20">{deal.title}</h3>
                <p className="text-amber-50/50 text-sm mb-4">{deal.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-amber-400">Rs {deal.price.toLocaleString()}</span>
                  <Link
                    to="/menu"
                    className="bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-[#1a1714] px-4 py-2 rounded-full text-sm font-semibold transition-all"
                  >
                    Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Chips */}
      <section className="py-12 bg-[#1a1714]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/menu?category=${cat.slug}`}
                className="px-5 py-2.5 rounded-full bg-[#2a2520] border border-amber-900/20 hover:border-amber-500/40 hover:bg-amber-500/10 text-amber-50/70 hover:text-amber-400 text-sm font-medium transition-all"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-[#221d18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-400 mb-2">
                <Star size={18} className="fill-amber-400" />
                <span className="text-sm font-semibold uppercase tracking-wider">Most Loved</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-amber-50">Best Sellers</h2>
            </div>
            <Link to="/menu" className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center gap-1 transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {bestsellers.map(item => (
              <ProductCard key={item.id} item={item} categorySlug={item.category?.slug} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-[#1a1714]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-amber-50 mb-2">Why Choose Us</h2>
            <p className="text-amber-50/50 max-w-xl mx-auto">We are committed to delivering the best food experience in Bhara Kahu.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <div
                key={i}
                className="bg-[#2a2520] rounded-2xl p-6 border border-amber-900/20 hover:border-amber-500/40 transition-all hover:-translate-y-1 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-amber-500/15 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-amber-400" size={26} />
                </div>
                <h3 className="text-amber-50 font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-amber-50/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-[#221d18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-amber-400 mb-2">
              <Star size={18} className="fill-amber-400" />
              <span className="text-sm font-semibold uppercase tracking-wider">Customer Reviews</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-amber-50">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(review => (
              <div key={review.id} className="bg-[#2a2520] rounded-2xl p-6 border border-amber-900/20">
                <StarRating rating={review.rating} size={18} />
                <p className="text-amber-50/70 text-sm mt-3 mb-4 leading-relaxed">"{review.review_text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                    {review.customer_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-amber-50 font-medium text-sm">{review.customer_name}</p>
                    <p className="text-amber-50/40 text-xs">Verified Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Food Gallery */}
      <section className="py-16 bg-[#1a1714]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-amber-50">Food Gallery</h2>
            <p className="text-amber-50/50 mt-2">A feast for your eyes</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightbox(img)}
                className={`relative overflow-hidden rounded-xl group ${
                  i === 0 || i === 5 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
                }`}
              >
                <img src={img} alt={`Food ${i + 1}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Branch Location */}
      <section className="py-16 bg-[#221d18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-400 mb-2">
                <MapPin size={18} />
                <span className="text-sm font-semibold uppercase tracking-wider">Visit Us</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-amber-50 mb-4">Bhara Kahu Branch</h2>
              <p className="text-amber-50/60 mb-6 leading-relaxed">
                Visit our restaurant for a dine-in experience or order online for fast delivery. We are open daily from 11:00 AM to 3:00 AM.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-amber-50/70">
                  <MapPin size={18} className="text-amber-400" />
                  <span>Bhara Kahu, Islamabad, Pakistan</span>
                </div>
                <div className="flex items-center gap-3 text-amber-50/70">
                  <Clock size={18} className="text-amber-400" />
                  <span>Daily 11:00 AM – 03:00 AM</span>
                </div>
              </div>
              <a
                href="tel:03309999005"
                className="mt-6 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#1a1714] px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
              >
                <ShoppingBag size={18} />
                Call: 0330-9999005
              </a>
            </div>
            <div className="rounded-2xl overflow-hidden border border-amber-900/20">
              <iframe
                title="Bhara Kahu Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.5!2d73.3!3d33.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDQyJzAwLjAiTiA3M8KwMTgnJzAwLjAiRQ!5e0!3m2!1sen!2s!4v1700000000000"
                width="100%"
                height="350"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-in]"
        >
          <img src={lightbox} alt="Gallery" className="max-w-full max-h-full rounded-xl" />
          <button className="absolute top-6 right-6 text-amber-50 text-2xl" onClick={() => setLightbox(null)}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
