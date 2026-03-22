import { useEffect, useState } from 'react'
import { Plus, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { PageHeader, Table, Tr, Td, Modal, FormField, Badge } from '../ui/index.jsx'
import { useToast } from '../../hooks/useToast'
import api from '../../lib/api'

export default function Plans() {
  const [plans, setPlans]     = useState([])
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState({
    name:'', duration_days:'', price:'', features:'', description:'', is_active: true
  })
  const { toast } = useToast()

  const load = () => {
    setLoading(true)
    api.get('/plans/').then(r => setPlans(r.data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const filtered = plans.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    try {
      await api.post('/plans/', {
        ...Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])),
        duration_days: Number(form.duration_days),
        price: Number(form.price),
        is_active: true,
      })
      toast.success('Plan created')
      setModal(false)
      setForm({ name:'', duration_days:'', price:'', features:'', description:'' })
      load()
    } catch(e) { toast.error(e.response?.data?.detail || 'Failed to create plan') }
  }

  const del = async id => {
    if (!confirm('Are you sure you want to delete this plan?')) return
    await api.delete(`/plans/${id}`)
    toast.success('Plan deleted')
    load()
  }

  return (
    <div className="pb-12">
      <PageHeader 
        title="Plans" 
        breadcrumbs={['Operations', 'Plans']}
        searchValue={search}
        onSearch={setSearch}
        action={<button className="btn-primary shadow-lg shadow-[var(--accent)]/20" onClick={() => setModal(true)}><Plus size={18}/> Add Plan</button>} 
      />
      <div className="p-8 max-w-7xl mx-auto">
        <Table headers={['Plan Name','Duration','Price','Features','Status','Actions']} loading={loading}>
          {filtered.map((p, index) => (
            <Tr key={p.id} index={index}>
              <Td>
                <div className="font-display text-xl text-black tracking-wide">{p.name}</div>
              </Td>
              <Td>
                <div className="text-[13px] font-bold text-[var(--text-secondary)]">{p.duration_days} <span className="font-normal text-gray-400">days</span></div>
              </Td>
              <Td>
                <div className="font-display text-2xl text-[var(--accent-warm)]">₹{p.price}</div>
              </Td>
              <Td className="max-w-[250px]">
                <div className="flex flex-wrap gap-1.5">
                  {(p.features || '').split(',').filter(Boolean).map(f => (
                    <span key={f} className="inline-block px-2 py-0.5 bg-[#f5f5f3] border border-[var(--border)] rounded flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                      <CheckCircle size={10} className="text-black"/> {f.trim()}
                    </span>
                  ))}
                </div>
              </Td>
              <Td>
                {p.is_active ? <Badge value="active" dot /> : <Badge value="cancelled" />}
              </Td>
              <Td>
                <button onClick={() => del(p.id)} className="btn-danger-ghost !px-2 !py-2"><Trash2 size={16}/></button>
              </Td>
            </Tr>
          ))}
        </Table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Create Membership Plan">
        <form onSubmit={submit} className="space-y-4">
          <FormField label="Plan Name *"><input className="input font-display text-xl h-14" placeholder="e.g. Premium Elite" value={form.name} onChange={set('name')} required /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Duration (days) *"><input className="input" type="number" placeholder="30" value={form.duration_days} onChange={set('duration_days')} required /></FormField>
            <FormField label="Price (₹) *"><input className="input" type="number" step="0.01" placeholder="59.99" value={form.price} onChange={set('price')} required /></FormField>
          </div>
          <FormField label="Features">
            <input className="input" placeholder="Comma separated: Gym Access, Sauna..." value={form.features} onChange={set('features')} />
          </FormField>
          <FormField label="Description"><textarea className="input resize-none h-24" placeholder="Brief description visible to members..." value={form.description} onChange={set('description')} /></FormField>
          <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border)] mt-6">
            <button type="button" className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Plan</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
