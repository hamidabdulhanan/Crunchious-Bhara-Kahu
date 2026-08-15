import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPKR } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import type { Coupon } from '@/types';

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [discount, setDiscount] = useState(0);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('active', true)
      .maybeSingle();

    if (error || !data) {
      setCouponError('Invalid coupon code.');
      setAppliedCoupon(null);
      setDiscount(0);
      return;
    }

    if (data.minimum_order && subtotal < data.minimum_order) {
      setCouponError(`Minimum order of ${formatPKR(data.minimum_order)} required for this coupon.`);
      setAppliedCoupon(null);
      setDiscount(0);
      return;
    }

    if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
      setCouponError('This coupon has expired.');
      setAppliedCoupon(null);
      setDiscount(0);
      return;
    }

    setAppliedCoupon(data);
    if (data.discount_type === 'percentage') {
      setDiscount((subtotal * data.discount_value) / 100);
    } else {
      setDiscount(data.discount_value);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
    setCouponError('');
  };

  const total = subtotal - discount;

  if (items.length === 0) {
    return (
      <div className="bg-[#1a1714] min-h-screen pt-20 lg:pt-24 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={36} className="text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-amber-50 mb-2">Your cart is empty</h1>
          <p className="text-amber-50/50 mb-6">Add some delicious items from our menu.</p>
          <Link to="/menu" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#1a1714] px-6 py-3 rounded-full font-semibold transition-all hover:scale-105">
            Browse Menu <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1714] min-h-screen pt-20 lg:pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-amber-50 mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => (
              <div key={item.id} className="bg-[#2a2520] rounded-2xl p-4 border border-amber-900/20 flex gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-amber-900/10">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="text-amber-50 font-semibold text-sm">{item.name}</h3>
                      {item.size && <p className="text-amber-50/40 text-xs mt-0.5">Size: {item.size}</p>}
                      {item.toppings.length > 0 && (
                        <p className="text-amber-50/40 text-xs mt-0.5">
                          Toppings: {item.toppings.map(t => t.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-amber-50/40 hover:text-red-400 transition-colors shrink-0">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 bg-[#1a1714] rounded-full">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-amber-50/60 hover:text-amber-400 transition-colors">
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center text-amber-50 text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-amber-50/60 hover:text-amber-400 transition-colors">
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-amber-400 font-bold">{formatPKR(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={clearCart} className="text-amber-50/40 hover:text-red-400 text-sm transition-colors flex items-center gap-1.5">
              <Trash2 size={16} /> Clear cart
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#2a2520] rounded-2xl p-6 border border-amber-900/20 sticky top-24">
              <h2 className="text-amber-50 font-bold text-lg mb-4">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-green-400" />
                      <span className="text-green-400 text-sm font-medium">{appliedCoupon.code}</span>
                    </div>
                    <button onClick={removeCoupon} className="text-green-400 hover:text-red-400 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                        placeholder="Coupon code"
                        className="flex-1 bg-[#1a1714] border border-amber-900/20 rounded-xl px-3 py-2.5 text-amber-50 placeholder-amber-50/30 text-sm focus:outline-none focus:border-amber-500/50"
                      />
                      <button onClick={applyCoupon} className="bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-[#1a1714] px-4 py-2.5 rounded-xl text-sm font-semibold transition-all">
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-red-400 text-xs mt-1.5">{couponError}</p>}
                    <p className="text-amber-50/30 text-xs mt-1.5">Try: WELCOME10, PIZZA500</p>
                  </>
                )}
              </div>

              <div className="space-y-2 py-4 border-t border-amber-900/20">
                <div className="flex justify-between text-sm">
                  <span className="text-amber-50/60">Subtotal</span>
                  <span className="text-amber-50">{formatPKR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Discount</span>
                    <span className="text-green-400">-{formatPKR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-amber-50/60">Delivery</span>
                  <span className="text-amber-50">Free</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-4 border-t border-amber-900/20">
                <span className="text-amber-50 font-bold text-lg">Total</span>
                <span className="text-amber-400 font-bold text-2xl">{formatPKR(total)}</span>
              </div>

              <Link
                to="/checkout"
                state={appliedCoupon ? { couponCode: appliedCoupon.code, discount } : { discount: 0 }}
                className="w-full bg-amber-500 hover:bg-amber-400 text-[#1a1714] py-3.5 rounded-xl font-semibold transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Checkout <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
