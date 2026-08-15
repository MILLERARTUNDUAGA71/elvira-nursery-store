import { Routes, Route, Link, NavLink } from 'react-router-dom'
import Store from './pages/Store.jsx'
import CartPage from './pages/CartPage.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import Admin from './pages/Admin.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminOrders from './pages/AdminOrders.jsx'
import { useCart } from './lib/CartContext.jsx'

function Header() {
  const { count } = useCart()
  return (
    <header className="border-b-2 border-rule/40 bg-paper/95 sticky top-0 z-30 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-mono-tag text-[11px] tracking-widest text-rule uppercase">Vivero</span>
          <span className="font-display text-2xl sm:text-3xl font-semibold text-pine tracking-tight">
            Elvira Nursery
          </span>
        </Link>
        <nav className="flex items-center gap-5 font-body text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hidden sm:inline hover:text-clay transition-colors ${isActive ? 'text-clay font-semibold' : 'text-ink/70'}`
            }
          >
            Catálogo
          </NavLink>
          <Link
            to="/carrito"
            className="relative inline-flex items-center gap-2 border border-ink/20 rounded-full px-4 py-1.5 hover:border-clay hover:text-clay transition-colors"
          >
            Carrito
            {count > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-semibold bg-clay text-paper rounded-full">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-rule/40 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink/60 font-body">
        <p>Elvira Nursery — inventario y precios sujetos a disponibilidad.</p>
        <Link to="/admin" className="hover:text-clay transition-colors">
          Acceso administrador
        </Link>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Store />} />
          <Route path="/carrito" element={<CartPage />} />
          <Route path="/orden/:orderId" element={<OrderSuccess />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/productos" element={<Admin />} />
          <Route path="/admin/ordenes" element={<AdminOrders />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
