import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const { data, error } = await supabase
      .from('valid_words')
      .select('word')
      .eq('id', `${randomId}`)
      .single()

    if (error) {
      console.log('Uh oh!', error.message)
    } else {
      setTarget(data?.word.toString().toUpperCase())
      console.log(workPLS)
    }

    res.status(200).json({ data })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong.' })
  }
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