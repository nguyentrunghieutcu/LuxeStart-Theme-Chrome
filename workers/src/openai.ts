export interface Env {
    OPENAI_API_KEY: string;
}

export async function handleOpenAI(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Chỉ hỗ trợ POST" }), {
            status: 405, headers: { "Content-Type": "application/json" }
        });
    }

    try {
        // Lấy dữ liệu từ request body
        const body = await request.json() as { prompt?: string };
        if (!body.prompt) {
            return new Response(JSON.stringify({ error: "Thiếu nội dung 'prompt'" }), {
                status: 400, headers: { "Content-Type": "application/json" }
            });
        }

        // 🔥 Định dạng body đúng theo OpenAI API yêu cầu
        const requestBody = {
            model: "gpt-4o-mini", // Hoặc "gpt-3.5-turbo"
            messages: [{ role: "user", content: body.prompt }],
            max_tokens: 100
        };

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${env.OPENAI_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });
        // Trả về response từ OpenAI, đảm bảo CORS headers
        return new Response(await response.text(), {
            status: response.status,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Lỗi xử lý yêu cầu" }), {
            status: 500, headers: { "Content-Type": "application/json" }
        });
    }
}
