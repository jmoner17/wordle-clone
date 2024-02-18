import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabase = createClient(supabaseUrl, supabaseKey)

  /*
  try {
    const { data, error } =  await supabase.rpc('randoRow')

    if (error) {
      console.log('Uh oh!', error.message)
    } else {
      //setTarget(data?.word.toString().toUpperCase())
      //console.log(data?.word.toString().toUpperCase())
    }

    return res.status(200).json({ data: data?.word.toString().toUpperCase() })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Something went wrong.' })
  }
}
*/
}
/*
import { createClient } from '@supabase/supabase-js'

export async function workPLS() {
    
const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
})

return supabase;
}
*/