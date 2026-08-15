import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Clock, ChefHat, Bike, CheckCircle, XCircle, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Order, OrderItem } from '@/types';
import { formatPKR } from '@/lib/format';

const statuses = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: Package },
  { key: 'preparing', label: 'Preparing', icon: ChefHat },
  { key: 'out-for-delivery', label: 'Out for Delivery', icon: Bike },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError('Please enter your order number.');
      return;
    }
    setLoading(true);
    setError('');
    setSearched(true);

    let query = supabase.from('orders').select('*').eq('order_number', orderNumber.toUpperCase());
    if (phone.trim()) {
      query = query.eq('phone', phone);
    }
    const { data, error: queryError } = await query.maybeSingle();

    if (queryError || !data) {
      setOrder(null);
      setOrderItems([]);
      setError('Order not found. Please check your order number and phone.');
      setLoading(false);
      return;
    }

    setOrder(data);
    const { data: items } = await supabase.from('order_items').select('*').eq('order_id', data.id);
    setOrderItems(items || []);
    setLoading(false);
  };

  useEffect(() => {
    if (searchParams.get('order')) {
      handleSearch({ preventDefault: () => {} } as React.FormEvent);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentStatusIdx = order ? statuses.findIndex(s => s.key === order.status) : -1;
  const isCancelled = order?.status === 'cancelled';

  return (
    <div className="bg-[#1a1714] min-h-screen pt-20 lg:pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-50 mb-2">Track Your Order</h1>
          <p className="text-amber-50/50">Enter your order number to see real-time status</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="bg-[#2a2520] rounded-2xl p-6 border border-amber-900/20 mb-6">
          <div className="space-y-3">
            <div>
              <label className="block text-amber-50/70 text-sm mb-1.5">Order Number *</label>
              <input
                type="text"
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value)}
                className="w-full bg-[#1a1714] border border-amber-900/20 rounded-xl px-4 py-3 text-amber-50 placeholder-amber-50/30 text-sm focus:outline-none focus:border-amber-500/50 uppercase"
                placeholder="ORD123456789"
              />
            </div>
            <div>
              <label className="block text-amber-50/70 text-sm mb-1.5">Phone (optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-[#1a1714] border border-amber-900/20 rounded-xl px-4 py-3 text-amber-50 placeholder-amber-50/30 text-sm focus:outline-none focus:border-amber-500/50"
                placeholder="03XX-XXXXXXX"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#1a1714] py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#1a1714] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search size={18} /> Track Order
                </>
              )}
            </button>
          </div>
        </form>

        {/* Results */}
        {order && !isCancelled && (
          <div className="bg-[#2a2520] rounded-2xl p-6 lg:p-8 border border-amber-900/20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-amber-50/50 text-xs uppercase tracking-wider">Order Number</p>
                <p className="text-amber-400 font-bold text-lg">{order.order_number}</p>
              </div>
              <div className="text-right">
                <p className="text-amber-50/50 text-xs uppercase tracking-wider">Total</p>
                <p className="text-amber-50 font-bold text-lg">{formatPKR(order.total)}</p>
              </div>
            </div>

            {/* Status Tracker */}
            <div className="relative mb-8">
              <div className="flex justify-between items-center relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-amber-900/30" />
                <div
                  className="absolute top-5 left-0 h-0.5 bg-amber-500 transition-all duration-500"
                  style={{ width: `${(currentStatusIdx / (statuses.length - 1)) * 100}%` }}
                />
                {statuses.map((s, i) => {
                  const isDone = i <= currentStatusIdx;
                  const isCurrent = i === currentStatusIdx;
                  return (
                    <div key={s.key} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-amber-500 text-[#1a1714]'
                            : 'bg-[#1a1714] border border-amber-900/30 text-amber-50/30'
                        } ${isCurrent ? 'ring-4 ring-amber-500/20 scale-110' : ''}`}
                      >
                        <s.icon size={18} />
                      </div>
                      <span className={`text-xs font-medium text-center ${isDone ? 'text-amber-400' : 'text-amber-50/30'}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2 pt-4 border-t border-amber-900/20">
              {orderItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-amber-50/60">
                    {item.quantity}x {item.name}
                    {item.size && <span className="text-amber-50/30 ml-1">({item.size})</span>}
                  </span>
                  <span className="text-amber-50/80">{formatPKR(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Info */}
            <div className="mt-4 pt-4 border-t border-amber-900/20 flex items-center gap-3">
              <Phone size={16} className="text-amber-400" />
              <span className="text-amber-50/60 text-sm">{order.phone}</span>
              {order.order_type === 'dine-in' && (
                <span className="text-amber-50/60 text-sm ml-auto">Table: {order.table_number}</span>
              )}
            </div>
          </div>
        )}

        {order && isCancelled && (
          <div className="bg-[#2a2520] rounded-2xl p-8 border border-red-500/30 text-center">
            <XCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-amber-50 font-bold text-xl mb-2">Order Cancelled</h2>
            <p className="text-amber-50/50 text-sm">Order {order.order_number} has been cancelled. Please contact us for assistance.</p>
          </div>
        )}

        {searched && !order && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-amber-50/40">No order found. Please check your order number.</p>
          </div>
        )}
      </div>
    </div>
  );
}
