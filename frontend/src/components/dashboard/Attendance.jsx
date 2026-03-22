import { useEffect, useState } from 'react'
import { LogIn, LogOut, Filter, Clock } from 'lucide-react'
import { PageHeader, Table, Tr, Td, Modal, FormField, Badge } from '../ui/index.jsx'
import { useToast } from '../../hooks/useToast'
import api from '../../lib/api'

export default function Attendance() {
  const [records, setRecords] = useState([])
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)
  const [filterDate, setFilterDate] = useState('')
  const [modal, setModal]     = useState(false)
  const [userId, setUserId]   = useState('')
  const [notes, setNotes]     = useState('')
  const { toast } = useToast()

  const load = () => {
    setLoading(true)
    const q = filterDate ? `?filter_date=${filterDate}` : ''
    api.get(`/attendance/${q}`).then(r => setRecords(r.data)).finally(() => setLoading(false))
  }
  useEffect(load, [filterDate])

  const filtered = records.filter(r => !search || String(r.user_id).includes(search))

  const checkIn = async e => {
    e.preventDefault()
    try {
      await api.post('/attendance/checkin', { user_id: Number(userId), notes: notes || null })
      toast.success(`Member #${userId} successfully checked in`)
      setModal(false); setUserId(''); setNotes(''); load()
    } catch(e) { toast.error(e.response?.data?.detail || 'Check-in failed') }
  }

  const checkOut = async id => {
    try { 
      await api.post('/attendance/checkout', { attendance_id: id })
      toast.success('Member checked out')
      load() 
    }
    catch(e) { toast.error(e.response?.data?.detail || 'Check-out failed') }
  }

  const fmt = dt => dt ? new Date(dt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) : '—'

  return (
    <div className="pb-12">
      <PageHeader 
        title="Attendance & Access" 
        breadcrumbs={['Activity', 'Attendance']}
        searchValue={search}
        onSearch={setSearch}
        action={
          <button className="btn-primary bg-[var(--green)] text-white hover:bg-green-700 shadow-lg shadow-green-500/20 !border-transparent whitespace-nowrap" onClick={() => setModal(true)}>
            <LogIn size={18}/> Check In
          </button>
        } 
      />
      
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[var(--border)] shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-[#f5f5f3] flex items-center justify-center text-gray-400 border border-[var(--border)]">
            <Filter size={18} />
          </div>
          <input 
            type="date" 
            className="input !border-transparent hover:!border-[var(--border-strong)] focus:!border-black bg-[#f5f5f3] max-w-[200px]"
            value={filterDate} 
            onChange={e => setFilterDate(e.target.value)} 
          />
          {filterDate && (
            <button className="btn-ghost text-xs uppercase font-bold tracking-wider" onClick={() => setFilterDate('')}>Clear Filter</button>
          )}
          <div className="ml-auto flex items-center gap-2 px-4">
            <Badge value="active" dot /> <span className="text-[11px] font-bold text-[var(--text-secondary)]">{records.filter(r => !r.check_out).length} in facility</span>
          </div>
        </div>

        <Table headers={['Member','Date','Arrival time','Departure time','Session Duration','Status']} loading={loading} empty="No attendance records found." pagination={false}>	
          {filtered.map((a, index) => {
            const minutes = a.check_in && a.check_out ? Math.round((new Date(a.check_out) - new Date(a.check_in)) / 60000) : 0
            const duration = a.check_in && a.check_out
              ? `${Math.floor(minutes/60)}h ${minutes%60}m`
              : a.check_in ? 'In Facility' : '—'
              
            return (
              <Tr key={a.id} index={index}>
                <Td>
                  <div className="font-bold text-[13px] text-black">Member #{a.user_id}</div>
                </Td>
                <Td>
                  <div className="text-[12px] font-semibold text-[var(--text-secondary)]">{a.date}</div>
                </Td>
                <Td>
                  <div className="flex items-center gap-2 font-mono text-sm text-[var(--text-primary)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    {fmt(a.check_in)}
                  </div>
                </Td>
                <Td>
                  <div className="flex items-center gap-2 font-mono text-sm text-[var(--text-secondary)]">
                    {a.check_out ? (
                      <><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> {fmt(a.check_out)}</>
                    ) : '—'}
                  </div>
                </Td>
                <Td>
                  <div className="flex items-center gap-1.5 text-[12px] font-semibold">
                    <Clock size={14} className="text-gray-400" />
                    <span className={!a.check_out ? 'text-[var(--text-primary)] animate-[pulse_2s_infinite]' : 'text-[var(--text-secondary)]'}>{duration}</span>
                  </div>
                </Td>
                <Td>
                  {!a.check_out ? (
                    <button onClick={() => checkOut(a.id)} className="btn-outline !py-1.5 !px-4 text-[11px] uppercase tracking-wider font-bold">
                      <LogOut size={14} className="mr-1"/> End Session
                    </button>
                  ) : (
                    <Badge value="paid" /> 
                  )}
                </Td>
              </Tr>
            )
          })}
        </Table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title="Manual Check-In">
        <form onSubmit={checkIn} className="space-y-4">
          <FormField label="Member ID *">
            <input className="input font-mono text-lg" type="number" placeholder="Scan or type ID" value={userId} onChange={e => setUserId(e.target.value)} required autoFocus />
          </FormField>
          <FormField label="Notes / Equipment">
            <input className="input" placeholder="e.g. Guest pass, PT Session..." value={notes} onChange={e => setNotes(e.target.value)} />
          </FormField>
          <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border)] mt-6">
            <button type="button" className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary bg-green-600 !border-green-600 text-white hover:bg-green-700">Admit Member</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
