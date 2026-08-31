async function check() {
    const res = await fetch('http://127.0.0.1:5005/api/venues');
    const data = await res.json();
    console.log(`Total reported: ${data.results}, Array length: ${data.data.length}`);
    const found = data.data.find(v => v.contactEmail === 'cedarahotelsandretreats@gmail.com');
    if (found) {
        console.log("Found in API!");
    } else {
        console.log("NOT found in API!");
    }
}

check().catch(console.error);
