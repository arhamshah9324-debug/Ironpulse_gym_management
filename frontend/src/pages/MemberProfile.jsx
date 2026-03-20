import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, CalendarDays, CreditCard, Activity } from 'lucide-react'
import { PageHeader, Badge } from '../components/ui/index.jsx'
import api from '../lib/api'

export default function MemberProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/members/${id}`)
      .then(res => setMember(res.data))
      .catch(() => navigate('/dashboard/members'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) return <div className="p-12 flex justify-center"><div className="w-8 h-8 border-4 border-black border-r-transparent rounded-full animate-spin"></div></div>
  if (!member) return null

  return (
    <div className="pb-12">
      <PageHeader 
        title={member.user?.name || `Member #${member.user_id}`}
        breadcrumbs={['Dashboard', 'Members', 'Profile']}
        action={
          <div className="flex gap-2">
            <button className="btn-ghost shadow-sm" onClick={() => navigate('/dashboard/members')}>
              <ArrowLeft size={16} /> Back
            </button>
            <button className="btn-primary shadow-lg shadow-[var(--accent)]/20">
              <Edit size={16} /> Edit Profile
            </button>
          </div>
        }
      />

      <div className="max-w-5xl mx-auto px-8 py-8 animate-fade-in space-y-8">
        {/* Profile Card */}
        <div className="card p-8 bg-gradient-to-br from-white to-gray-50 flex items-start gap-8 relative overflow-hidden">
          <div className="w-32 h-32 rounded-full bg-black text-[var(--accent)] flex items-center justify-center font-display text-6xl shadow-xl z-10 shrink-0">
            {member.user?.name ? member.user.name[0].toUpperCase() : 'M'}
          </div>
          <div className="z-10 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-4xl leading-none text-black">{member.user?.name || `Member #${member.user_id}`}</h1>
              <Badge value="active" dot />
            </div>
            <div className="text-gray-500 font-mono text-sm mb-6">{member.user?.email || 'No email provided'} • ID: {member.user_id}</div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Phone</div>
                <div className="font-mono font-medium">{member.phone || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Join Date</div>
                <div className="font-medium">{member.join_date || '—'}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Address</div>
                <div className="font-medium truncate" title={member.address}>{member.address || '—'}</div>
              </div>
            </div>
          </div>
          {/* Decorative background circle */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[var(--accent)] rounded-full blur-3xl opacity-10"></div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
             <div className="card p-6">
               <div className="flex items-center gap-2 mb-6 border-b border-[var(--border)] pb-4">
                 <Activity size={20} className="text-[var(--text-secondary)]" />
                 <h2 className="font-display text-2xl text-[var(--text-primary)]">Recent Attendance</h2>
               </div>
               <div className="text-center py-10 text-gray-500 text-sm">
                 Attendance logs for this member will appear here.
               </div>
             </div>
          </div>
          <div className="space-y-6">
            <div className="card p-6 bg-black text-white">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays size={20} className="text-[var(--accent)]" />
                <h2 className="font-display text-2xl">Active Plan</h2>
              </div>
              <p className="text-gray-400 text-sm mb-4">No active subscription found. Assign a plan to this member to grant gym access.</p>
              <button className="w-full py-2 rounded-lg bg-[var(--accent)] text-black font-bold hover:bg-[var(--accent-hover)] transition-colors">Assign Plan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
