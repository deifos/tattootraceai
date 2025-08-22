"use client"

import { useState } from "react"
import { Button } from "@heroui/button"
import { Download, Loader2 } from "lucide-react"

interface DownloadButtonProps {
  src: string
  filename?: string
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost"
  size?: "sm" | "md" | "lg"
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger"
  isIconOnly?: boolean
  className?: string
  children?: React.ReactNode
}

export function DownloadButton({
  src,
  filename,
  variant = "flat",
  size = "md",
  color = "primary",
  isIconOnly = false,
  className = "",
  children
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (isDownloading) return
    
    setIsDownloading(true)
    try {
      // Fetch the image as a blob to handle CORS properly
      const response = await fetch(src);
      const blob = await response.blob();

      // Create a URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || `generated-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to simple download
      const link = document.createElement('a');
      link.href = src;
      link.download = filename || `generated-image-${Date.now()}.jpg`;
      link.target = '_blank';
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      color={color}
      isIconOnly={isIconOnly}
      className={className}
      onPress={handleDownload}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        children || <Download className="w-4 h-4" />
      )}
    </Button>
  );
}