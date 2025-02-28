import { handleWeather } from "./weather";
import { handleGemini } from "./gemini";
import { handleOpenAI } from "./openai";

export interface Env {
	OPENWEATHER_API_KEY: string;
	GEMINI_API_KEY: string;
	OPENAI_API_KEY: string;
}

// ✅ Hàm thêm CORS Headers
function addCorsHeaders(response: Response): Response {
	const headers = new Headers(response.headers);
	headers.set("Access-Control-Allow-Origin", "*");
	headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	headers.set("Access-Control-Allow-Headers", "Content-Type");

	return new Response(response.body, { status: response.status, headers });
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		const path = url.pathname.replace('/api', ''); // Xóa tiền tố "/api"

		// Bỏ qua favicon.ico để tránh lỗi 400
		if (path === "/favicon.ico") {
			return new Response(null, { status: 204 });
		}

		// ✅ Xử lý CORS preflight (OPTIONS request)
		if (request.method === "OPTIONS") {
			return new Response(null, {
				status: 204,
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type"
				}
			});
		}

		let response: Response;
		if (path.startsWith('/weather')) {
			response = await handleWeather(request, env);
		} else if (path.startsWith('/gemini')) {
			response = await handleGemini(request, env);
		}
		else if (path.startsWith('/openai')) {
			response = await handleOpenAI(request, env);
		} else {
			response = new Response(JSON.stringify({ error: "API không hợp lệ" }), {
				status: 400, headers: { "Content-Type": "application/json" }
			});
		}

		// ✅ Đảm bảo CORS headers luôn có
		return addCorsHeaders(response);
	}
};
