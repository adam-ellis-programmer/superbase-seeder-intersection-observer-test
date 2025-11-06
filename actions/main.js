'use server'
import { createClient } from '@/lib/supabase/server'

const ITEMS_PER_PAGE = 4

export const getData = async (page = 0) => {
  const supabase = await createClient()

  const from = page * ITEMS_PER_PAGE
  const to = from + ITEMS_PER_PAGE - 1

  const { data, error, count } = await supabase
    .from('travel_products')
    .select(`*, product_images (*)`, { count: 'exact' })
    .range(from, to)

  if (error) {
    throw new Error('Error in action page: ' + error.message)
  }
  if (true) {
    console.log('This is a test and this is a new seup')
  }
  // start by settin these values on the server first
  // and then we work with them on the client / frontend

  return {
    data,
    hasMore: to < count - 1,
    total: count,
    currentPage: page,
  }
}
