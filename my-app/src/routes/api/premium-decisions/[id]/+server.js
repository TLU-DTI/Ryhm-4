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
  const { premium_decision_id, results, user_id, is_group_decision, group_id } = await request.json();

  // Insert into premium_decision_results
  const { data, error } = await supabase
    .from('premium_decision_results')
    .insert([
      {
        premium_decision_id,
        results,
        user_id,
        is_group_decision,
        group_id: is_group_decision ? group_id : null // Only save group_id if it's a group decision
      }
    ]);

  if (error) {
    console.error('Error inserting data:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (is_group_decision && group_id) {
    // Insert into premium_decisions_groups
    const { groupError } = await supabase
      .from('premium_decisions_groups')
      .insert([
        {
          group_id,
          premium_decision_id
        }
      ]);

    if (groupError) {
      console.error('Error inserting group data:', groupError.message);
      return new Response(JSON.stringify({ error: groupError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  console.log('Inserted data:', data);  // Debug log

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
