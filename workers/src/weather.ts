export interface Env {
    OPENWEATHER_API_KEY: string;
  }
  
  export async function handleWeather(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const lat = url.searchParams.get("lat");
    const lon = url.searchParams.get("lon");
  
    if (!lat || !lon) {
      return new Response(JSON.stringify({ error: "Thiếu tham số lat hoặc lon" }), { 
        status: 400, headers: { "Content-Type": "application/json" } 
      });
    }
  
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lang=vi&lat=${lat}&lon=${lon}&appid=${env.OPENWEATHER_API_KEY}`);
  
    return new Response(await response.text(), {
      status: response.status,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
  