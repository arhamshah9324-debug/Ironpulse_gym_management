import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Award, Clock } from 'lucide-react'
import { PageHeader, Badge, Modal, FormField, Table, Tr, Td } from '../components/ui/index.jsx'
import api from '../lib/api'

export default function TrainerProfile({ isSelf = false }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trainer, setTrainer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState([])
  const [editModal, setEditModal] = useState(false)
  const [form, setForm] = useState({})

  const loadProfile = () => {
    setLoading(true)
    const url = isSelf ? '/trainers/me' : `/trainers/${id}`
    Promise.all([
      api.get(url),
      api.get(`/members/`)
    ]).then(([tRes, mRes]) => {
      setTrainer(tRes.data)
      setForm(tRes.data)
      setMembers(mRes.data.filter(m => m.trainer_id === tRes.data.id || m.trainer?.id === tRes.data.id))
    }).catch(() => {
      if (!isSelf) navigate('/dashboard/trainers')
    })
    .finally(() => setLoading(false))
  }

  useEffect(() => { loadProfile() }, [id, navigate])

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      const url = isSelf ? `/trainers/${trainer.id}` : `/trainers/${id}`;
      await api.put(url, form);
      setEditModal(false);
      loadProfile();
    } catch(err) { console.error(err) }
  }

  const setF = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  if (loading) return <div className="p-12 flex justify-center"><div className="w-8 h-8 border-4 border-black border-r-transparent rounded-full animate-spin"></div></div>
  if (!trainer) return null

  return (
    <div className="pb-12">
      <PageHeader 
        title={trainer?.user?.name || `Trainer #${trainer?.user_id || trainer?.id || 'Unknown'}`}
        breadcrumbs={['Dashboard', 'Trainers', 'Profile']}
        action={
          <div className="flex gap-2">
            {!isSelf && (
              <>
                <button className="btn-ghost shadow-sm" onClick={() => navigate('/dashboard/trainers')}>
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
        <div className="card p-8 bg-gradient-to-br from-purple-50 to-white flex items-start gap-8 border-l-4 border-l-purple-500">
          <div className="w-24 h-24 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-display text-5xl shadow-lg shrink-0">
            {trainer.user?.name ? trainer.user.name[0].toUpperCase() : 'T'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-4xl leading-none text-black">{trainer.user?.name || `Trainer #${trainer.user_id}`}</h1>
              <Badge value="trainer" />
            </div>
            <div className="text-purple-600 font-bold mb-4">{trainer.specialization || 'General Fitness'}</div>
            
            <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-6">
              {trainer.bio || "No biography provided for this trainer."}
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white p-5 rounded-xl border border-[var(--border)] shadow-sm">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1 flex items-center gap-1"><Award size={12}/> Certifications</div>
                <div className="font-medium text-sm truncate" title={trainer.certifications}>{trainer.certifications || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1 flex items-center gap-1"><Clock size={12}/> Experience</div>
                <div className="font-medium text-sm">{trainer.experience_years} years</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Hourly Rate</div>
                <div className="font-mono font-medium text-sm">₹{trainer.hourly_rate || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Contact</div>
                <div className="font-mono text-sm">{trainer.phone || '—'}</div>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="font-display text-2xl text-[var(--text-primary)] mb-4">Assigned Members ({members.length})</h2>
              <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
                <Table headers={['Member','Contact','Join Date']} loading={false} empty="No members assigned to this trainer yet.">
                  {members.map((m, i) => (
                    <Tr key={m.id} index={i} onClick={() => navigate(`/dashboard/members/${m.id}`)}>
                      <Td>
                        <div className="font-bold text-black">{m.user?.name || `Member #${m.user_id}`}</div>
                      </Td>
                      <Td><span className="font-mono text-xs">{m.phone || '—'}</span></Td>
                      <Td><span className="text-sm">{m.join_date || '—'}</span></Td>
                    </Tr>
                  ))}
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={editModal} onClose={() => setEditModal(false)} title="Edit Trainer Profile">
        <form onSubmit={submitEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Phone">
              <input className="input font-mono" type="tel" value={form.phone || ''} onChange={setF('phone')} />
            </FormField>
            <FormField label="Specialization">
              <input className="input" type="text" value={form.specialization || ''} onChange={setF('specialization')} />
            </FormField>
            <FormField label="Experience (Years)">
              <input className="input" type="number" value={form.experience_years || 0} onChange={setF('experience_years')} />
            </FormField>
            <FormField label="Hourly Rate (₹)">
              <input className="input" type="number" step="0.01" value={form.hourly_rate || ''} onChange={setF('hourly_rate')} />
            </FormField>
          </div>
          <FormField label="Certifications (Comma separated)">
            <input className="input" type="text" value={form.certifications || ''} onChange={setF('certifications')} />
          </FormField>
          <FormField label="Biography">
            <textarea className="input resize-none h-24" value={form.bio || ''} onChange={setF('bio')} />
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
