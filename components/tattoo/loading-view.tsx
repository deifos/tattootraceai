"use client"

import { Loader2 } from "lucide-react"

export function LoadingView() {
  return (
    <div className="flex items-center justify-center text-gray-500 w-full h-96">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
        <p>Loading images...</p>
      </div>
    </div>
  )
}