import { useEffect, useState } from 'react'
import { Plus, Ban, AlertCircle } from 'lucide-react'
import { PageHeader, Table, Tr, Td, Badge, Modal, FormField } from '../ui/index.jsx'
import { useToast } from '../../hooks/useToast'
import api from '../../lib/api'

export default function Subscriptions() {
  const [subs, setSubs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const { toast } = useToast()
  const [form, setForm]       = useState({
    member_id:'', plan_id:'', start_date:'', end_date:'', status:'active'
  })

  const load = () => {
    setLoading(true)
    api.get('/subscriptions/').then(r => setSubs(r.data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    try {
      await api.post('/subscriptions/', {
        ...Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])),
        member_id: Number(form.member_id),
        plan_id:   Number(form.plan_id),
      })
      toast.success('Subscription activated')
      setModal(false)
      setForm({ member_id:'', plan_id:'', start_date:'', end_date:'', status:'active' })
      load()
    } catch(e) { toast.error(e.response?.data?.detail || 'Failed to activate') }
  }

  const cancel = async id => {
    if (!confirm('Are you sure you want to immediately cancel this subscription?')) return
    await api.put(`/subscriptions/${id}`, { status: 'cancelled' })
    toast.success('Subscription cancelled')
    load()
  }

  const daysLeft = endDate => {
    const diff = Math.ceil((new Date(endDate) - new Date()) / 86400000)
    if (diff < 0) return <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2 py-1 rounded w-fit text-[11px] font-bold tracking-wider uppercase"><AlertCircle size={12}/>Expired {Math.abs(diff)}d ago</div>
    if (diff <= 7) return <div className="flex items-center gap-1.5 text-[var(--accent-warm)] bg-orange-50 px-2 py-1 rounded w-fit text-[11px] font-bold tracking-wider uppercase"><span className="w-1.5 h-1.5 rounded-full bg-current"></span>{diff}d left</div>
    return <div className="text-[13px] font-semibold text-[var(--text-secondary)]">{diff} days remaining</div>
  }

  return (
    <div className="pb-12">
      <PageHeader 
        title="Subscriptions" 
        breadcrumbs={['Operations', 'Subscriptions']}
        action={<button className="btn-primary shadow-lg shadow-[var(--accent)]/20" onClick={() => setModal(true)}><Plus size={18}/> Assign Plan</button>} 
      />
      <div className="p-8 max-w-7xl mx-auto animate-fade-in">
        <Table headers={['Member','Plan ID','Period','Days Remaining','Status','Actions']} loading={loading}>
          {subs.map((s, index) => (
            <Tr key={s.id} index={index}>
              <Td>
                <div className="font-bold text-[13px] text-black">Member #{s.member_id}</div>
              </Td>
              <Td>
                <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] bg-[#f5f5f3] px-2 py-1 rounded w-fit border border-[var(--border)]">
                  Plan #{s.plan_id}
                </div>
              </Td>
              <Td>
                <div className="text-[12px] text-[var(--text-secondary)]">
                  {s.start_date} <span className="text-gray-300 mx-1">→</span> <span className="text-black font-semibold">{s.end_date}</span>
                </div>
              </Td>
              <Td>{daysLeft(s.end_date)}</Td>
              <Td><Badge value={s.status} dot /></Td>
              <Td>
                {s.status === 'active' && (
                  <button onClick={() => cancel(s.id)} className="btn-danger-ghost !px-3 font-semibold text-[11px] uppercase tracking-wider">
                    <Ban size={14} className="mr-1"/> Cancel
                  </button>
                )}
              </Td>
            </Tr>
          ))}
        </Table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Assign Subscription">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Member ID *"><input className="input" type="number" value={form.member_id} onChange={set('member_id')} required /></FormField>
            <FormField label="Plan ID *"><input className="input" type="number" value={form.plan_id} onChange={set('plan_id')} required /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Date *"><input className="input" type="date" value={form.start_date} onChange={set('start_date')} required /></FormField>
            <FormField label="End Date *"><input className="input" type="date" value={form.end_date} onChange={set('end_date')} required /></FormField>
          </div>
          <FormField label="Status">
            <select className="input appearance-none" value={form.status} onChange={set('status')}>
              <option value="active">Active (Immediate)</option>
              <option value="pending">Pending (Future)</option>
            </select>
          </FormField>
          <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border)] mt-6">
            <button type="button" className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Activate Sub</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
