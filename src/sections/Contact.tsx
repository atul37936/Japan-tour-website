import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    comment: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    alert('Thank you for your interest! We will contact you soon.');
    setFormData({ name: '', phone: '', comment: '' });
  };

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/contact-fuji.jpg"
          alt="Cherry blossoms framing Mount Fuji and a red pagoda"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-cream/[0.05]" />
        <div className="absolute inset-0 bg-gradient-to-r from-mist/40 via-transparent to-mist/20" />
      </div>

      {/* Frosted Glass Form Panel */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 md:px-[clamp(24px,5vw,80px)] py-20">
        <div
          className="w-full max-w-[420px] rounded-2xl p-8 md:p-12"
          style={{
            background: 'rgba(10, 10, 10, 0.5)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(250, 250, 250, 0.1)',
          }}
        >
          <h2 className="text-body-serif text-kimono text-2xl md:text-[26px] leading-snug mb-2">
            Want to join us, but still have questions?
          </h2>
          <p className="text-small-caps text-mouse tracking-[0.15em]">
            Leave a request
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
            <input
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input-underline"
              required
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="form-input-underline"
              required
            />
            <textarea
              placeholder="Comment"
              rows={3}
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="form-input-underline resize-none"
            />
            <button
              type="submit"
              className="w-full mt-2 py-4 rounded-full bg-kimono text-mist text-small-caps tracking-[0.12em] text-[13px] font-medium hover:bg-lime transition-colors duration-300"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
