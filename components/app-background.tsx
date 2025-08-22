interface AppBackgroundProps {
  children: React.ReactNode
  variant?: 'default' | 'subtle' | 'auth'
  className?: string
}

export function AppBackground({ 
  children, 
  variant = 'default',
  className = '' 
}: AppBackgroundProps) {
  // Auth pages get the noise pattern, others get solid theme colors
  if (variant === 'auth') {
    return (
      <div className={`min-h-screen w-full bg-black relative ${className}`}>
        {/* Dark Noise Colored Background for auth pages only */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "#000000",
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),
              radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),
              radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0)
            `,
            backgroundSize: "20px 20px, 30px 30px, 25px 25px",
            backgroundPosition: "0 0, 10px 10px, 15px 5px",
            opacity: 1
          }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }

  // For non-auth pages, use solid theme-based colors
  return (
    <div className={`min-h-screen w-full bg-background ${className}`}>
      {children}
    </div>
  )
}