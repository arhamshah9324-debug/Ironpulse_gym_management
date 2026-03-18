// src/components/layout/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import { Zap, LayoutDashboard, Users, Dumbbell, ClipboardList, RefreshCw, CheckSquare, CreditCard, LogOut } from 'lucide-react'
import { clearAuth, getUser } from '../../lib/auth'
import clsx from 'clsx'

const INACTIVE_CLASS = 'text-[var(--text-secondary)] hover:text-black hover:bg-[var(--bg-secondary)]'
const ACTIVE_CLASS = 'bg-[var(--text-primary)] text-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] border-l-4 border-l-[var(--accent)] font-semibold'

const menuGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard',              icon: <LayoutDashboard size={18}/>, label: 'Dashboard' }
    ]
  },
  {
    label: 'Operations',
    items: [
      { to: '/dashboard/members',      icon: <Users size={18}/>,           label: 'Members'       },
      { to: '/dashboard/trainers',     icon: <Dumbbell size={18}/>,        label: 'Trainers'      },
      { to: '/dashboard/plans',        icon: <ClipboardList size={18}/>,   label: 'Plans'         },
      { to: '/dashboard/subscriptions',icon: <RefreshCw size={18}/>,       label: 'Subscriptions' },
    ]
  },
  {
    label: 'Activity',
    items: [
      { to: '/dashboard/attendance',   icon: <CheckSquare size={18}/>,     label: 'Attendance'    },
      { to: '/dashboard/payments',     icon: <CreditCard size={18}/>,      label: 'Payments'      },
    ]
  }
]

export default function Sidebar() {
  const user = getUser()
  const navigate = useNavigate()

  const logout = () => { clearAuth(); navigate('/') }

  return (
    <aside className="w-64 bg-white border-r border-[var(--border)] shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col h-screen sticky top-0 shrink-0 relative z-40">
      {/* Accent Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--accent)]"></div>

      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-[var(--border)] mt-1">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-[var(--accent)] shadow-sm">
          <Zap size={18} fill="currentColor" />
        </div>
        <div>
          <div className="font-display text-2xl leading-none text-black tracking-wide">IronPulse</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[#a0a0a0]">Management</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-6">
        {menuGroups.map((group, i) => (
          <div key={i}>
            <div className="px-2 mb-2 text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
              {group.label}
            </div>
            <div className="space-y-1">
              {group.items.map(({ to, icon, label }) => (
                <NavLink key={to} to={to} end={to === '/dashboard'}
                  className={({ isActive }) => clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 relative overflow-hidden group',
                    isActive ? ACTIVE_CLASS : INACTIVE_CLASS
                  )}>
                  <span className={clsx("transition-transform duration-200 group-hover:scale-110", "relative z-10")}>
                    {icon}
                  </span>
                  <span className="relative z-10">{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-primary)]">
        <div className="card !shadow-none !border-[var(--border)] p-3 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
              {(user.name || 'U')[0].toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-bold text-black truncate">{user.name || 'Admin User'}</div>
              <div className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{user.role}</div>
            </div>
          </div>
          <button onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-[var(--bg-secondary)] hover:bg-gray-200 hover:text-black text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wider transition-colors pt-2.5">
            <LogOut size={14} className="mt-[-2px]" /> Logout
          </button>
        </div>
      </div>
    </aside>
  )
}
