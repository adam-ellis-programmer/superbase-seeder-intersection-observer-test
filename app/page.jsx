'use client'
import Link from 'next/link'
import LazyImage from '@/components/LazyImage'
import { getData } from '@/actions/main'
import { useEffect, useState, useRef, useCallback } from 'react'

export default function Home() {
  const triggerDiv = useRef()
  const [data, setData] = useState([])
  // initial load with page 0 ( gets us items [0,1,2,3,4,5,6,7,8,9])
  // ten itmes initialy loaded fro server
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const [total, setTotal] = useState(0)

  // Function to load more data
  const loadMoreData = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const result = await getData(page)

      // take what ever is in the data array adn add on the result.data
      // which will be another 10 items
      setData((prev) => [...prev, ...result.data])
      // update the hasMore boolesn
      setHasMore(result.hasMore)
      // update the total brought back from the results array
      setTotal(result.total)
      // set page number to what it was before + 1
      setPage((prev) => prev + 1)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore])

  // Initial load
  useEffect(() => {
    loadMoreData()
  }, []) // Only run once on mount

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loading && hasMore) {
          console.log('Loading more items...')
          loadMoreData()
        }
      })
    }

    const options = {
      root: null, // Use viewport as root
      rootMargin: '100px', // Trigger 100px before reaching the element
      threshold: 0.1,
    }

    const observer = new IntersectionObserver(callback, options)

    if (triggerDiv.current) {
      observer.observe(triggerDiv.current)
    }

    return () => {
      if (triggerDiv.current) {
        observer.unobserve(triggerDiv.current)
      }
    }
  }, [loadMoreData, loading, hasMore])

  return (
    <main className='min-h-screen'>
      <section>
        <h1 className='text-center text-3xl py-8'>
          Intersection Test (seeded data)
        </h1>
        <p className='text-center text-gray-600'>
          Loaded {data.length} of {total} items
        </p>
      </section>

      <section>
        <ul className='max-w-[550px] mx-auto'>
          {data?.map((item, i) => {
            return <LazyImage key={item.id || i} item={item} />
          })}
        </ul>

        {/* Trigger for infinite scroll */}
        {hasMore && (
          <div
            ref={triggerDiv}
            className='capitalize flex justify-center items-center h-[100px] bg-blue-300 my-4'
          >
            {loading ? 'Loading more...' : 'Scroll for more'}
          </div>
        )}

        {/* End of list message */}
        {!hasMore && data.length > 0 && (
          <div className='capitalize flex justify-center items-center h-[100px] bg-green-300 my-4'>
            You've reached the end! 🎉5
          </div>
        )}
      </section>
    </main>
  )
}
