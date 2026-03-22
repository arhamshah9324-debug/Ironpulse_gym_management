import { useEffect, useState } from 'react'
import { Plus, CheckCircle } from 'lucide-react'
import { PageHeader, Table, Tr, Td, Badge, Modal, FormField } from '../ui/index.jsx'
import { useToast } from '../../hooks/useToast'
import api from '../../lib/api'

export default function Payments() {
  const [payments, setPayments] = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const { toast } = useToast()
  const [form, setForm]         = useState({
    user_id:'', amount:'', method:'card', subscription_id:'', transaction_id:'', notes:''
  })

  const load = () => {
    setLoading(true)
    api.get('/payments/').then(r => setPayments(r.data)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const filtered = payments.filter(p => !search || String(p.user_id).includes(search) || (p.transaction_id || '').toLowerCase().includes(search.toLowerCase()))

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    try {
      const body = {
        user_id: Number(form.user_id),
        amount:  Number(form.amount),
        method:  form.method,
        ...(form.subscription_id && { subscription_id: Number(form.subscription_id) }),
        ...(form.transaction_id  && { transaction_id: form.transaction_id }),
        ...(form.notes           && { notes: form.notes }),
      }
      await api.post('/payments/', body)
      toast.success('Payment recorded successfully')
      setModal(false)
      setForm({ user_id:'', amount:'', method:'card', subscription_id:'', transaction_id:'', notes:'' })
      load()
    } catch(e) { toast.error(e.response?.data?.detail || 'Failed to record payment') }
  }

  const markPaid = async id => {
    try { 
      await api.put(`/payments/${id}`, { status: 'paid' })
      toast.success('Invoice marked as paid')
      load() 
    }
    catch(e) { toast.error(e.response?.data?.detail || 'Failed to update status') }
  }

  const methodLabel = { cash:'💵 Cash', card:'💳 Card', upi:'📱 UPI', bank_transfer:'🏦 Transfer', other:'Other' }

  return (
    <div className="pb-12">
      <PageHeader 
        title="Revenue & Billing" 
        breadcrumbs={['Activity', 'Payments']}
        searchValue={search}
        onSearch={setSearch}
        action={<button className="btn-primary shadow-lg shadow-[var(--accent)]/20 whitespace-nowrap" onClick={() => setModal(true)}><Plus size={18}/> Record Payment</button>} 
      />
      <div className="p-8 max-w-7xl mx-auto">
        <Table headers={['Member','Amount','Method & REF','Date','Status','Actions']} loading={loading}>
          {filtered.map((p, index) => (
            <Tr key={p.id} index={index}>
              <Td>
                <div className="font-bold text-[13px] text-black">Member #{p.user_id}</div>
              </Td>
              <Td>
                <div className="font-display text-2xl text-[var(--accent-warm)] leading-none">₹{p.amount}</div>
              </Td>
              <Td>
                <div className="flex flex-col gap-1">
                  <div className="text-[12px] font-bold text-[var(--text-primary)]">{methodLabel[p.method] || p.method}</div>
                  {p.transaction_id && <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">REF: {p.transaction_id}</div>}
                </div>
              </Td>
              <Td>
                <div className="text-[12px] font-semibold text-[var(--text-secondary)]">
                  {p.paid_at ? new Date(p.paid_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                </div>
              </Td>
              <Td><Badge value={p.status} dot /></Td>
              <Td>
                {p.status === 'pending' && (
                  <button onClick={() => markPaid(p.id)} className="btn-outline !py-1.5 !px-3 text-[10px] font-bold uppercase tracking-wider text-green-600 hover:bg-green-50 hover:!border-green-600 flex items-center gap-1.5">
                    <CheckCircle size={14}/> Settle Invoice
                  </button>
                )}
              </Td>
            </Tr>
          ))}
        </Table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Record Manual Payment">
        <form onSubmit={submit} className="space-y-4">
          <div className="bg-[#f5f5f3] p-6 rounded-xl border border-[var(--border)] mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Amount to collect (₹)</label>
            </div>
            <input className="w-full bg-transparent font-display text-5xl text-black outline-none placeholder-gray-300" type="number" step="0.01" placeholder="0.00" value={form.amount} onChange={set('amount')} required autoFocus />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Member ID *"><input className="input" type="number" value={form.user_id} onChange={set('user_id')} required /></FormField>
            <FormField label="Payment Method">
              <select className="input appearance-none" value={form.method} onChange={set('method')}>
                <option value="card">Credit / Debit Card</option>
                <option value="upi">UPI / Mobile App</option>
                <option value="cash">Cash Physical</option>
                <option value="bank_transfer">Wire / Bank Transfer</option>
                <option value="other">Other Method</option>
              </select>
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Assign to Subscription (ID)"><input className="input" type="number" placeholder="Optional sub ID" value={form.subscription_id} onChange={set('subscription_id')} /></FormField>
            <FormField label="Transaction Receipt ID"><input className="input font-mono" placeholder="Optional REF" value={form.transaction_id} onChange={set('transaction_id')} /></FormField>
          </div>
          <FormField label="Internal Notes"><input className="input" placeholder="e.g. First month upfront..." value={form.notes} onChange={set('notes')} /></FormField>
          <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border)] mt-6">
            <button type="button" className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Process Payment</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
