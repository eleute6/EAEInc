/*
Note: I'm not sure why this is here, but it'll be preserved for the sake of credit
to the ones who worked on it. If it's needed, it can be re-integrated later.

export async function GET() {
  try {
    const res = await fetch("http://localhost:5500/api/posts"); // Java backend
    const data = await res.json();

    // Make sure we always return an array
    return new Response(JSON.stringify(Array.isArray(data) ? data : []), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify([]), { status: 500 }); // empty array if fetch fails
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await fetch("http://localhost:5500/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to create post" }), {
      status: 500,
    });
  }
}
*/