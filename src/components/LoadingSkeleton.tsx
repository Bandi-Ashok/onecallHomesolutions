import React from 'react'

interface LoadingSkeletonProps {
  count?: number
  className?: string
  height?: string
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 1,
  className = '',
  height = 'h-12',
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${height} bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse ${className}`}
        />
      ))}
    </>
  )
}

export default LoadingSkeleton
