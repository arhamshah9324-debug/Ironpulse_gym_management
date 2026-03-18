import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' })
  const [showPw, setShowPw]     = useState(false)
  const [isFocused, setIsFocused] = useState(null)
  const { signup, loading, error } = useAuth()
  const navigate = useNavigate()

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await signup(form.name, form.email, form.password, form.role)
      navigate('/dashboard')
    } catch {}
  }

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* LEFT PANEL - BRAND EXPERIENCE */}
      <div className="hidden lg:flex flex-1 relative bg-[var(--text-primary)] text-white overflow-hidden p-12 flex-col justify-between">
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[var(--accent)]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#ff6b35]/15 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 flex items-center gap-2 font-display text-2xl tracking-widest text-white">
          <Zap size={22} className="text-[var(--accent)]" fill="currentColor" /> IronPulse
        </div>
        
        <div className="relative z-10 max-w-lg mt-10">
          <h1 className="font-display text-6xl leading-[0.9] mb-4">Start Growing <br/><span className="text-[var(--accent)]">Your Gym Today</span></h1>
          <p className="text-gray-400 text-lg mb-8">Join hundreds of gym owners who upgraded to a premium management experience.</p>
          
          <div className="space-y-6">
            {[
              "Setup in less than 5 minutes",
              "Import existing members instantly",
              "Free 14-day trial, zero commitment"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: `${i * 150}ms` }}>
                <CheckCircle className="text-[var(--accent)]" size={20} />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 mt-auto pt-10">
          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            <div>
              <div className="font-display text-3xl mb-1 text-white">500+</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Gyms Active</div>
            </div>
            <div>
              <div className="font-display text-3xl mb-1 text-[var(--accent)]">99.9%</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Uptime Guarantee</div>
            </div>
            <div>
              <div className="font-display text-3xl mb-1 text-white">24/7</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Expert Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - CLEAN FORM */}
      <div className="flex-[1] flex items-center justify-center p-6 sm:p-12 relative bg-[var(--bg-primary)] overflow-y-auto">
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2 font-display text-xl tracking-widest text-black">
          <Zap size={18} fill="currentColor" /> IronPulse
        </div>

        <div className="w-full max-w-sm animate-slide-up my-auto py-10 lg:py-0">
          <div className="mb-8">
            <h2 className="font-display text-4xl mb-2 text-black">Create Account</h2>
            <p className="text-[var(--text-secondary)]">Begin your 14-day free trial</p>
          </div>

          {error && (
            <div className="bg-red-50/80 border-l-4 border-red-500 text-red-700 text-sm px-4 py-3 rounded-lg mb-6 shadow-sm flex items-center gap-3">
              <span className="font-bold flex-1">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Full Name</label>
              <div className={`relative transition-all duration-300 rounded-xl ${isFocused === 'name' ? 'shadow-[0_0_0_4px_rgba(13,13,13,0.05)]' : ''}`}>
                <input 
                  className="input !border-[var(--border-strong)] !bg-white focus:!border-black" 
                  type="text" 
                  placeholder="John Doe"
                  value={form.name} 
                  onChange={set('name')} 
                  onFocus={() => setIsFocused('name')}
                  onBlur={() => setIsFocused(null)}
                  required 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Email</label>
              <div className={`relative transition-all duration-300 rounded-xl ${isFocused === 'email' ? 'shadow-[0_0_0_4px_rgba(13,13,13,0.05)]' : ''}`}>
                <input 
                  className="input !border-[var(--border-strong)] !bg-white focus:!border-black" 
                  type="email" 
                  placeholder="you@example.com"
                  value={form.email} 
                  onChange={set('email')} 
                  onFocus={() => setIsFocused('email')}
                  onBlur={() => setIsFocused(null)}
                  required 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Password</label>
              <div className={`relative transition-all duration-300 rounded-xl ${isFocused === 'password' ? 'shadow-[0_0_0_4px_rgba(13,13,13,0.05)]' : ''}`}>
                <input 
                  className="input !border-[var(--border-strong)] !bg-white pr-10 focus:!border-black" 
                  type={showPw ? 'text' : 'password'} 
                  placeholder="Min 6 characters"
                  value={form.password} 
                  onChange={set('password')} 
                  minLength={6}
                  onFocus={() => setIsFocused('password')}
                  onBlur={() => setIsFocused(null)}
                  required 
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors focus:outline-none p-1">
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Role</label>
              <div className={`relative transition-all duration-300 rounded-xl ${isFocused === 'role' ? 'shadow-[0_0_0_4px_rgba(13,13,13,0.05)]' : ''}`}>
                <select 
                  className="input !border-[var(--border-strong)] !bg-white appearance-none focus:!border-black" 
                  value={form.role} 
                  onChange={set('role')}
                  onFocus={() => setIsFocused('role')}
                  onBlur={() => setIsFocused(null)}
                >
                  <option value="member">Network Member</option>
                  <option value="trainer">Trainer / Staff</option>
                  <option value="admin">Gym Admin</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            
            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3.5 text-sm uppercase tracking-wider mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Creating account...
                </span>
              ) : 'Open Account'}
            </button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border-strong)]"/></div>
            <div className="relative text-center"><span className="bg-[var(--bg-primary)] px-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]">Or sign up with</span></div>
          </div>

          <a href="/api/auth/google"
            className="w-full flex items-center justify-center gap-3 bg-white border border-[var(--border-strong)] rounded-xl py-3 text-sm font-semibold hover:border-black hover:bg-gray-50 transition-all shadow-sm">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.5 30.2 0 24 0 14.7 0 6.8 5.4 3 13.3l7.8 6C12.8 13 17.9 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.9-10 6.9-17z"/>
              <path fill="#FBBC05" d="M10.8 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.7l8.3-6z"/>
              <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.2-8.4 2.2-6.1 0-11.2-4.1-13.1-9.7l-8.3 6C6.8 42.6 14.7 48 24 48z"/>
            </svg>
            Google
          </a>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-black font-bold uppercase tracking-wider text-[11px] ml-2 hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
