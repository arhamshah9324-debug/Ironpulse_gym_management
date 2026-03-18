import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import { Users, Dumbbell, RefreshCw, CheckSquare, CreditCard, AlertCircle, TrendingUp, TrendingDown, Clock } from 'lucide-react'
import { PageHeader, StatCard } from '../ui/index.jsx'
import api from '../../lib/api'
import { getUser } from '../../lib/auth'

const weekDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const mockWeek = weekDays.map((d) => ({ day: d, visits: Math.floor(30 + Math.random()*70) }))
const mockActivity = [
  { id: 1, action: 'New member joined: Sarah Jenkins', time: '10 mins ago', type: 'member' },
  { id: 2, action: 'Payment received: ₹4,999', time: '1 hour ago', type: 'payment' },
  { id: 3, action: 'Subscription expired: John Doe', time: '3 hours ago', type: 'alert' },
  { id: 4, action: 'Trainer added: Michael Chang', time: '5 hours ago', type: 'trainer' },
  { id: 5, action: 'System backup completed', time: '1 day ago', type: 'system' }
]

const COLORS = ['#16a34a', '#d97706', '#dc2626', '#a0a0a0']

export default function Overview() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const user = getUser()

  useEffect(() => {
    // Wrap in try-catch to simulate if API fails to load specific stats
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats')
        setStats(res.data)
      } catch (err) {
        console.error(err)
        // Fallback for UI visualization if API isn't returning data properly yet
        setStats({
          total_members: 248, total_trainers: 12, active_subscriptions: 184,
          today_attendance: 45, total_revenue: 125000, pending_payments: 3,
          expiring_soon: 14
        })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const pieData = stats ? [
    { name: 'Active', value: stats.active_subscriptions || 184 },
    { name: 'Expiring', value: stats.expiring_soon || 14 },
    { name: 'Failed', value: stats.pending_payments || 3 },
    { name: 'Inactive', value: Math.max(0, (stats.total_members || 248) - (stats.active_subscriptions || 184)) }
  ] : []

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl border border-[var(--border)] shadow-lg">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">{label}</p>
          <p className="font-mono text-xl text-black">
            {payload[0].value} <span className="text-sm font-sans text-gray-400">visits</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="pb-12">
      <PageHeader title="Overview" breadcrumbs={['Overview']} />
      
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">

        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl text-[var(--text-primary)] leading-none mb-1">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'Admin'} <span className="inline-block animate-[bounce_2s_infinite]">👋</span>
            </h1>
            <p className="text-[var(--text-secondary)] font-medium text-sm">Here's what's happening at your gym today, {today}.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-[var(--bg-primary)] flex items-center justify-center text-xs font-bold text-white z-${10-i}`} style={{backgroundColor: ['#0d0d0d','#ff6b35','#16a34a'][i-1]}}>
                  {['SJ','MD','AK'][i-1]}
                </div>
              ))}
            </div>
            <span className="text-xs font-bold text-[var(--text-secondary)]">+24 active now</span>
          </div>
        </div>

        {/* Asymmetric Stat Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array(6).fill().map((_, i) => (
              <div key={i} className={`skeleton h-40 rounded-2xl ${i < 2 ? 'md:col-span-2' : ''}`}></div>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <StatCard 
                icon={<Users size={24} />} 
                value={stats.total_members} 
                label="Total Members" 
                trend="up" trendValue="12%" 
                gradient="from-[#0d0d0d] to-[#2a2a2a]" 
                iconBg="bg-white/10" iconColor="text-[var(--accent)]" 
                progress={75} progressColor="bg-[var(--accent)]"
              />
            </div>
            <div className="md:col-span-2">
              <StatCard 
                icon={<CreditCard size={24} />} 
                value={`₹${Number(stats.total_revenue).toLocaleString()}`} 
                label="Monthly Revenue" 
                trend="up" trendValue="8.5%" 
                gradient="from-[#ff6b35] to-[#f9551c]" 
                iconBg="bg-white/20" iconColor="text-white"
                progress={88} progressColor="bg-white"
              />
            </div>
            <StatCard icon={<RefreshCw size={20} />} value={stats.active_subscriptions} label="Active Subs" iconBg="bg-green-100" iconColor="text-green-600" />
            <StatCard icon={<CheckSquare size={20} />} value={stats.today_attendance} label="Today Ins" iconBg="bg-yellow-100" iconColor="text-yellow-600" />
            <StatCard icon={<AlertCircle size={20} />} value={stats.expiring_soon} label="Expiring" iconBg="bg-red-100" iconColor="text-red-600" />
            <StatCard icon={<Dumbbell size={20} />} value={stats.total_trainers} label="Trainers" iconBg="bg-purple-100" iconColor="text-purple-600" />
          </div>
        ) : null}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 card p-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-1">Attendance Trend</h3>
                <div className="font-display text-3xl">This Week</div>
              </div>
              <div className="flex gap-2">
                <button className="badge badge-gray !bg-black !text-white !border-black hover:-translate-y-0.5 transition-transform cursor-pointer">Week</button>
                <button className="badge badge-gray hover:bg-gray-100 hover:-translate-y-0.5 transition-transform cursor-pointer">Month</button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockWeek} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e3de" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#a0a0a0', fontFamily: 'DM Sans' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#a0a0a0', fontFamily: 'DM Sans' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5f3' }} />
                <Bar 
                  dataKey="visits" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {mockWeek.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === new Date().getDay() - 1 ? 'var(--accent-warm)' : '#0d0d0d'} className="hover:opacity-80 transition-opacity cursor-pointer delay-75" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-6 flex flex-col">
            {/* Donut Chart */}
            <div className="card p-6 flex-1 flex flex-col">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-4">Subscription Status</h3>
              <div className="flex-1 relative min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                      animationDuration={1500}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius:8, border:'1px solid var(--border)', fontFamily:'DM Sans', fontSize:12, fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="font-mono text-2xl font-bold">{stats?.total_members || 248}</div>
                  <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Total</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {pieData.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-[var(--text-secondary)]">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }}></span>
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6 flex-1 drop-shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">Recent Activity</h3>
                <button className="text-[var(--text-muted)] hover:text-black transition-colors"><Clock size={16}/></button>
              </div>
              <div className="space-y-4">
                {mockActivity.map((activity, i) => (
                  <div key={activity.id} className="flex items-start gap-3 group">
                    <div className="relative mt-1">
                      <div className={`w-2 h-2 rounded-full z-10 relative ${
                        activity.type === 'payment' ? 'bg-green-500' :
                        activity.type === 'alert' ? 'bg-red-500' :
                        activity.type === 'trainer' ? 'bg-purple-500' :
                        activity.type === 'system' ? 'bg-gray-400' : 'bg-[var(--accent-warm)]'
                      }`}></div>
                      {i !== mockActivity.length - 1 && (
                        <div className="absolute top-2 left-1/2 -ml-[1px] w-[2px] h-8 bg-[var(--border)] group-hover:bg-gray-300 transition-colors"></div>
                      )}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-[var(--text-primary)] leading-snug">{activity.action}</div>
                      <div className="text-[10px] uppercase tracking-wider font-bold text-[var(--text-muted)] mt-1">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
