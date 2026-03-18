import { Link } from 'react-router-dom'
import { Zap, Users, Dumbbell, CreditCard, CheckCircle, BarChart3, Star, ArrowRight, Shield, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

const features = [
  { icon: <Users size={24}/>,       title: 'Member Management',    desc: 'Full CRUD for member profiles, emergency contacts, and notes linked to subscriptions.', color: 'bg-[var(--accent)] text-black' },
  { icon: <Dumbbell size={24}/>,    title: 'Trainer Management',   desc: 'Track specializations, certifications, experience, and hourly rates.', color: 'bg-[#ff6b35] text-white' },
  { icon: <CheckCircle size={24}/>, title: 'Attendance Tracking',  desc: 'One-tap check-in and check-out with daily counts and per-member history.', color: 'bg-green-500 text-white' },
  { icon: <CreditCard size={24}/>,  title: 'Payments & Billing',   desc: 'Record payments by cash, card, UPI, or bank transfer. Track pending invoices.', color: 'bg-blue-500 text-white' },
  { icon: <BarChart3 size={24}/>,   title: 'Dashboard Analytics',  desc: 'Real-time stats on members, revenue, attendance, and expiring subscriptions.', color: 'bg-purple-500 text-white' },
  { icon: <Shield size={24}/>,      title: 'Role-based Auth',      desc: 'Secure access with Admin, Trainer, and Member roles. Google OAuth supported.', color: 'bg-black text-[var(--accent)]' },
]

const plans = [
  { name: 'Basic',        price: '₹29',  period: '/mo',  features: ['Member Management', 'Basic Analytics', 'Standard Support'], popular: false },
  { name: 'Scale',        price: '₹59',  period: '/mo',  features: ['Everything in Basic', 'Trainer Management', 'Advanced Reports', 'Priority Support'], popular: true  },
  { name: 'Enterprise',   price: '₹299', period: '/yr',  features: ['Everything in Scale', 'API Access', 'Custom Integrations', 'Dedicated AM'], popular: false },
]

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] font-sans overflow-hidden">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[var(--accent)]/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] bg-[#ff6b35]/5 rounded-full blur-[100px]"></div>
      </div>

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 20 ? 'glass-header py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-2xl tracking-widest text-[#0d0d0d]">
            <Zap size={22} className="text-[#0d0d0d]" fill="currentColor" />
            IronPulse
          </div>
          <div className="hidden md:flex items-center gap-8 text-[13px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            <a href="#features" className="hover:text-black transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
            </a>
            <a href="#how-it-works" className="hover:text-black transition-colors relative group">
              How it works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
            </a>
            <a href="#pricing" className="hover:text-black transition-colors relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-[var(--text-secondary)] hover:text-black transition-colors hidden sm:block">Log In</Link>
            <Link to="/signup" className="btn-primary text-sm shadow-md hover:shadow-lg hover:shadow-[var(--accent)]/20">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[var(--border)] shadow-sm mb-8 animate-slide-up">
          <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">IronPulse Beta is live</span>
        </div>
        
        <h1 className="font-display text-5xl md:text-8xl leading-[0.9] text-[var(--text-primary)] mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          THE OS FOR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b35] to-[#ff8c00]">MODERN GYMS</span>
        </h1>
        
        <p className="text-[var(--text-secondary)] text-lg md:text-xl mb-10 max-w-2xl leading-relaxed animate-slide-up" style={{ animationDelay: '200ms' }}>
          Members, trainers, subscriptions, and payments — all in one clean, lightning-fast dashboard built for premium fitness businesses.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <Link to="/signup" className="btn-primary px-8 py-4 text-base shadow-xl shadow-[var(--accent)]/20 hover:shadow-2xl hover:shadow-[var(--accent)]/30 group">
            Start Free Trial <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <a href="/docs" target="_blank" className="btn-outline px-8 py-4 text-base bg-white/50 backdrop-blur-sm">
            View API Docs
          </a>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="relative z-10 px-6 max-w-6xl mx-auto -mt-4 mb-32 hidden md:block perspective-1000">
        <div 
          className="relative rounded-2xl border border-[var(--border)/50] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden transition-transform duration-700 ease-out hover:rotate-0"
          style={{ transform: `rotateX(${Math.max(0, 15 - scrollY * 0.05)}deg) scale(${Math.min(1, 0.95 + scrollY * 0.0001)})`, transformStyle: 'preserve-3d' }}
        >
          {/* Browser Chrome */}
          <div className="bg-[#f5f5f3] px-4 py-3 flex items-center gap-2 border-b border-[var(--border)]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="mx-auto bg-white rounded-md px-4 py-1 flex items-center justify-center w-64 shadow-sm border border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-muted)] font-mono">app.ironpulse.com</span>
            </div>
          </div>
          {/* Dashboard Image / Mock */}
          <div className="p-8 bg-dashboard-grid pb-0 h-[500px] overflow-hidden">
            <div className="flex gap-6 h-full">
              {/* Fake Sidebar */}
              <div className="w-48 bg-white rounded-t-xl border border-b-0 border-[var(--border)] p-4 shadow-sm">
                <div className="h-4 w-24 bg-gray-200 rounded mb-8"></div>
                <div className="space-y-3">
                  <div className="h-8 w-full bg-[var(--text-primary)] rounded-md"></div>
                  <div className="h-8 w-full bg-gray-100 rounded-md"></div>
                  <div className="h-8 w-full bg-gray-100 rounded-md"></div>
                  <div className="h-8 w-full bg-gray-100 rounded-md"></div>
                </div>
              </div>
              {/* Fake Content */}
              <div className="flex-1 space-y-6 pt-2">
                <div className="flex gap-4">
                  <div className="h-32 flex-1 bg-white rounded-xl border border-[var(--border)] shadow-sm p-4 border-t-2 border-t-[var(--accent)]"></div>
                  <div className="h-32 flex-1 bg-white rounded-xl border border-[var(--border)] shadow-sm p-4 border-t-2 border-t-[#ff6b35]"></div>
                  <div className="h-32 flex-1 bg-white rounded-xl border border-[var(--border)] shadow-sm p-4 border-t-2 border-t-[#16a34a]"></div>
                </div>
                <div className="h-[300px] w-full bg-white rounded-t-xl border border-b-0 border-[var(--border)] shadow-sm p-6">
                  <div className="flex items-end gap-2 h-full justify-between pb-8 border-b border-gray-100">
                    {[40, 70, 45, 90, 65, 30, 80].map((h, i) => (
                      <div key={i} className={`w-12 rounded-t-sm ${i === 3 ? 'bg-[var(--text-primary)]' : 'bg-gray-200'}`} style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-12 border-y border-[var(--border)] bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" className="text-[#ffbc00]" />)}
          </div>
          <p className="text-[13px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Trusted by 500+ premium gyms worldwide</p>
        </div>
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee flex gap-12 sm:gap-24 items-center whitespace-nowrap opacity-40">
            {['GOLDS GYM', 'ANYTIME FITNESS', 'EQUINOX', 'SNAP FITNESS', 'CRUNCH', 'PLANET FITNESS'].map((logo, i) => (
              <span key={i} className="font-display text-4xl text-[var(--text-muted)] mx-4">{logo}</span>
            ))}
          </div>
          <div className="absolute top-0 animate-marquee2 flex gap-12 sm:gap-24 items-center whitespace-nowrap opacity-40 ml-12 sm:ml-24">
            {['GOLDS GYM', 'ANYTIME FITNESS', 'EQUINOX', 'SNAP FITNESS', 'CRUNCH', 'PLANET FITNESS'].map((logo, i) => (
              <span key={`clone-${i}`} className="font-display text-4xl text-[var(--text-muted)] mx-4">{logo}</span>
            ))}
          </div>
        </div>
        <style>{`
          .animate-marquee { animation: marquee 25s linear infinite; }
          .animate-marquee2 { animation: marquee2 25s linear infinite; }
          @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
          @keyframes marquee2 { 0% { transform: translateX(100%); } 100% { transform: translateX(0%); } }
        `}</style>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-6xl text-[var(--text-primary)] mb-4">Everything you need.<br/>Nothing you don't.</h2>
          <p className="text-[var(--text-secondary)] text-lg">A unified toolkit designed to accelerate your fitness business.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={f.title} className="card p-8 group relative overflow-hidden" style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="font-display text-2xl mb-3 text-[var(--text-primary)]">{f.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{f.desc}</p>
              
              {/* Hover effect border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl text-[var(--text-primary)] mb-4">From zero to hero in 3 steps</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Dashed line connecting steps - hidden on mobile */}
            <div className="hidden md:block absolute top-[100px] left-[15%] right-[15%] border-t-2 border-dashed border-[var(--border-strong)] z-0"></div>
            
            {[
              { num: '1', title: 'Set up your gym', desc: 'Add trainers, define membership plans, and configure your dashboard in minutes.' },
              { num: '2', title: 'Import members', desc: 'Add existing members or let them sign up. Assign plans and start tracking.' },
              { num: '3', title: 'Grow your business', desc: 'Monitor revenue, attendance, and renewals with real-time analytics.' }
            ].map((step, i) => (
              <div key={step.num} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-white rounded-full border-4 border-[var(--bg-secondary)] text-[var(--text-primary)] font-display text-4xl flex items-center justify-center mb-6 shadow-sm group-hover:border-[var(--accent)] transition-colors duration-300">
                  {step.num}
                </div>
                <h3 className="font-display text-2xl mb-3 text-[var(--text-primary)]">{step.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section id="pricing" className="py-32 px-6 md:px-12 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display text-5xl text-[var(--text-primary)] mb-4">Simple, transparent pricing</h2>
          <p className="text-[var(--text-secondary)] text-lg">No hidden fees. No surprises.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((p, i) => (
            <div key={p.name} className={`rounded-2xl relative p-8 ${p.popular ? 'bg-[#0d0d0d] text-white shadow-2xl scale-105 z-10' : 'bg-white border border-[var(--border)] shadow-sm'}`}>
              {p.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-black text-[11px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase">
                  Most Popular
                </div>
              )}
              <div className="font-display text-2xl mb-2">{p.name}</div>
              <div className="flex items-baseline gap-1 mb-8">
                <div className="font-display text-6xl">{p.price}</div>
                <div className={p.popular ? 'text-gray-400 font-sans' : 'text-[var(--text-secondary)] font-sans'}>{p.period}</div>
              </div>
              <ul className="space-y-4 mb-8">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <CheckCircle size={16} className={p.popular ? 'text-[var(--accent)]' : 'text-green-500'} shrink-0 /> 
                    <span className={p.popular ? 'text-gray-300' : 'text-[var(--text-secondary)]'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup" className={`w-full justify-center py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-300 ${p.popular ? 'bg-[var(--accent)] text-black hover:bg-white inline-flex items-center gap-2' : 'bg-[var(--bg-secondary)] text-black hover:bg-gray-200 inline-flex items-center gap-2'}`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#f5f5f3] border-t border-[var(--border)] pt-16 pb-8 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-2 font-display text-3xl tracking-widest text-[#0d0d0d] mb-6">
            <Zap size={24} fill="currentColor" />IronPulse
          </div>
          <p className="text-[var(--text-secondary)] text-sm mb-8">Designed for the world's best fitness centers.</p>
          <div className="flex gap-8 mb-12">
            {[['API Docs','/docs'],['Status','/status'],['Terms','/terms'],['Privacy','/privacy']].map(([l,h]) => (
              <a key={l} href={h} className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] hover:text-black transition-colors">{l}</a>
            ))}
          </div>
          <div className="w-full h-px bg-[var(--border)] mb-8"></div>
          <p className="text-[var(--text-muted)] text-xs font-medium">© {new Date().getFullYear()} IronPulse Systems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
