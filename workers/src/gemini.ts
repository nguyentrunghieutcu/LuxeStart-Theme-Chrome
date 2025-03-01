export interface Env {
    GEMINI_API_KEY: string;
}

export async function handleGemini(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Chỉ hỗ trợ POST" }), {
            status: 405, headers: { "Content-Type": "application/json" }
        });
    }

    try {
        // Lấy dữ liệu từ request body
        const body = await request.json() as { contents?: { parts?: { text: string }[] }[] };
        if (!body.contents?.[0]?.parts?.[0]?.text) {
            return new Response(JSON.stringify({ error: "Thiếu nội dung trong 'contents'" }), {
                status: 400, headers: { "Content-Type": "application/json" }
            });
        }


        // 🔥 Định dạng body đúng theo API Gemini yêu cầu
        const requestBody = body

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        // Trả về response từ API Gemini, đảm bảo CORS headers
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
