import { AppBackground } from './app-background'

interface AuthBackgroundProps {
  children: React.ReactNode
}

export function AuthBackground({ children }: AuthBackgroundProps) {
  return (
    <AppBackground variant="auth">
      {children}
    </AppBackground>
  )
}