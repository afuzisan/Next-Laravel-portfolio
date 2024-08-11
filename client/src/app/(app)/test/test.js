export default async function SsrPage() {
  const todo = await getData()
  return (
    <ul>
      <li> Id : {todo.id}</li>
      <li> userId : {todo.userId}</li>
      <li> title : {todo.title}</li>
      <li> completed : {todo.completed.toString()}</li>
    </ul>
  )
}

async function getData() {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  return res.json()
}
