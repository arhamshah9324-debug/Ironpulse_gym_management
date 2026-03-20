import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Award, Clock } from 'lucide-react'
import { PageHeader, Badge } from '../components/ui/index.jsx'
import api from '../lib/api'

export default function TrainerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trainer, setTrainer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/trainers/${id}`)
      .then(res => setTrainer(res.data))
      .catch(() => navigate('/dashboard/trainers'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) return <div className="p-12 flex justify-center"><div className="w-8 h-8 border-4 border-black border-r-transparent rounded-full animate-spin"></div></div>
  if (!trainer) return null

  return (
    <div className="pb-12">
      <PageHeader 
        title={trainer.user?.name || `Trainer #${trainer.user_id}`}
        breadcrumbs={['Dashboard', 'Trainers', 'Profile']}
        action={
          <div className="flex gap-2">
            <button className="btn-ghost shadow-sm" onClick={() => navigate('/dashboard/trainers')}>
              <ArrowLeft size={16} /> Back
            </button>
          </div>
        }
      />

      <div className="max-w-5xl mx-auto px-8 py-8 animate-fade-in space-y-8">
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
          </div>
        </div>
      </div>
    </div>
  )
}
