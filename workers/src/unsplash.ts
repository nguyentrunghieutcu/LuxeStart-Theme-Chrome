export interface Env {
    UNSPLASH_ACCESS_KEY: string;
}

export async function handleUnsplash(request: Request, env: Env): Promise<Response> {
    if (request.method !== "GET") {
        return new Response(JSON.stringify({ error: "Chỉ hỗ trợ GET" }), {
            status: 405, headers: { "Content-Type": "application/json" }
        });
    }

    try {
        // Lấy query từ URL
        const url = new URL(request.url);
        const query = url.searchParams.get("query");
        const perPage = url.searchParams.get("per_page") || "10";

        if (!query) {
            return new Response(JSON.stringify({ error: "Thiếu tham số 'query'" }), {
                status: 400, headers: { "Content-Type": "application/json" }
            });
        }

        // Gọi API Unsplash
        const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&client_id=${env.UNSPLASH_ACCESS_KEY}`;
        const response = await fetch(unsplashUrl);

        if (!response.ok) {
            return new Response(JSON.stringify({ error: "Lỗi từ Unsplash API" }), {
                status: response.status, headers: { "Content-Type": "application/json" }
            });
        }

        // Trả về dữ liệu JSON
        return new Response(await response.text(), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Lỗi xử lý yêu cầu" }), {
            status: 500, headers: { "Content-Type": "application/json" }
        });
    }
}
