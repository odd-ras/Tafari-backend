const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(express.json());

let users = [
  {
    username: "oddras",
    name: "Kelvin Ontumbi",
    email: "example1@gmail.com",
    id: 1,
    password: 123,
  },
  {
    username: "Fariii",
    name: "Tafari Marley",
    email: "example2@gmail.com",
    id: 2,
    password: 456,
  },
  {
    username: "Kamut",
    name: "Karen Reson",
    email: "example3@gmail.com",
    id: 3,
    password: 987,
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/users", (request, response) => {
  response.json(users);
});

app.get("/api/users/:id", (request, response) => {
  const id = Number(request.params.id);
  const user = users.find((user) => user.id === id);
  if (user) {
    response.json(user);
  } else {
    response.status(404).end();
  }
});

const generatedId = () => {
  const maxId = users.length > 0 ? Math.max(...users.map((el) => el.id)) : 0;
  return maxId + 1;
};

app.post("/api/users", (req, res) => {
  const body = req.body;
  if (!body.name) {
    return res.status(400).json({ error: "name missing" });
  } else {
    const user = {
      ...body,
      id: generatedId(),
    };
    users = users.concat(user);
    res.json(user);
  }
});

app.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  users = users.filter((user) => user.id !== id);
  res.status(204).end();
});

app.put("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const updatedUser = {
    ...req.body,
    id: req.params.id,
  };

  const index = users.findIndex((user) => user.id === userId);

  if (index !== -1) {
    users[index] = updatedUser;
    res.json({ message: "User updated successfully", user: updatedUser });
  } else {
    res.status(404).json({ message: "user not found" });
  }
});

app.patch("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const updates = req.body;

  const index = users.findIndex((user) => user.id === userId);

  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    res.json({ message: "User updated successfully", user: users[index] });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Set a default status code and error message
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
