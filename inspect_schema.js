
const supabaseUrl = 'https://gmpkqwrkechzojbqhfxx.supabase.co';
const supabaseKey = 'sb_publishable_Xli-Md9J88Ghe5w9cPnqKg_zVf6BL8S';

async function inspectSchema() {
    const tables = ['properties', 'proprietors', 'transactions'];
    for (const table of tables) {
        try {
            console.log(`\nInspecting table: ${table}`);
            const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*&limit=1`, {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Prefer': 'count=exact'
                }
            });

            if (!response.ok) {
                console.error(`- Error: ${response.status}`);
                continue;
            }

            const data = await response.json();
            if (data.length > 0) {
                console.log('- Columns found:', Object.keys(data[0]).join(', '));
            } else {
                console.log('- Table is empty, cannot easily inspect columns via REST API without data.');
            }
        } catch (err) {
            console.error(`- Fetch error for ${table}:`, err.message);
        }
    }
}

inspectSchema();
