import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [isFocused, setIsFocused] = useState(null)
  const { login, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {}
  }

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* LEFT PANEL - BRAND EXPERIENCE */}
      <div className="hidden lg:flex flex-1 relative bg-[var(--text-primary)] text-white overflow-hidden p-12 flex-col justify-between">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--accent)]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#ff6b35]/20 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 flex items-center gap-2 font-display text-2xl tracking-widest text-white">
          <Zap size={22} className="text-[var(--accent)]" fill="currentColor" /> IronPulse
        </div>
        
        <div className="relative z-10 max-w-lg mt-20">
          <h1 className="font-display text-6xl leading-[0.9] mb-6">Manage Your Gym <br/><span className="text-[var(--accent)]">At Light Speed</span></h1>
          <p className="text-gray-400 text-lg mb-10">Sign in to access your customized dashboard, manage memberships, and track your business growth.</p>
          
          <div className="space-y-6">
            {[
              "Real-time analytics & reporting",
              "Automated membership renewals",
              "Secure role-based access control"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: `${i * 150}ms` }}>
                <CheckCircle className="text-[var(--accent)]" size={20} />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 mt-auto pt-10">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
            <p className="text-sm italic text-gray-300 mb-4">"IronPulse completely transformed how we operate our chain of 14 gyms. Everything is just one click away."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b35] to-[var(--accent)] flex items-center justify-center font-bold text-black border-2 border-[var(--text-primary)]">S</div>
              <div>
                <div className="text-sm font-bold">Sarah Jenkins</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Owner, Peak Fitness</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - CLEAN FORM */}
      <div className="flex-[1] flex items-center justify-center p-6 sm:p-12 relative bg-[var(--bg-primary)]">
        {/* Mobile Header Logo */}
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2 font-display text-xl tracking-widest text-black">
          <Zap size={18} fill="currentColor" /> IronPulse
        </div>

        <div className="w-full max-w-sm animate-slide-up">
          <div className="mb-8">
            <h2 className="font-display text-4xl mb-2 text-black">Welcome Back</h2>
            <p className="text-[var(--text-secondary)]">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="bg-red-50/80 border-l-4 border-red-500 text-red-700 text-sm px-4 py-3 rounded-lg mb-6 shadow-sm flex items-center gap-3">
              <span className="font-bold flex-1">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Email</label>
              <div className={`relative transition-all duration-300 rounded-xl ${isFocused === 'email' ? 'shadow-[0_0_0_4px_rgba(13,13,13,0.05)]' : ''}`}>
                <input 
                  className="input !border-[var(--border-strong)] !bg-white" 
                  type="email" 
                  placeholder="you@example.com"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  onFocus={() => setIsFocused('email')}
                  onBlur={() => setIsFocused(null)}
                  required 
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Password</label>
                <a href="#" className="text-[11px] font-bold text-black hover:underline hidden">Forgot?</a>
              </div>
              <div className={`relative transition-all duration-300 rounded-xl ${isFocused === 'password' ? 'shadow-[0_0_0_4px_rgba(13,13,13,0.05)]' : ''}`}>
                <input 
                  className="input !border-[var(--border-strong)] !bg-white pr-10" 
                  type={showPw ? 'text' : 'password'} 
                  placeholder="••••••••"
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
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
            
            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3.5 text-sm uppercase tracking-wider mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border-strong)]"/></div>
            <div className="relative text-center"><span className="bg-[var(--bg-primary)] px-4 text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)]">Or continue with</span></div>
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
            Don't have an account?{' '}
            <Link to="/signup" className="text-black font-bold uppercase tracking-wider text-[11px] ml-2 hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
