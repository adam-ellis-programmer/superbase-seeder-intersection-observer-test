import { createClient } from '@supabase/supabase-js'

import dotenv from 'dotenv'
// Load from .env.local instead of .env
dotenv.config({ path: '.env.local' })
// ls -la | grep .env
// Load environment variables from .env file
// Create a single supabase client for interacting with your database
//
// ********** DEVELOPER KEY **********
// ***********************************
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
// ********** DEVELOPER KEY **********
// ***********************************
