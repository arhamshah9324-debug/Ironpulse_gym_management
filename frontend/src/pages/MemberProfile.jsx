import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, CalendarDays, CreditCard, Activity } from 'lucide-react'
import { PageHeader, Badge, Modal, FormField } from '../components/ui/index.jsx'
import { useToast } from '../hooks/useToast'
import api from '../lib/api'

export default function MemberProfile({ isSelf = false }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [trainers, setTrainers] = useState([])
  const [memberAttendance, setMemberAttendance] = useState([])
  const [attendanceLoading, setAttendanceLoading] = useState(true)
  const [memberSubscriptions, setMemberSubscriptions] = useState([])
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(true)
  const [editModal, setEditModal] = useState(false)
  const [form, setForm] = useState({})

  const loadProfile = async () => {
    setLoading(true)
    setAttendanceLoading(true)
    setSubscriptionsLoading(true)
    try {
      
      const url = isSelf ? '/members/me' : `/members/${id}`
      const [mRes, tRes] = await Promise.all([
        api.get(url),
        api.get(`/trainers/`)
      ])
      const memberData = mRes.data
      setMember(memberData)
      setForm(memberData)
      setTrainers(tRes.data)

      
      try {
        const attRes = await api.get(`/attendance/user/${memberData.user_id}?skip=0&limit=5`)
        setMemberAttendance(attRes.data || [])
      } catch(attError) {
        console.warn('Could not load attendance:', attError.message)
        setMemberAttendance([])
      }

      
      try {
        const subRes = await api.get(`/subscriptions/member/${memberData.id}`)
        setMemberSubscriptions(subRes.data || [])
      } catch(subError) {
        console.warn('Could not load subscriptions:', subError.message)
        setMemberSubscriptions([])
      }
    } catch(e) {
      console.error('Error loading profile:', e)
      if (!isSelf) navigate('/dashboard/members')
    } finally {
      setLoading(false)
      setAttendanceLoading(false)
      setSubscriptionsLoading(false)
    }
  }

  useEffect(() => { 
    loadProfile() 
  }, [id, isSelf, navigate])

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (payload.trainer_id === '') payload.trainer_id = null;
      const url = isSelf ? `/members/${member.id}` : `/members/${id}`
      await api.put(url, payload);
      setEditModal(false);
      loadProfile();
      toast.success('Profile updated successfully')
    } catch(err) { 
      console.error('Update error:', err)
      toast.error(err.response?.data?.detail || 'Failed to update profile')
    }
  }

  const setF = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  
  const assignedTrainer = member?.trainer_id ? trainers.find(t => t.id === member?.trainer_id) : null

  if (loading) return <div className="p-12 flex justify-center"><div className="w-8 h-8 border-4 border-black border-r-transparent rounded-full animate-spin"></div></div>
  if (!member) return null

  return (
    <div className="pb-12">
      <PageHeader 
        title={member?.user?.name || `Member #${member?.id || 'Unknown'}`}
        breadcrumbs={['Dashboard', 'Members', 'Profile']}
        action={
          <div className="flex gap-2">
            {!isSelf && (
              <>
                <button className="btn-ghost shadow-sm" onClick={() => navigate('/dashboard/members')}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button className="btn-primary shadow-lg shadow-[var(--accent)]/20" onClick={() => setEditModal(true)}>
                  <Edit size={16} /> Edit Profile
                </button>
              </>
            )}
          </div>
        }
      />

      <div className="max-w-5xl mx-auto px-8 py-8 space-y-8">
        {}
        <div className="card p-8 bg-gradient-to-br from-white to-gray-50 flex items-start gap-8 relative overflow-hidden">
          <div className="w-32 h-32 rounded-full bg-black text-[var(--accent)] flex items-center justify-center font-display text-6xl shadow-xl z-10 shrink-0">
            {member?.user?.name?.charAt(0).toUpperCase() || 'M'}
          </div>
          <div className="z-10 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-4xl leading-none text-black">{member?.user?.name || `Member #${member?.id || 'Unknown'}`}</h1>
              <Badge value="active" dot />
            </div>
            <div className="text-gray-500 font-mono text-sm mb-6">{member?.user?.email || 'No email provided'} • ID: {member?.user_id || member?.id || 'Unknown'}</div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Phone</div>
                <div className="font-mono font-medium">{member?.phone || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Join Date</div>
                <div className="font-medium">{member?.join_date || '—'}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Address</div>
                <div className="font-medium truncate" title={member?.address}>{member?.address || '—'}</div>
              </div>
            </div>
          </div>
          {}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[var(--accent)] rounded-full blur-3xl opacity-10"></div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
             <div className="card p-6">
               <div className="flex items-center gap-2 mb-6 border-b border-[var(--border)] pb-4">
                 <Activity size={20} className="text-[var(--text-secondary)]" />
                 <h2 className="font-display text-2xl text-[var(--text-primary)]">Recent Attendance</h2>
               </div>
               {attendanceLoading ? (
                 <div className="space-y-3">
                   <div className="skeleton h-10 w-full rounded"></div>
                   <div className="skeleton h-10 w-full rounded"></div>
                 </div>
               ) : memberAttendance.length > 0 ? (
                 <div className="divide-y divide-[var(--border)]">
                   {Array.isArray(memberAttendance) && memberAttendance.slice(0,5).map((a) => (
                     <div key={a.id} className="py-4 first:pt-0">
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-sm font-mono text-[var(--text-secondary)]">{a.date}</span>
                         <Badge value={a.check_out ? "paid" : "active"} />
                       </div>
                       <div className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
                         <span className="w-2 h-2 rounded-full bg-green-500"></span>
                         {a.check_in ? new Date(a.check_in).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}
                         {a.check_out && (
                           <>
                             <span className="w-1 h-1 mx-2 bg-[var(--border)] rounded-full"></span>
                             <span className="w-2 h-2 rounded-full bg-red-500"></span>
                             <span>{new Date(a.check_out).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                           </>
                         )}
                       </div>
                       {a.notes && <div className="text-xs text-gray-500 mt-1 italic">{a.notes}</div>}
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-10 text-gray-500 text-sm">
                   No recent attendance logs.
                 </div>
               )}
             </div>
          </div>
          <div className="space-y-6">
            <div className="card p-6 bg-black text-white">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays size={20} className="text-[var(--accent)]" />
                <h2 className="font-display text-2xl">Active Plan</h2>
              </div>
              {subscriptionsLoading ? (
                <div className="space-y-3">
                  <div className="skeleton h-12 w-full rounded bg-white/10"></div>
                  <div className="skeleton h-8 w-3/4 rounded bg-white/10"></div>
                </div>
              ) : memberSubscriptions && memberSubscriptions.some(s => s.status === 'active') ? (
                <div className="space-y-3">
                  {Array.isArray(memberSubscriptions) && memberSubscriptions.filter(s => s?.status === 'active').slice(0,1).map(s => (
                    <div key={s.id}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold text-lg">{s.plan?.name || 'Unknown Plan'}</div>
                          <div className="text-xs uppercase tracking-wider text-gray-300">{s.plan?.price || '0'}/mo • {s.plan?.duration_months || '0'} months</div>
                        </div>
                        <Badge value="active" />
                      </div>
                      <div className="text-xs text-gray-300 space-y-1">
                        <div>Valid until {s.end_date ? new Date(s.end_date).toLocaleDateString() : 'Unknown'}</div>
                        <div className="font-mono">{s.start_date || '—'} → {s.end_date || '—'}</div>
                      </div>
                    </div>
                  ))}
                  <button className="w-full mt-4 btn-outline border-white/30 text-white/90 hover:bg-white/10 hover:border-white/50 transition-all">View All Plans</button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-6">No active subscription. Assign a plan to grant gym access.</p>
                  <button className="w-full py-2 rounded-lg bg-[var(--accent)] text-black font-bold hover:bg-[var(--accent-hover)] transition-colors">Assign Plan</button>
                </div>
              )}
            </div>
            
            {}
            <div className="card p-6 border-t-4 border-t-purple-500">
              <h2 className="font-bold text-sm uppercase tracking-widest text-[var(--text-secondary)] mb-4">Assigned Trainer</h2>
              {assignedTrainer ? (
                <div 
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-[var(--border)] cursor-pointer hover:border-black transition-colors"
                  onClick={() => navigate(`/dashboard/trainers/${assignedTrainer?.id}`)}
                >
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                    {assignedTrainer?.user?.name?.charAt(0).toUpperCase() || 'T'}
                  </div>
                  <div>
                    <div className="font-bold text-black text-sm">{assignedTrainer?.user?.name || 'Unknown Trainer'}</div>
                    <div className="text-xs text-purple-600 font-medium">{assignedTrainer?.specialization || 'Personal Trainer'}</div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 italic pb-2">No trainer currently assigned.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit Member Profile">
        <form onSubmit={submitEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Phone">
              <input className="input font-mono" type="tel" value={form.phone || ''} onChange={setF('phone')} />
            </FormField>
            <FormField label="Join Date">
              <input className="input" type="date" value={form.join_date || ''} onChange={setF('join_date')} />
            </FormField>
            <FormField label="Emergency Contact">
              <input className="input" type="text" value={form.emergency_contact || ''} onChange={setF('emergency_contact')} />
            </FormField>
            <FormField label="Emergency Phone">
              <input className="input font-mono" type="tel" value={form.emergency_phone || ''} onChange={setF('emergency_phone')} />
            </FormField>
          </div>
          
          <FormField label="Assigned Trainer">
            <select className="input" value={form.trainer_id || ''} onChange={setF('trainer_id')}>
              <option value="">-- No Trainer Assigned --</option>
              {Array.isArray(trainers) && trainers.map(t => (
                <option key={t?.id} value={t?.id}>{t?.user?.name || `Trainer #${t?.id || 'N/A'}`}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Address">
            <textarea className="input resize-none h-20" value={form.address || ''} onChange={setF('address')} />
          </FormField>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border)] mt-6">
            <button type="button" className="btn-ghost" onClick={() => setEditModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
