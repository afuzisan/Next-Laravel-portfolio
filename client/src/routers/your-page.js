export async function loader({ params, request }) {
    const res = await fetch('http://localhost:8080/api/dashboard/reviews');
    const data = await res.json();
  
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }