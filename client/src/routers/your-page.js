export async function loader() {
  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const res = await fetch(`${apiUrl}/api/dashboard/reviews`)
  const data = await res.json()

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
