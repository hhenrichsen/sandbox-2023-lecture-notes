# Sandbox Engineering sb03

The goal of this class is to prepare you to quickly build and scale products and systems.

## 3 core parts of a product

You can break down most software products into 3 parts:

 - `Frontend` (the software on the user's device)
 - `Backend` (the systems that you control)
 - `Datastore` (anything that stores data)

## The Stack

### Language: TypeScript
Starting with the language, we will be using TypeScript. TypeScript is a superset of JavaScript. JavaScript is the only language that natively runs in the browser and that has led to its massive popularity. Technologies such as Node.js have allowed JavaScript to also run on the server as well. This allows to use one language across the frontend and backend.

### Frontend: React
React is a JavaScript framework for building user interfaces. It basically uses JavaScript to generate HTML on the client's device (i.e. you have a variable that is your user's name and React can insert that JavaScript variable into the HTML to display it on the screen).

```TypeScript
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

### Backend: Next.js
Next.js is like a fusion of React and a backend framework in one. It allows you to run React on the server and then send the rendered HTML to the client. It also allows you to create API endpoints that can be called from the frontend.

```TypeScript
import { NextResponse } from 'next/server'
 
export async function GET() {
  const res = await fetch('https://data.myapi.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const data = await res.json()
 
  return NextResponse.json({ data })
}
```

### Datastore: Postgres
Postgres is a relational database. You can think of it like massive excel spreadsheets. You can define column types and relationships between different tables.

```SQL
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
);
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id),
);
```

### Final Note on Stack
There are many other technologies that you can use. These will provide a good foundation. Try to keep at simple as you can for as long as you can. 

## Concepts to understand

These are in no particular order but they are important to consider

- `Keep things simple` (new technologies are cool, complexity isn't)
- `Human capital will be your biggest expense` (make decisions acordingly)
- `Errors are expensive, adopt systems to prevent them` (use typed languages, staging environments, typed databaases, etc)
- `Most technology decisions should boil down to popularity` (more popular means more engineers to hire from, more docs, and more support)
- `Don't build stupid features` (a lot of time is wasted building things that poeple will never use)
- `Keep it clean and organized` (don't make it a pain for new engineers to figure out what you wrote)
- `Use analytics to figure out what your users are using` (this helps you build a better product)