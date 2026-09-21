import { useState } from 'react'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

function App() {
  const [view, setView] = useState<'login' | 'register'>('login')

  return (
    <AuthProvider>
      <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center items-center">
        {view === 'login' ? (
          <LoginForm onRegisterClick={() => setView('register')} />
        ) : (
          <RegisterForm onLoginClick={() => setView('login')} />
        )}
      </main>
    </AuthProvider>
  )
}

export default App
