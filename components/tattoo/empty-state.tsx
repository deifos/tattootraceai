"use client"

import { Upload } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex items-center justify-center text-gray-500 w-full h-96">
      <div className="text-center">
        <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Upload a base image to get started</p>
      </div>
    </div>
  )
}