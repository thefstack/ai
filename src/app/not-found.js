'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import styles from '@/css/NotFound.module.css'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        router.back()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [router])

  return (
    <div className={styles['not-found-container']}>
      <div className={styles['not-found-content']}>
        <div className={styles['error-icon']}>!</div>
        <h1 className={styles['error-code']}>404</h1>
        <h2 className={styles['error-message']}>Page Not Found</h2>
        <p className={styles['error-description']}>
          Oops! The page you're looking for doesn't exist.
        </p>
        <button onClick={() => router.back()} className={styles['back-button']}>
          ← Go Back
        </button>
      </div>
    </div>
  )
}
