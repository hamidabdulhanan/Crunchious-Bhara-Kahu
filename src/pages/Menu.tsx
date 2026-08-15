import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { MenuItem, MenuCategory } from '@/types';
import ProductCard from '@/components/ProductCard';

type SortOption = 'default' | 'price-low' | 'price-high' | 'name';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('default');
  const [showBestsellerOnly, setShowBestsellerOnly] = useState(false);

  const activeCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [{ data: menuItems }, { data: cats }] = await Promise.all([
        supabase.from('menu_items').select('*, category:menu_categories(*)').eq('status', 'active').order('sort_order'),
        supabase.from('menu_categories').select('*').order('sort_order'),
      ]);
      setItems(menuItems || []);
      setCategories(cats || []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    let result = [...items];
    if (activeCategory !== 'all') {
      result = result.filter(i => i.category?.slug === activeCategory);
    }
    if (showBestsellerOnly) {
      result = result.filter(i => i.is_bestseller);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        i => i.name.toLowerCase().includes(q) || (i.description?.toLowerCase().includes(q) ?? false)
      );
    }
    switch (sort) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return result;
  }, [items, activeCategory, showBestsellerOnly, search, sort]);

  const setCategory = (slug: string) => {
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-[#1a1714] min-h-screen pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-amber-50 mb-2">Our Menu</h1>
          <p className="text-amber-50/50">Explore our full range of pizzas, chicken, burgers, and more</p>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-50/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for pizza, chicken, pasta..."
              className="w-full bg-[#2a2520] border border-amber-900/20 rounded-full pl-12 pr-4 py-3 text-amber-50 placeholder-amber-50/40 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-50/40 hover:text-amber-400">
                <X size={18} />
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <SlidersHorizontal size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-50/40 pointer-events-none" />
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortOption)}
                className="bg-[#2a2520] border border-amber-900/20 rounded-full pl-9 pr-4 py-3 text-amber-50 text-sm focus:outline-none focus:border-amber-500/50 cursor-pointer appearance-none"
              >
                <option value="default">Sort: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
            <button
              onClick={() => setShowBestsellerOnly(!showBestsellerOnly)}
              className={`px-4 py-3 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                showBestsellerOnly
                  ? 'bg-amber-500 text-[#1a1714]'
                  : 'bg-[#2a2520] border border-amber-900/20 text-amber-50/60 hover:text-amber-400'
              }`}
            >
              Bestsellers
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 pb-4">
          <button
            onClick={() => setCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-amber-500 text-[#1a1714]'
                : 'bg-[#2a2520] border border-amber-900/20 text-amber-50/60 hover:text-amber-400 hover:border-amber-500/40'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.slug
                  ? 'bg-amber-500 text-[#1a1714]'
                  : 'bg-[#2a2520] border border-amber-900/20 text-amber-50/60 hover:text-amber-400 hover:border-amber-500/40'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[#2a2520] rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-amber-900/10" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-amber-900/10 rounded w-3/4" />
                  <div className="h-3 bg-amber-900/10 rounded w-full" />
                  <div className="h-6 bg-amber-900/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-amber-50/40 text-lg">No items found. Try a different search or category.</p>
          </div>
        ) : (
          <>
            <p className="text-amber-50/40 text-sm mb-4">{filtered.length} item{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {filtered.map(item => (
                <ProductCard key={item.id} item={item} categorySlug={item.category?.slug} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
