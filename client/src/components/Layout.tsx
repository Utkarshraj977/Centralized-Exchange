import { Outlet } from 'react-router-dom'
import { Header } from './home/Header'

export const Layout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <footer>
        <div className="justify-between items-center text-center py-4 bg-gray-100 text-gray-600">
          <p>&copy; 2026 DCEX. All rights reserved.</p>
          <p>Built with Utkarsh Raj</p>
        </div>
      </footer>
    </div>
  )
}
