import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, ShoppingBag, UtensilsCrossed, Star, MessageSquare, Clock, Phone, MapPin, Package, TrendingUp, DollarSign, CheckCircle, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Order, OrderItem, Review, ContactMessage } from '@/types';
import { formatPKR } from '@/lib/format';

type Tab = 'overview' | 'orders' | 'menu' | 'reviews' | 'messages';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400',
  confirmed: 'bg-blue-500/15 text-blue-400',
  preparing: 'bg-purple-500/15 text-purple-400',
  'out-for-delivery': 'bg-cyan-500/15 text-cyan-400',
  delivered: 'bg-green-500/15 text-green-400',
  cancelled: 'bg-red-500/15 text-red-400',
};

const statusOptions = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [reviews, setReviews] = useState<Review[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, revenue: 0, todayOrders: 0 });

  const checkAuth = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
      return false;
    }
    return true;
  }, [navigate]);

  const loadData = useCallback(async () => {
    const { data: ords } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    const orderList = ords || [];
    setOrders(orderList);

    const itemsMap: Record<string, OrderItem[]> = {};
    for (const o of orderList) {
      const { data: items } = await supabase.from('order_items').select('*').eq('order_id', o.id);
      itemsMap[o.id] = items || [];
    }
    setOrderItems(itemsMap);

    const { data: revs } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    setReviews(revs || []);

    const { data: msgs } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    setMessages(msgs || []);

    const today = new Date().toISOString().split('T')[0];
    setStats({
      total: orderList.length,
      pending: orderList.filter(o => o.status === 'pending').length,
      revenue: orderList.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0),
      todayOrders: orderList.filter(o => o.created_at.startsWith(today)).length,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      const authed = await checkAuth();
      if (authed) loadData();
    })();
  }, [checkAuth, loadData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    }
  };

  const approveReview = async (id: string, approved: boolean) => {
    const { error } = await supabase.from('reviews').update({ approved }).eq('id', id);
    if (!error) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, approved } : r));
    }
  };

  const deleteMessage = async (id: string) => {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (!error) {
      setMessages(prev => prev.filter(m => m.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="bg-[#1a1714] min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#1a1714] min-h-screen">
      {/* Header */}
      <div className="bg-[#221d18] border-b border-amber-900/20 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="text-amber-400" size={22} />
              <span className="text-amber-50 font-bold">Admin Dashboard</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-amber-50/60 hover:text-red-400 text-sm transition-colors"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {([
            { key: 'overview', label: 'Overview', icon: LayoutDashboard },
            { key: 'orders', label: 'Orders', icon: ShoppingBag },
            { key: 'menu', label: 'Menu Items', icon: UtensilsCrossed },
            { key: 'reviews', label: 'Reviews', icon: Star },
            { key: 'messages', label: 'Messages', icon: MessageSquare },
          ] as { key: Tab; label: string; icon: typeof LayoutDashboard }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                tab === t.key ? 'bg-amber-500 text-[#1a1714]' : 'bg-[#2a2520] text-amber-50/60 hover:text-amber-400 border border-amber-900/20'
              }`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Orders', value: stats.total, icon: ShoppingBag, color: 'amber' },
                { label: 'Pending Orders', value: stats.pending, icon: Clock, color: 'blue' },
                { label: "Today's Orders", value: stats.todayOrders, icon: TrendingUp, color: 'green' },
                { label: 'Total Revenue', value: formatPKR(stats.revenue), icon: DollarSign, color: 'amber' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#2a2520] rounded-2xl p-5 border border-amber-900/20">
                  <div className="w-10 h-10 rounded-full bg-amber-500/15 flex items-center justify-center mb-3">
                    <stat.icon className="text-amber-400" size={18} />
                  </div>
                  <p className="text-amber-50/50 text-xs uppercase tracking-wider">{stat.label}</p>
                  <p className="text-amber-50 font-bold text-2xl mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#2a2520] rounded-2xl p-6 border border-amber-900/20">
              <h2 className="text-amber-50 font-bold text-lg mb-4">Recent Orders</h2>
              <div className="space-y-3">
                {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-amber-900/10 last:border-0">
                    <div>
                      <p className="text-amber-50 font-medium text-sm">{order.order_number}</p>
                      <p className="text-amber-50/40 text-xs">{order.customer_name} · {order.phone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-amber-50/60 text-sm">{formatPKR(order.total)}</span>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setTab('orders')}
                className="mt-4 text-amber-400 hover:text-amber-300 text-sm font-medium"
              >
                View all orders →
              </button>
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div>
            {selectedOrder ? (
              <div className="bg-[#2a2520] rounded-2xl p-6 border border-amber-900/20">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex items-center gap-2 text-amber-50/60 hover:text-amber-400 mb-4 transition-colors"
                >
                  <X size={18} /> <span className="text-sm">Back to orders</span>
                </button>

                <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-amber-900/20">
                  <div>
                    <h2 className="text-amber-50 font-bold text-xl">{selectedOrder.order_number}</h2>
                    <p className="text-amber-50/40 text-sm mt-1">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full capitalize ${statusColors[selectedOrder.status]}`}>
                      {selectedOrder.status}
                    </span>
                    <select
                      value={selectedOrder.status}
                      onChange={e => updateOrderStatus(selectedOrder.id, e.target.value)}
                      className="bg-[#1a1714] border border-amber-900/20 rounded-lg px-3 py-1.5 text-amber-50 text-sm focus:outline-none focus:border-amber-500/50 cursor-pointer"
                    >
                      {statusOptions.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Package size={16} className="text-amber-400" />
                      <div>
                        <p className="text-amber-50/40 text-xs uppercase">Order Type</p>
                        <p className="text-amber-50 text-sm capitalize">{selectedOrder.order_type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-amber-400" />
                      <div>
                        <p className="text-amber-50/40 text-xs uppercase">Phone</p>
                        <p className="text-amber-50 text-sm">{selectedOrder.phone}</p>
                      </div>
                    </div>
                    {selectedOrder.order_type === 'dine-in' && (
                      <div className="flex items-center gap-3">
                        <UtensilsCrossed size={16} className="text-amber-400" />
                        <div>
                          <p className="text-amber-50/40 text-xs uppercase">Table Number</p>
                          <p className="text-amber-50 text-sm font-bold">Table {selectedOrder.table_number}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {selectedOrder.address && (
                      <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-amber-400 mt-0.5" />
                        <div>
                          <p className="text-amber-50/40 text-xs uppercase">Address</p>
                          <p className="text-amber-50 text-sm">{selectedOrder.address}</p>
                        </div>
                      </div>
                    )}
                    {selectedOrder.notes && (
                      <div>
                        <p className="text-amber-50/40 text-xs uppercase mb-1">Notes</p>
                        <p className="text-amber-50/70 text-sm">{selectedOrder.notes}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-amber-50/40 text-xs uppercase mb-1">Payment</p>
                      <p className="text-amber-50 text-sm capitalize">{selectedOrder.payment_method === 'cod' ? 'Cash on Delivery' : selectedOrder.payment_method}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-amber-900/20 pt-4">
                  <h3 className="text-amber-50 font-semibold mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {(orderItems[selectedOrder.id] || []).map(item => (
                      <div key={item.id} className="flex justify-between text-sm py-2 border-b border-amber-900/10 last:border-0">
                        <div>
                          <span className="text-amber-50">{item.quantity}x {item.name}</span>
                          {item.size && <span className="text-amber-50/40 ml-1">({item.size})</span>}
                          {item.toppings && item.toppings.length > 0 && (
                            <p className="text-amber-50/30 text-xs">+ {item.toppings.join(', ')}</p>
                          )}
                        </div>
                        <span className="text-amber-50/70">{formatPKR(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5 mt-4 pt-4 border-t border-amber-900/20">
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-50/60">Subtotal</span>
                      <span className="text-amber-50">{formatPKR(selectedOrder.subtotal)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-400">Discount {selectedOrder.coupon_code && `(${selectedOrder.coupon_code})`}</span>
                        <span className="text-green-400">-{formatPKR(selectedOrder.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-amber-900/20">
                      <span className="text-amber-50 font-bold">Total</span>
                      <span className="text-amber-400 font-bold text-lg">{formatPKR(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#2a2520] rounded-2xl border border-amber-900/20 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-amber-900/20">
                        <th className="text-left px-4 py-3 text-amber-50/50 text-xs uppercase tracking-wider font-medium">Order #</th>
                        <th className="text-left px-4 py-3 text-amber-50/50 text-xs uppercase tracking-wider font-medium">Customer</th>
                        <th className="text-left px-4 py-3 text-amber-50/50 text-xs uppercase tracking-wider font-medium">Type</th>
                        <th className="text-left px-4 py-3 text-amber-50/50 text-xs uppercase tracking-wider font-medium">Table</th>
                        <th className="text-left px-4 py-3 text-amber-50/50 text-xs uppercase tracking-wider font-medium">Total</th>
                        <th className="text-left px-4 py-3 text-amber-50/50 text-xs uppercase tracking-wider font-medium">Status</th>
                        <th className="text-left px-4 py-3 text-amber-50/50 text-xs uppercase tracking-wider font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className="border-b border-amber-900/10 hover:bg-amber-500/5 cursor-pointer transition-colors"
                        >
                          <td className="px-4 py-3 text-amber-400 font-medium text-sm">{order.order_number}</td>
                          <td className="px-4 py-3">
                            <p className="text-amber-50 text-sm">{order.customer_name}</p>
                            <p className="text-amber-50/40 text-xs">{order.phone}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-amber-50/70 text-sm capitalize">{order.order_type}</span>
                          </td>
                          <td className="px-4 py-3">
                            {order.table_number ? (
                              <span className="bg-amber-500/15 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full">
                                Table {order.table_number}
                              </span>
                            ) : (
                              <span className="text-amber-50/30 text-sm">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-amber-50 text-sm font-medium">{formatPKR(order.total)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[order.status]}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-amber-50/40 text-xs">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {orders.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-amber-50/40">No orders yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Menu Management */}
        {tab === 'menu' && (
          <div className="bg-[#2a2520] rounded-2xl p-6 border border-amber-900/20">
            <h2 className="text-amber-50 font-bold text-lg mb-4">Menu Management</h2>
            <p className="text-amber-50/50 text-sm mb-4">
              Menu items are managed through the Supabase dashboard. You can add, edit, and delete items, categories, toppings, and coupons directly in the database.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Menu Items', table: 'menu_items' },
                { label: 'Categories', table: 'menu_categories' },
                { label: 'Toppings', table: 'toppings' },
                { label: 'Coupons', table: 'coupons' },
              ].map(item => (
                <div key={item.table} className="bg-[#1a1714] rounded-xl p-4 border border-amber-900/20 text-center">
                  <UtensilsCrossed className="text-amber-400 mx-auto mb-2" size={20} />
                  <p className="text-amber-50 text-sm font-medium">{item.label}</p>
                  <p className="text-amber-50/30 text-xs mt-1">{item.table}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {tab === 'reviews' && (
          <div className="space-y-3">
            {reviews.map(review => (
              <div key={review.id} className="bg-[#2a2520] rounded-2xl p-5 border border-amber-900/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-amber-50 font-medium text-sm">{review.customer_name}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(n => (
                          <Star
                            key={n}
                            size={12}
                            className={n <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-600 text-gray-600'}
                          />
                        ))}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${review.approved ? 'bg-green-500/15 text-green-400' : 'bg-amber-500/15 text-amber-400'}`}>
                        {review.approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-amber-50/60 text-sm">{review.review_text}</p>
                    <p className="text-amber-50/30 text-xs mt-1">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {!review.approved && (
                      <button
                        onClick={() => approveReview(review.id, true)}
                        className="bg-green-500/10 hover:bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <CheckCircle size={14} /> Approve
                      </button>
                    )}
                    {review.approved && (
                      <button
                        onClick={() => approveReview(review.id, false)}
                        className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        Unapprove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="text-center py-12 text-amber-50/40">No reviews yet.</div>
            )}
          </div>
        )}

        {/* Messages */}
        {tab === 'messages' && (
          <div className="space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className="bg-[#2a2520] rounded-2xl p-5 border border-amber-900/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-amber-50 font-medium text-sm">{msg.name}</span>
                      <span className="text-amber-50/40 text-xs">·</span>
                      <span className="text-amber-50/60 text-sm">{msg.phone}</span>
                      {msg.email && (
                        <>
                          <span className="text-amber-50/40 text-xs">·</span>
                          <span className="text-amber-50/60 text-sm">{msg.email}</span>
                        </>
                      )}
                    </div>
                    <p className="text-amber-50/60 text-sm mt-2">{msg.message}</p>
                    <p className="text-amber-50/30 text-xs mt-1">{new Date(msg.created_at).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="text-amber-50/40 hover:text-red-400 transition-colors shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center py-12 text-amber-50/40">No messages yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
