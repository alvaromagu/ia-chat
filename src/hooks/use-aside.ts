import { useEffect, useState } from 'react'

export function useAside() {
  const [isAsideOpen, setIsAsideOpen] = useState(false)

  useEffect(() => {
    function handleSmallDevice () {
      setIsAsideOpen(false)
    }

    // resize with media query
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    mediaQuery.addEventListener('change', handleSmallDevice)

    return () => {
      mediaQuery.removeEventListener('change', handleSmallDevice)
    }
  }, [])

  return { isAsideOpen, setIsAsideOpen }
}