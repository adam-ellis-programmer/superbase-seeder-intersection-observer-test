'use client'
import React, { useEffect, useRef, useState } from 'react'

const LazyImage = ({ item }) => {
  const [isInView, setIsInView] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
          }
        })
      },
      { threshold: 0.1 } // Reduced threshold for better UX
    )
    
    if (listRef.current) {
      observer.observe(listRef.current)
    }
    
    return () => observer.disconnect()
  }, [])

  return (
    <li ref={listRef} className='h-screen relative mb-5'>
      {!isInView && (
        <div className='absolute inset-0 bg-[#5e819f] flex justify-center items-center text-3xl text-white'>
          Loading...
        </div>
      )}
      {isInView && (
        <img
          src={item.url}
          alt={item.title || 'Travel product'}
          onLoad={() => setIsLoaded(true)}
          className={`h-full w-full object-cover rounded-md shadow-sm transition-opacity duration-700 ease-in-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </li>
  )
}

export default LazyImage