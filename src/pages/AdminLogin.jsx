import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext.jsx'

export default function AdminLogin() {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/admin/productos')
    } catch (err) {
      setError('Correo o contraseña incorrectos.')
    }
  }

  if (user) {
    return (
      <div className="max-w-sm mx-auto px-6 py-20 text-center">
        <p className="font-display text-2xl text-pine mb-4">Sesión activa como {user.email}</p>
        <div className="flex flex-col gap-3">
          <a href="/admin/productos" className="bg-pine text-paper py-2 rounded-full text-sm font-body">
            Ir a productos
          </a>
          <a href="/admin/ordenes" className="bg-ink/10 text-ink py-2 rounded-full text-sm font-body">
            Ver órdenes
          </a>
          <button onClick={logout} className="text-clay text-sm font-body mt-2">
            Cerrar sesión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-20">
      <h1 className="font-display text-3xl text-pine mb-6 text-center">Acceso administrador</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-ink/20 rounded-lg px-3 py-2 text-sm bg-white/70 focus:border-clay outline-none"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-ink/20 rounded-lg px-3 py-2 text-sm bg-white/70 focus:border-clay outline-none"
        />
        {error && <p className="text-clay text-sm">{error}</p>}
        <button className="w-full bg-pine text-paper py-2 rounded-full text-sm font-body font-medium">
          Entrar
        </button>
      </form>
    </div>
  )
}
