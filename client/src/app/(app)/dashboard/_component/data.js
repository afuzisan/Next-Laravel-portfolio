export async function loader({ params, request }) {
    const res = await fetch('https://api.example.com/data');
    const data = await res.json();
    return data;
  }