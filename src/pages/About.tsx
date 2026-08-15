import { useEffect, useState } from 'react';
import { Target, Eye, Award, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { TeamMember } from '@/types';

const storyImage = 'https://images.pexels.com/photos/17318176/pexels-photo-17318176.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const kitchenImage = 'https://images.pexels.com/photos/4253300/pexels-photo-4253300.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const restaurantImage = 'https://images.pexels.com/photos/13869884/pexels-photo-13869884.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export default function About() {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('team_members').select('*').order('sort_order');
      setTeam(data || []);
    })();
  }, []);

  return (
    <div className="bg-[#1a1714] min-h-screen pt-20 lg:pt-24">
      {/* Hero */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-amber-50 mb-4">Our Story</h1>
          <p className="text-amber-50/60 max-w-2xl mx-auto leading-relaxed">
            What started as a small pizza shop in Bhara Kahu has grown into the most loved pizza destination in the area. Our journey began with a simple mission: to serve the freshest, most delicious pizzas and fast food that our community deserves.
          </p>
        </div>
      </section>

      {/* Story with Image */}
      <section className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="rounded-3xl overflow-hidden border border-amber-900/20">
              <img src={storyImage} alt="Our Kitchen" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-amber-50 mb-4">From Humble Beginnings</h2>
              <p className="text-amber-50/60 leading-relaxed mb-4">
                Founded by Ahmed Raza, a chef with over 15 years of experience, Crunchy Pizza started with a single oven and a big dream. Ahmed wanted to bring authentic, high-quality pizza to Bhara Kahu — something the neighborhood had been missing.
              </p>
              <p className="text-amber-50/60 leading-relaxed mb-4">
                Today, we serve thousands of happy customers every month with our signature pizzas, crunchy chicken, burgers, pastas, and more. Every dish is made with fresh ingredients and prepared with care by our dedicated kitchen team.
              </p>
              <p className="text-amber-50/60 leading-relaxed">
                We are proud to be a part of the Bhara Kahu community and grateful for the love and support of our customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 lg:py-16 bg-[#221d18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#2a2520] rounded-2xl p-8 border border-amber-900/20">
              <div className="w-14 h-14 rounded-full bg-amber-500/15 flex items-center justify-center mb-4">
                <Target className="text-amber-400" size={26} />
              </div>
              <h3 className="text-amber-50 font-bold text-xl mb-3">Our Mission</h3>
              <p className="text-amber-50/60 leading-relaxed">
                To serve the highest quality food made with fresh ingredients, delivered fast and hot, at prices that bring value to every customer. We strive for excellence in every order, every time.
              </p>
            </div>
            <div className="bg-[#2a2520] rounded-2xl p-8 border border-amber-900/20">
              <div className="w-14 h-14 rounded-full bg-amber-500/15 flex items-center justify-center mb-4">
                <Eye className="text-amber-400" size={26} />
              </div>
              <h3 className="text-amber-50 font-bold text-xl mb-3">Our Vision</h3>
              <p className="text-amber-50/60 leading-relaxed">
                To become the leading pizza and fast food destination in Islamabad, known for taste, quality, and exceptional customer service. We aim to expand while maintaining the standards that made us a neighborhood favorite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-amber-50 text-center mb-8">Our Restaurant</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl overflow-hidden border border-amber-900/20 aspect-[4/3]">
              <img src={restaurantImage} alt="Restaurant" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden border border-amber-900/20 aspect-[4/3]">
              <img src={kitchenImage} alt="Kitchen" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden border border-amber-900/20 aspect-[4/3]">
              <img src={storyImage} alt="Chefs" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 lg:py-16 bg-[#221d18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-amber-400 mb-2">
              <Users size={18} />
              <span className="text-sm font-semibold uppercase tracking-wider">Meet the Team</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-amber-50">The People Behind the Taste</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map(member => (
              <div key={member.id} className="bg-[#2a2520] rounded-2xl p-6 border border-amber-900/20 hover:border-amber-500/40 transition-all hover:-translate-y-1 text-center">
                <div className="w-20 h-20 rounded-full bg-amber-500/15 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-amber-400">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-amber-50 font-semibold text-lg">{member.name}</h3>
                <p className="text-amber-400 text-sm mb-3">{member.designation}</p>
                <p className="text-amber-50/50 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Award, title: 'Quality First', desc: 'We never compromise on the quality of our ingredients or preparation.' },
              { icon: Target, title: 'Customer Focused', desc: 'Every decision we make starts with what is best for our customers.' },
              { icon: Users, title: 'Community Driven', desc: 'We are proud to serve and be part of the Bhara Kahu community.' },
            ].map((v, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-full bg-amber-500/15 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="text-amber-400" size={26} />
                </div>
                <h3 className="text-amber-50 font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-amber-50/50 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
