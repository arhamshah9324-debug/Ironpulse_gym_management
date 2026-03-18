import { Routes, Route } from 'react-router-dom'
import Sidebar   from '../components/layout/Sidebar'
import Overview  from '../components/dashboard/Overview'
import Members   from '../components/dashboard/Members'
import Trainers  from '../components/dashboard/Trainers'
import Plans     from '../components/dashboard/Plans'
import Subs      from '../components/dashboard/Subscriptions'
import Attendance from '../components/dashboard/Attendance'
import Payments  from '../components/dashboard/Payments'

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] overflow-hidden">
      <Sidebar />
      <main className="flex-1 relative h-screen overflow-y-auto overflow-x-hidden bg-[var(--bg-primary)] bg-dashboard-grid scroll-smooth">
        <Routes>
          <Route index                  element={<Overview />}   />
          <Route path="members"         element={<Members />}    />
          <Route path="trainers"        element={<Trainers />}   />
          <Route path="plans"           element={<Plans />}      />
          <Route path="subscriptions"   element={<Subs />}       />
          <Route path="attendance"      element={<Attendance />} />
          <Route path="payments"        element={<Payments />}   />
        </Routes>
      </main>
    </div>
  )
}
