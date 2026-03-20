import { useEffect, useState } from 'react'
import { Plus, Trash2, Search, Filter, MoreVertical, X, User } from 'lucide-react'
import { PageHeader, Table, Tr, Td, Modal, FormField, Badge } from '../ui/index.jsx'
import { useToast } from '../../hooks/useToast'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'

// src/components/dashboard/Members.jsx
export default function Members() {
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [slideOver, setSlideOver] = useState(null)
  const [form, setForm]       = useState({ name:'', email:'', phone:'', join_date:'', date_of_birth:'', address:'' })
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('All')
  const { toast } = useToast()

  const load = () => {
    setLoading(true)
    api.get('/members/').then(r => setMembers(r.data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const filteredMembers = members.filter(m => {
    const matchesSearch = String(m.user_id).includes(search) || (m.phone || '').includes(search)
    return matchesSearch
  })

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    try {
      // 1. Create User
      const userRes = await api.post('/auth/signup', {
        name: form.name, email: form.email, password: 'password123', role: 'member'
      })
      const userId = userRes.data.user.id
      
      // 2. Create Member Profile
      const { name, email, ...memberFields } = form
      const body = { 
        ...Object.fromEntries(Object.entries(memberFields).map(([k, v]) => [k, v === '' ? null : v])),
        user_id: userId 
      }
      await api.post('/members/', body)
      toast.success('Member created successfully')
      setModal(false); setForm({ name:'', email:'', phone:'', join_date:'', date_of_birth:'', address:'' }); load()
    } catch(e) { 
      toast.error(e.response?.data?.detail || 'Failed to create member')
    }
  }

  const del = async id => {
    // Custom logic would go here in a real app (with a custom modal), but sticking to simple delete for now
    if (!confirm('Are you entirely sure you want to delete this member?')) return
    await api.delete(`/members/${id}`)
    toast.success('Member deleted')
    load()
  }

  return (
    <div className="pb-12 relative flex">
      <div className={`flex-1 transition-all duration-300 ${slideOver ? 'mr-[440px]' : ''}`}>
        <PageHeader 
          title="Members" 
          breadcrumbs={['Operations', 'Members']}
          action={
            <button className="btn-primary shadow-lg shadow-[var(--accent)]/20" onClick={() => setModal(true)}>
              <Plus size={18}/> New Member
            </button>
          } 
        />
        
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-5 border-l-4 border-l-black">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Total Members</div>
              <div className="font-display text-4xl leading-none text-black">{members.length}</div>
            </div>
            <div className="card p-5 border-l-4 border-l-[var(--green)]">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Active Today</div>
              <div className="font-display text-4xl leading-none text-black">{Math.floor(members.length * 0.7)}</div>
            </div>
            <div className="card p-5 border-l-4 border-l-[var(--accent-warm)]">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Expiring Soon</div>
              <div className="font-display text-4xl leading-none text-black">12</div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-3 rounded-xl border border-[var(--border)] shadow-sm">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search by ID or phone..." 
                className="w-full pl-10 pr-4 py-2.5 bg-[#f5f5f3] border-transparent rounded-lg text-sm outline-none transition-all focus:bg-white focus:border-black focus:shadow-[0_0_0_2px_rgba(13,13,13,0.1)] border"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              {['All', 'Active', 'Expired', 'No Plan'].map(pill => (
                <button 
                  key={pill}
                  onClick={() => setFilter(pill)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                    filter === pill 
                      ? 'bg-black text-[var(--accent)] shadow-sm' 
                      : 'bg-white text-[var(--text-secondary)] border border-[var(--border)] hover:bg-[#f5f5f3] hover:text-black'
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          <Table headers={['Member','Contact','Join Date','Status','Actions']} loading={loading} empty="No members found matching your search.">
            {filteredMembers.map((m, index) => (
              <Tr key={m.id} index={index} onClick={() => navigate(`/dashboard/members/${m.id}`)}>
                <Td>
                  <div className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f5f5f3] to-[#e5e3de] border border-[var(--border)] flex items-center justify-center font-bold text-[var(--text-primary)] text-sm group-hover:scale-110 transition-transform">
                      {m.user?.name ? m.user.name[0].toUpperCase() : 'M'}
                    </div>
                    <div>
                      <div className="font-bold text-[13px] text-black group-hover:text-[var(--accent-warm)] transition-colors">{m.user?.name || `Member #${m.user_id}`}</div>
                      <div className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">{m.user?.email || `ID: ${m.user_id}`}</div>
                    </div>
                  </div>
                </Td>
                <Td>
                  {m.phone ? (
                    <div className="font-mono text-xs text-[var(--text-secondary)]">{m.phone}</div>
                  ) : (
                    <span className="text-[11px] italic text-gray-400">Not provided</span>
                  )}
                </Td>
                <Td>
                  <div className="text-[13px] font-medium text-[var(--text-primary)]">{m.join_date || '—'}</div>
                </Td>
                <Td>
                  <Badge value="active" dot />
                </Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSlideOver(m)} className="btn-ghost !px-2 !py-2 hover:bg-black hover:text-[var(--accent)]"><MoreVertical size={16}/></button>
                    <button onClick={() => del(m.id)} className="btn-danger-ghost !px-2 !py-2"><Trash2 size={16}/></button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        </div>
      </div>

      {/* Slide-over Detail Panel */}
      {slideOver && (
        <div className="fixed inset-y-0 right-0 w-[440px] bg-white border-l border-[var(--border)] shadow-[-20px_0_60px_rgba(0,0,0,0.08)] z-40 flex flex-col slide-over-enter">
          <div className="absolute top-4 right-4 z-10">
            <button onClick={() => setSlideOver(null)} className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {/* Header Profile */}
            <div className="px-8 pt-12 pb-8 border-b border-[var(--border)] bg-dashboard-grid">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-black to-gray-800 text-[var(--accent)] flex items-center justify-center font-display text-4xl mb-4 border-4 border-white shadow-md">
                {slideOver.user?.name ? slideOver.user.name[0].toUpperCase() : 'M'}
              </div>
              <h2 className="font-display text-3xl mb-1">{slideOver.user?.name || `Member #${slideOver.user_id}`}</h2>
              <div className="flex gap-2">
                <Badge value="active" dot />
                <Badge value="member" />
              </div>
            </div>

            {/* Tabs (Visual only for now, mock UI) */}
            <div className="px-8 pt-4 border-b border-[var(--border)] flex gap-6 text-[11px] font-bold uppercase tracking-widest relative">
              <button className="pb-3 text-black border-b-2 border-black">Overview</button>
              <button className="pb-3 text-gray-400 hover:text-black transition-colors">Subscriptions</button>
              <button className="pb-3 text-gray-400 hover:text-black transition-colors">Attendance</button>
              <button className="pb-3 text-gray-400 hover:text-black transition-colors">Payments</button>
            </div>

            {/* Content Overview */}
            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-4">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f9f8f6] p-4 rounded-xl border border-[var(--border)]">
                    <div className="text-xs text-gray-500 mb-1">Phone</div>
                    <div className="font-mono text-sm font-semibold">{slideOver.phone || '—'}</div>
                  </div>
                  <div className="bg-[#f9f8f6] p-4 rounded-xl border border-[var(--border)]">
                    <div className="text-xs text-gray-500 mb-1">Join Date</div>
                    <div className="font-mono text-sm font-semibold">{slideOver.join_date || '—'}</div>
                  </div>
                  <div className="col-span-2 bg-[#f9f8f6] p-4 rounded-xl border border-[var(--border)]">
                    <div className="text-xs text-gray-500 mb-1">Address</div>
                    <div className="text-sm font-semibold">{slideOver.address || '—'}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-4">Quick Actions</h3>
                <div className="flex flex-col gap-2">
                  <button className="btn-outline w-full justify-between">
                    <span>Add New Subscription</span> <Plus size={16}/>
                  </button>
                  <button className="btn-outline w-full justify-between">
                    <span>Record Payment</span> <CreditCard size={16}/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay when slideOver is open to allow clicking out */}
      {slideOver && (
        <div 
          className="fixed inset-0 z-30 bg-black/10 backdrop-blur-[1px] cursor-pointer" 
          onClick={() => setSlideOver(null)}
        />
      )}

      {/* ADD MEMBER MODAL */}
      <Modal open={modal} onClose={() => setModal(false)} title="Add New Member">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Full Name *">
              <input className="input" type="text" value={form.name} onChange={set('name')} placeholder="e.g. John Doe" required />
            </FormField>
            <FormField label="Email Address *">
              <input className="input" type="email" value={form.email} onChange={set('email')} placeholder="john@example.com" required />
            </FormField>
            <FormField label="Phone">
              <input className="input font-mono" type="tel" value={form.phone} onChange={set('phone')} placeholder="+91..." />
            </FormField>
            <FormField label="Join Date">
              <input className="input" type="date" value={form.join_date} onChange={set('join_date')} />
            </FormField>
            <FormField label="Date of Birth">
              <input className="input" type="date" value={form.date_of_birth} onChange={set('date_of_birth')} />
            </FormField>
          </div>
          <FormField label="Address">
            <textarea className="input resize-none h-24" value={form.address} onChange={set('address')} placeholder="Full address..." />
          </FormField>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border)] mt-6">
            <button type="button" className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Create Member</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
