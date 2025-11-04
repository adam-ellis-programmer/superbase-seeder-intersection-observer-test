import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LazyImage from '@/components/LazyImage'
export default async function Home() {
  const supabase = await createClient()

  const { data, error } = await supabase.from('travel_products').select(`
    *,
    product_images (*)
  `)

  return (
    <main className='min-h-screen'>
      <section>
        <h1 className='text-center text-3xl'>
          Intersection Test (seeded data)
        </h1>
      </section>
      <section>
        <ul className='max-w-[550px] mx-auto'>
          {data?.map((item, i) => {
            return <LazyImage key={i} item={item} />
          })}
        </ul>
      </section>
    </main>
  )
}
