import { supabase } from '$lib/supabaseClient';

export async function GET({ params }) {
  const { id } = params;
  console.log('Fetching data for ID:', id);  // Debug log

  const { data, error } = await supabase
    .from('premium_decisions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching data:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  console.log('Fetched data:', data);  // Debug log

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST({ request }) {
  const { premium_decision_id, results, user_id, is_group_decision } = await request.json();
  
  const { data, error } = await supabase
    .from('premium_decision_results')
    .insert([
      {
        premium_decision_id,
        results,
        user_id,
        is_group_decision
      }
    ]);

  if (error) {
    console.error('Error inserting data:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  console.log('Inserted data:', data);  // Debug log

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
