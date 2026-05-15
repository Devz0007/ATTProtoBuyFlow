exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'API key not configured on server' })
        };
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch {
        return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://rad-monstera-36bfe0.netlify.app',
            'X-Title': 'AT&T Prototype Buy Flow'
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();

    return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
};
