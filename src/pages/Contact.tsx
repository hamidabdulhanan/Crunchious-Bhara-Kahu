import { useState } from 'react';
import { Phone, Mail, Clock, MapPin, Send, MessageCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const workingHours = [
  { day: 'Sunday', hours: '11:00 AM – 03:00 AM' },
  { day: 'Monday', hours: '11:00 AM – 03:00 AM' },
  { day: 'Tuesday', hours: '11:00 AM – 03:00 AM' },
  { day: 'Wednesday', hours: '11:00 AM – 03:00 AM' },
  { day: 'Thursday', hours: '11:00 AM – 03:00 AM' },
  { day: 'Friday', hours: '11:00 AM – 01:15 PM, 01:45 PM – 03:00 AM' },
  { day: 'Saturday', hours: '11:00 AM – 03:00 AM' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      setError('Please fill in your name, phone, and message.');
      return;
    }
    setSubmitting(true);
    setError('');
    const { error: insertError } = await supabase.from('contact_messages').insert({
      name: form.name,
      phone: form.phone,
      email: form.email || null,
      message: form.message,
    });
    setSubmitting(false);
    if (insertError) {
      setError('Something went wrong. Please try again or call us directly.');
      return;
    }
    setSubmitted(true);
    setForm({ name: '', phone: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-[#1a1714] min-h-screen pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-amber-50 mb-2">Get in Touch</h1>
          <p className="text-amber-50/50">We would love to hear from you. Reach out any time.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="bg-[#2a2520] rounded-3xl p-6 lg:p-8 border border-amber-900/20">
            <h2 className="text-amber-50 font-bold text-xl mb-6">Send Us a Message</h2>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle size={48} className="text-green-500 mb-4" />
                <p className="text-amber-50 font-semibold text-lg">Message sent!</p>
                <p className="text-amber-50/50 text-sm mt-1">We will get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-amber-50/70 text-sm mb-1.5">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-[#1a1714] border border-amber-900/20 rounded-xl px-4 py-3 text-amber-50 placeholder-amber-50/30 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-amber-50/70 text-sm mb-1.5">Phone *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-[#1a1714] border border-amber-900/20 rounded-xl px-4 py-3 text-amber-50 placeholder-amber-50/30 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                    placeholder="03XX-XXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-amber-50/70 text-sm mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-[#1a1714] border border-amber-900/20 rounded-xl px-4 py-3 text-amber-50 placeholder-amber-50/30 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-amber-50/70 text-sm mb-1.5">Message *</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    className="w-full bg-[#1a1714] border border-amber-900/20 rounded-xl px-4 py-3 text-amber-50 placeholder-amber-50/30 text-sm focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-[#1a1714] py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-[#1a1714] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-[#2a2520] rounded-3xl p-6 lg:p-8 border border-amber-900/20">
              <h2 className="text-amber-50 font-bold text-xl mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
                    <Phone className="text-amber-400" size={20} />
                  </div>
                  <div>
                    <p className="text-amber-50/50 text-xs uppercase tracking-wider">Phone</p>
                    <a href="tel:03309999005" className="text-amber-50 font-medium hover:text-amber-400 transition-colors">0330-9999005</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
                    <Mail className="text-amber-400" size={20} />
                  </div>
                  <div>
                    <p className="text-amber-50/50 text-xs uppercase tracking-wider">Email</p>
                    <a href="mailto:info@crunchypizza.pk" className="text-amber-50 font-medium hover:text-amber-400 transition-colors">info@crunchypizza.pk</a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
                    <MapPin className="text-amber-400" size={20} />
                  </div>
                  <div>
                    <p className="text-amber-50/50 text-xs uppercase tracking-wider">Address</p>
                    <p className="text-amber-50 font-medium">Bhara Kahu, Islamabad, Pakistan</p>
                  </div>
                </div>
              </div>
              <a
                href="https://wa.me/923309999005"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full bg-green-500 hover:bg-green-400 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} /> WhatsApp Us
              </a>
            </div>

            <div className="bg-[#2a2520] rounded-3xl p-6 lg:p-8 border border-amber-900/20">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="text-amber-400" size={20} />
                <h2 className="text-amber-50 font-bold text-xl">Working Hours</h2>
              </div>
              <div className="space-y-2">
                {workingHours.map(wh => (
                  <div key={wh.day} className="flex justify-between items-center py-2 border-b border-amber-900/10 last:border-0">
                    <span className="text-amber-50/60 text-sm">{wh.day}</span>
                    <span className="text-amber-50 text-sm font-medium text-right">{wh.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-8 rounded-3xl overflow-hidden border border-amber-900/20">
          <iframe
            title="Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.5!2d73.3!3d33.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDQyJzAwLjAiTiA3M8KwMTgnJzAwLjAiRQ!5e0!3m2!1sen!2s!4v1700000000000"
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
