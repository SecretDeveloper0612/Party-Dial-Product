fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
        personalizations: [{ to: [{ email: "admin@partydial.com", name: "Test" }] }],
        from: { email: "noreply@partydial.com", name: "PartyDial" },
        subject: "Test Mailchannels",
        content: [{ type: "text/plain", value: "Test" }]
    })
}).then(res => res.text()).then(console.log).catch(console.error);
