import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar   from '../components/layout/Sidebar'
import Overview  from '../components/dashboard/Overview'
import Members   from '../components/dashboard/Members'
import Trainers  from '../components/dashboard/Trainers'
import Plans     from '../components/dashboard/Plans'
import Subs      from '../components/dashboard/Subscriptions'
import Attendance from '../components/dashboard/Attendance'
import Payments  from '../components/dashboard/Payments'
import MemberProfile from './MemberProfile'
import TrainerProfile from './TrainerProfile'
import { getUser } from '../lib/auth'

export default function Dashboard() {
  const user = getUser()
  const role = user.role?.toLowerCase() || 'admin'

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] overflow-hidden">
      <Sidebar />
      <main className="flex-1 relative h-screen overflow-y-auto overflow-x-hidden bg-[var(--bg-primary)] bg-dashboard-grid scroll-smooth">
        <Routes>
          {role === 'admin' && <Route index element={<Overview />} />}
          {role === 'member' && <Route index element={<MemberProfile isSelf />} />}
          {role === 'trainer' && <Route index element={<TrainerProfile isSelf />} />}

          {(role === 'admin' || role === 'trainer') && <Route path="members" element={<Members />} />}
          {(role === 'admin' || role === 'trainer') && <Route path="members/:id" element={<MemberProfile />} />}
          
          {role === 'admin' && <Route path="trainers" element={<Trainers />} />}
          {role === 'admin' && <Route path="trainers/:id" element={<TrainerProfile />} />}
          
          {(role === 'admin' || role === 'member') && <Route path="plans" element={<Plans />} />}
          {(role === 'admin' || role === 'member') && <Route path="subscriptions" element={<Subs />} />}
          {(role === 'admin' || role === 'member') && <Route path="payments" element={<Payments />} />}

          <Route path="attendance" element={<Attendance />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}
