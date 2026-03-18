import React, { useState, useEffect } from 'react';
import { Search, Bell, X } from 'lucide-react';

// src/components/ui/PageHeader.jsx
export function PageHeader({ title, subtitle, action, breadcrumbs = [] }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-header sticky top-0 z-30 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-1">
            <span>Dashboard</span>
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={i}>
                <span>/</span>
                <span className={i === breadcrumbs.length - 1 ? 'text-black' : ''}>{b}</span>
              </React.Fragment>
            ))}
          </div>
          <h1 className="font-display text-3xl text-[var(--text-primary)] leading-none">{title}</h1>
        </div>
      </div>

      <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 text-sm font-mono font-medium text-[var(--text-secondary)]">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second:'2-digit' })}
      </div>

      <div className="flex items-center gap-4">
        {action && action}
        <div className="flex items-center gap-3 border-l border-[var(--border)] pl-4 ml-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors">
            <Search size={18} />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[var(--accent-warm)] border-2 border-white"></span>
          </button>
          <div className="w-9 h-9 rounded-full bg-[var(--text-primary)] text-white flex items-center justify-center font-bold text-sm cursor-pointer shadow-sm hover:shadow-md transition-shadow">
            A
          </div>
        </div>
      </div>
    </div>
  )
}

// src/components/ui/StatCard.jsx
export function StatCard({ icon, value, label, trend, trendValue, gradient = 'from-white to-gray-50', iconColor = 'text-black', iconBg = 'bg-gray-100', progress = 0, progressColor = 'bg-black' }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.toString().replace(/[^0-9]/g, '')) || 0;
    if (end === 0) {
      setDisplayValue(value);
      return;
    }
    const duration = 1000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className={`card relative overflow-hidden flex flex-col justify-between p-6 bg-gradient-to-br ${gradient} group`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        {trend && (
          <div className={`badge ${trend === 'up' ? 'badge-green' : 'badge-red'} !py-0.5 !px-2 rounded-full`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </div>
        )}
      </div>
      <div>
        <div className="font-mono text-4xl font-semibold text-[var(--text-primary)] tracking-tight mb-1 animate-spring-up">
          {displayValue}
        </div>
        <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">{label}</div>
      </div>
      
      {/* Target Progress Bar */}
      {progress > 0 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
          <div 
            className={`h-full ${progressColor} transition-all duration-1000 ease-out`} 
            style={{ width: `${progress}%`, left: 0 }}
          />
        </div>
      )}
    </div>
  )
}

// src/components/ui/Table.jsx
export function Table({ headers, children, loading, empty, pagination = true }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                {headers.map(h => (
                  <th key={h} className="px-5 py-4 font-bold select-none cursor-pointer group hover:text-black transition-colors">
                    <div className="flex items-center gap-2">
                      {h}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">↕</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={headers.length} className="px-5 py-12">
                    <div className="space-y-4">
                      <div className="skeleton h-10 w-full rounded"></div>
                      <div className="skeleton h-10 w-full rounded"></div>
                      <div className="skeleton h-10 w-full rounded"></div>
                    </div>
                  </td>
                </tr>
              ) : React.Children.count(children) === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--bg-secondary)] text-gray-300 mb-4 shadow-inner">
                      <Search size={32} />
                    </div>
                    <p className="text-gray-500 font-medium">{empty || "No data available."}</p>
                  </td>
                </tr>
              ) : (
                children
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination Footer */}
      {pagination && !loading && React.Children.count(children) > 0 && (
        <div className="flex items-center justify-between px-2 text-sm text-[var(--text-secondary)]">
          <div>Showing 1 to 10 of 24 results</div>
          <div className="flex items-center gap-2">
            <button className="btn-ghost !px-3 !py-1 !text-sm border border-[var(--border)] bg-white hover:bg-gray-50">Prev</button>
            <button className="btn-ghost !px-3 !py-1 !text-sm border border-[var(--border)] bg-white hover:bg-gray-50">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}

export function Tr({ children, index = 0 }) {
  // Add staggered animation delay based on index
  return (
    <tr 
      className="table-row opacity-0 animate-[fadeIn_0.4s_ease_forwards]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {children}
    </tr>
  )
}

export function Td({ children, className = '' }) {
  return <td className={`px-5 py-4 text-[var(--text-primary)] ${className}`}>{children}</td>
}

// src/components/ui/Badge.jsx
const variants = {
  active:    'badge-green',
  paid:      'badge-green',
  expired:   'badge-red',
  failed:    'badge-red',
  cancelled: 'badge-gray',
  refunded:  'badge-gray',
  pending:   'badge-yellow',
  admin:     'badge-blue',
  trainer:   'badge-blue',
  member:    'badge-gray',
}

export function Badge({ value, dot = false }) {
  const v = String(value).toLowerCase();
  const badgeClass = variants[v] || 'badge-gray';
  
  return (
    <span className={`badge ${badgeClass}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>}
      {value}
    </span>
  )
}

// src/components/ui/Modal.jsx
export function Modal({ open, onClose, title, children, maxWidth = 'max-w-lg' }) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      document.body.style.overflow = 'hidden';
    } else if (mounted) {
      setClosing(true);
      setTimeout(() => {
        setMounted(false);
        document.body.style.overflow = '';
      }, 300); // match transition duration
    }
  }, [open, mounted]);

  if (!mounted) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${closing ? 'opacity-0' : 'opacity-100'}`}>
      <div 
        className={`absolute inset-0 glass-overlay transition-opacity duration-300 ${closing ? 'opacity-0' : 'opacity-100'}`} 
        onClick={onClose} 
      />
      <div className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12),0_8px_20px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col transition-all duration-300 ${closing ? 'scale-95 translate-y-4 opacity-0' : 'scale-100 translate-y-0 opacity-100'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
          <h2 className="font-display text-2xl text-[var(--text-primary)]">{title}</h2>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] hover:bg-gray-200 flex items-center justify-center text-[var(--text-secondary)] hover:text-black transition-all hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  )
}

// src/components/ui/FormField.jsx
export function FormField({ label, children, error }) {
  return (
    <div className="mb-4">
      <label className="block text-[13px] font-bold uppercase tracking-wide text-[var(--text-secondary)] mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs font-semibold text-red-500 animate-fade-in flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500"></span> {error}
        </p>
      )}
    </div>
  )
}
