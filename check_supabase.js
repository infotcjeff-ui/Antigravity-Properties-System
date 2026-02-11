
const supabaseUrl = 'https://gmpkqwrkechzojbqhfxx.supabase.co';
const supabaseKey = 'sb_publishable_Xli-Md9J88Ghe5w9cPnqKg_zVf6BL8S';

async function checkTable(tableName) {
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}?select=*`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });

        if (!response.ok) {
            console.error(`Fetch ${tableName} failed:`, response.status);
            return 0;
        }

        const data = await response.json();
        console.log(`Table ${tableName}: Found ${data.length} records.`);
        if (data.length > 0) {
            data.slice(0, 2).forEach(r => console.log(`  - ${r.name || r.id}`));
        }
        return data.length;
    } catch (err) {
        console.error(`Error ${tableName}:`, err.message);
        return 0;
    }
}

async function run() {
    console.log('Checking all Supabase tables...');
    await checkTable('properties');
    await checkTable('proprietors');
    await checkTable('transactions');
    await checkTable('rents');
}

run();
