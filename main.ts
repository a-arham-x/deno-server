import { DB } from "sqlite";

const db = new DB("mydatabase.db");

db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER
  )
`);

Deno.serve(async (req) => {
  if (req.method=="GET"){
    try{  
      const rows = db.query("SELECT * FROM users");

      const users = rows.map(([id, name, age]) => ({
          id,
          name,
          age,
      }));
      return new Response(JSON.stringify({message: "Successfully fetched all the users", users}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }catch(error){
      console.log(error);
      return new Response(JSON.stringify({message: "Internal Sever Error"}), {
        status: 500,
      })
    }
  }
  if (req.method=="POST"){
    try{
      const body = await req.json();
      const { name, age } = body;

      db.query("INSERT INTO users (name, age) VALUES (?, ?)", [name, age]);

      return new Response(JSON.stringify({message: "User created successfully"}), {
        status: 200,
      })
    }catch(error){
      return new Response(JSON.stringify({message: "Internal Sever Error"}), {
        status: 500,
      })
    }
  }
});
