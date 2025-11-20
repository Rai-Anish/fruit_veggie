import { cn } from '@/lib/utils'
import React from 'react'
type Props = {
  icon: React.ElementType
  size?: number
  stroke?: number
  color?: string
  className?: string
}

export const AppIcon = ({
  icon: Icon,
  size = 24,

  color = 'currentColor',
  className,
}: Props) => {
  return <Icon size={size} className={cn(className)} color={color} />
}
