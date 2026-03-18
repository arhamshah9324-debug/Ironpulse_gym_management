import { useEffect, useState } from 'react'
import { Plus, Trash2, Search, MoreVertical } from 'lucide-react'
import { PageHeader, Table, Tr, Td, Modal, FormField, Badge } from '../ui/index.jsx'
import { useToast } from '../../hooks/useToast'
import api from '../../lib/api'

export default function Trainers() {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [search, setSearch]     = useState('')
  const { toast } = useToast()
  const [form, setForm]         = useState({
    user_id:'', phone:'', specialization:'', experience_years:'', hourly_rate:'', certifications:'', bio:''
  })

  const load = () => {
    setLoading(true)
    api.get('/trainers/').then(r => setTrainers(r.data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const filtered = trainers.filter(t => 
    String(t.user_id).includes(search) || (t.specialization || '').toLowerCase().includes(search.toLowerCase())
  )

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    try {
      const body = {
        ...Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])),
        user_id: Number(form.user_id),
        experience_years: Number(form.experience_years) || 0,
        hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : undefined,
      }
      await api.post('/trainers/', body)
      toast.success('Trainer profile created')
      setModal(false)
      setForm({ user_id:'', phone:'', specialization:'', experience_years:'', hourly_rate:'', certifications:'', bio:'' })
      load()
    } catch(e) { toast.error(e.response?.data?.detail || 'Failed to create trainer') }
  }

  const del = async id => {
    if (!confirm('Are you sure you want to delete this trainer?')) return
    await api.delete(`/trainers/${id}`)
    toast.success('Trainer removed')
    load()
  }

  return (
    <div className="pb-12">
      <PageHeader 
        title="Trainers" 
        breadcrumbs={['Operations', 'Trainers']}
        action={
          <button className="btn-primary shadow-lg shadow-[var(--accent)]/20" onClick={() => setModal(true)}>
            <Plus size={18}/> New Trainer
          </button>
        } 
      />
      
      <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-3 rounded-xl border border-[var(--border)] shadow-sm">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search trainers..." 
              className="w-full pl-10 pr-4 py-2.5 bg-[#f5f5f3] border-transparent rounded-lg text-sm outline-none transition-all focus:bg-white focus:border-black focus:shadow-[0_0_0_2px_rgba(13,13,13,0.1)] border"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Table headers={['Trainer','Specialization','Experience','Rate/Hr','Certifications','Actions']} loading={loading}>
          {filtered.map((t, index) => (
            <Tr key={t.id} index={index}>
              <Td>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 border border-purple-300 flex items-center justify-center font-bold text-purple-700 text-sm">
                    T
                  </div>
                  <div>
                    <div className="font-bold text-[13px] text-black">Trainer #{t.user_id}</div>
                    <div className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">ID: {t.user_id}</div>
                  </div>
                </div>
              </Td>
              <Td>
                {t.specialization ? <Badge value="trainer" /> : <span className="text-gray-400">—</span>}
                <div className="text-[13px] font-medium text-[var(--text-primary)] mt-1">{t.specialization || ''}</div>
              </Td>
              <Td>
                <div className="text-[13px] font-bold">{t.experience_years || 0} <span className="text-gray-400 font-normal">yrs</span></div>
              </Td>
              <Td>
                {t.hourly_rate ? <span className="font-mono text-[13px] font-semibold">₹{t.hourly_rate}</span> : '—'}
              </Td>
              <Td>
                <div className="max-w-[200px] truncate text-[12px] text-[var(--text-secondary)]" title={t.certifications}>
                  {t.certifications || '—'}
                </div>
              </Td>
              <Td>
                <div className="flex items-center gap-2">
                  <button onClick={() => del(t.id)} className="btn-danger-ghost !px-2 !py-2"><Trash2 size={16}/></button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Add Trainer Profile">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="User ID *"><input className="input" type="number" value={form.user_id} onChange={set('user_id')} required /></FormField>
            <FormField label="Phone"><input className="input font-mono" value={form.phone} onChange={set('phone')} /></FormField>
          </div>
          <FormField label="Specialization"><input className="input" placeholder="e.g. Strength & Conditioning" value={form.specialization} onChange={set('specialization')} /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Experience (years)"><input className="input" type="number" value={form.experience_years} onChange={set('experience_years')} /></FormField>
            <FormField label="Hourly Rate (₹)"><input className="input" type="number" step="0.01" value={form.hourly_rate} onChange={set('hourly_rate')} /></FormField>
          </div>
          <FormField label="Certifications"><input className="input" placeholder="NASM-CPT, ACE..." value={form.certifications} onChange={set('certifications')} /></FormField>
          <FormField label="Bio"><textarea className="input resize-none h-24" value={form.bio} onChange={set('bio')} /></FormField>
          <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border)] mt-6">
            <button type="button" className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Create Profile</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
