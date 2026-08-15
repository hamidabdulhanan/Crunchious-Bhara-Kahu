import { Link } from 'react-router-dom';
import { Plus, Star } from 'lucide-react';
import type { MenuItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPKR } from '@/lib/format';

const categoryImages: Record<string, string> = {
  'classic-pizzas': 'https://images.pexels.com/photos/37417637/pexels-photo-37417637.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'crown-crust': 'https://images.pexels.com/photos/6493572/pexels-photo-6493572.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'special-pizzas': 'https://images.pexels.com/photos/6488931/pexels-photo-6488931.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'stuff-crust': 'https://images.pexels.com/photos/27582703/pexels-photo-27582703.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'crunchy-chicken': 'https://images.pexels.com/photos/5474676/pexels-photo-5474676.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'fried-chicken': 'https://images.pexels.com/photos/6697493/pexels-photo-6697493.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'burger-zone': 'https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'pastas': 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'fries-fiesta': 'https://images.pexels.com/photos/14537694/pexels-photo-14537694.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'starters': 'https://images.pexels.com/photos/13062440/pexels-photo-13062440.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'deal-station': 'https://images.pexels.com/photos/15094217/pexels-photo-15094217.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'super-combos': 'https://images.pexels.com/photos/15094217/pexels-photo-15094217.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'platters': 'https://images.pexels.com/photos/6697493/pexels-photo-6697493.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'specials': 'https://images.pexels.com/photos/33592997/pexels-photo-33592997.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'sandwiches': 'https://images.pexels.com/photos/9011742/pexels-photo-9011742.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'sides': 'https://images.pexels.com/photos/14537694/pexels-photo-14537694.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'beverages': 'https://images.pexels.com/photos/33917295/pexels-photo-33917295.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'dips': 'https://images.pexels.com/photos/14537694/pexels-photo-14537694.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'extras-toppings': 'https://images.pexels.com/photos/6493567/pexels-photo-6493567.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

export function getCategoryImage(slug: string, image: string | null): string {
  if (image) return image;
  return categoryImages[slug] || categoryImages['classic-pizzas'];
}

interface ProductCardProps {
  item: MenuItem;
  categorySlug?: string;
}

export default function ProductCard({ item, categorySlug }: ProductCardProps) {
  const { addItem } = useCart();
  const img = getCategoryImage(categorySlug || '', item.image);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      menu_item_id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      size: item.sizes.length > 0 ? item.sizes[0].label : null,
      toppings: [],
      image: img,
    });
  };

  return (
    <Link
      to={`/product/${item.id}`}
      className="group bg-[#2a2520] rounded-2xl overflow-hidden border border-amber-900/20 hover:border-amber-500/40 transition-all hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={img}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {item.is_bestseller && (
          <div className="absolute top-3 left-3 bg-amber-500 text-[#1a1714] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Star size={12} className="fill-[#1a1714]" />
            Bestseller
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-amber-50 font-semibold text-base mb-1 line-clamp-1">{item.name}</h3>
        <p className="text-amber-50/50 text-sm mb-3 line-clamp-2 leading-relaxed">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-amber-400 font-bold text-lg">{formatPKR(item.price)}</span>
          <button
            onClick={handleQuickAdd}
            className="bg-amber-500 hover:bg-amber-400 text-[#1a1714] w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            aria-label="Add to cart"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
}
