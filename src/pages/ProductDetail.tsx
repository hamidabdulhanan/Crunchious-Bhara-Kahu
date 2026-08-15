import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ShoppingBag, Star, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { MenuItem, Topping, Review } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPKR } from '@/lib/format';
import { getCategoryImage } from '@/components/ProductCard';
import StarRating from '@/components/StarRating';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const [{ data: menuItem }, { data: tops }, { data: revs }] = await Promise.all([
        supabase.from('menu_items').select('*, category:menu_categories(*)').eq('id', id).maybeSingle(),
        supabase.from('toppings').select('*').order('price'),
        supabase.from('reviews').select('*').eq('approved', true).order('created_at', { ascending: false }).limit(5),
      ]);
      setItem(menuItem);
      setToppings(tops || []);
      setReviews(revs || []);
      if (menuItem?.sizes?.length) {
        setSelectedSize(menuItem.sizes[0].label);
      }
      setLoading(false);
    })();
  }, [id]);

  const unitPrice = (() => {
    if (!item) return 0;
    if (selectedSize && item.sizes.length > 0) {
      const size = item.sizes.find(s => s.label === selectedSize);
      if (size) return size.price;
    }
    return item.price;
  })();

  const toppingsTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const total = (unitPrice + toppingsTotal) * quantity;

  const toggleTopping = (topping: Topping) => {
    setSelectedToppings(prev =>
      prev.find(t => t.id === topping.id)
        ? prev.filter(t => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  const handleAddToCart = () => {
    if (!item) return;
    const img = getCategoryImage(item.category?.slug || '', item.image);
    addItem({
      menu_item_id: item.id,
      name: item.name,
      price: unitPrice + toppingsTotal,
      quantity,
      size: selectedSize,
      toppings: selectedToppings,
      image: img,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-[#1a1714] min-h-screen pt-20 lg:pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="bg-[#1a1714] min-h-screen pt-20 lg:pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-amber-50/60 text-lg mb-4">Product not found</p>
          <Link to="/menu" className="text-amber-400 hover:text-amber-300">Back to Menu</Link>
        </div>
      </div>
    );
  }

  const img = getCategoryImage(item.category?.slug || '', item.image);

  return (
    <div className="bg-[#1a1714] min-h-screen pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-amber-50/60 hover:text-amber-400 mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden border border-amber-900/20">
              <img src={img} alt={item.name} className="w-full h-full object-cover" />
            </div>
            {item.is_bestseller && (
              <div className="absolute top-4 left-4 bg-amber-500 text-[#1a1714] text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5">
                <Star size={14} className="fill-[#1a1714]" />
                Bestseller
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">{item.category?.name}</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-amber-50 mt-1 mb-3">{item.name}</h1>
            <p className="text-amber-50/60 leading-relaxed mb-6">{item.description}</p>

            {item.ingredients && (
              <div className="mb-6">
                <h3 className="text-amber-50 font-semibold mb-2 text-sm">Ingredients</h3>
                <p className="text-amber-50/50 text-sm">{item.ingredients}</p>
              </div>
            )}

            {/* Sizes */}
            {item.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-amber-50 font-semibold mb-3 text-sm">Size</h3>
                <div className="flex flex-wrap gap-3">
                  {item.sizes.map(size => (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSize(size.label)}
                      className={`px-5 py-2.5 rounded-xl border-2 transition-all ${
                        selectedSize === size.label
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                          : 'border-amber-900/20 text-amber-50/60 hover:border-amber-500/40'
                      }`}
                    >
                      <span className="font-medium text-sm">{size.label}</span>
                      <span className="block text-xs mt-0.5">{formatPKR(size.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Toppings */}
            {toppings.length > 0 && (
              <div className="mb-6">
                <h3 className="text-amber-50 font-semibold mb-3 text-sm">Add Toppings</h3>
                <div className="grid grid-cols-2 gap-2">
                  {toppings.map(top => {
                    const selected = selectedToppings.find(t => t.id === top.id);
                    return (
                      <button
                        key={top.id}
                        onClick={() => toggleTopping(top)}
                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all text-sm ${
                          selected
                            ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                            : 'border-amber-900/20 text-amber-50/60 hover:border-amber-500/40'
                        }`}
                      >
                        <span>{top.name}</span>
                        <span className="flex items-center gap-1.5">
                          <span className="text-xs">+{formatPKR(top.price)}</span>
                          {selected && <Check size={14} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & Add */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 bg-[#2a2520] rounded-full border border-amber-900/20">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-amber-50/60 hover:text-amber-400 transition-colors"
                >
                  <Minus size={18} />
                </button>
                <span className="w-10 text-center text-amber-50 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-amber-50/60 hover:text-amber-400 transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-[#1a1714] hover:scale-105'
                }`}
              >
                {added ? (
                  <>
                    <Check size={20} /> Added!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} /> Add to Cart · {formatPKR(total)}
                  </>
                )}
              </button>
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="border-t border-amber-900/20 pt-6">
                <h3 className="text-amber-50 font-semibold mb-4 text-lg">Customer Reviews</h3>
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="bg-[#2a2520] rounded-xl p-4 border border-amber-900/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-amber-50 font-medium text-sm">{review.customer_name}</span>
                        <StarRating rating={review.rating} size={14} />
                      </div>
                      <p className="text-amber-50/50 text-sm">{review.review_text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
