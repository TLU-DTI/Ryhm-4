import { supabase } from '$lib/supabaseClient';

export async function GET({ params }) {
    const { id } = params;

    const { data, error } = await supabase
        .from('premium_decisions')
        .select('criteria, choices')
        .eq('id', id)
        .single();

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
