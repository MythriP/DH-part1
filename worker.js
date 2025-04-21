export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/hello") {
      return new Response(
        JSON.stringify({
          message: "CRM sync coming soon if I get a chance:)!",
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    return new Response("Not Found", { status: 404 });
  },
};
