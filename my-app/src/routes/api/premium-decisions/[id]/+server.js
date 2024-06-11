import { supabase } from '$lib/supabaseClient';

export async function GET({ params }) {
  const { id } = params;
  let { data, error } = await supabase
    .from('premium_decisions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return {
      status: 500,
      body: { error: error.message }
    };
  }

  return {
    status: 200,
    body: data
  };
}
