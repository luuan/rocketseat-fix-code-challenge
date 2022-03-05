const express = require("express");

const { v4: uuid } = require("uuid");
const { validate: isUuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  repositories.push({
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  });

  return response.status(201).json(repositories[repositories.length -1]);
});


app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const updatedRepository = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const repository = { ...repositories[repositoryIndex], ...updatedRepository };
  repository.likes = repositories[repositoryIndex].likes
  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const likes = ++repositories[repositoryIndex].likes;

  return response.json({likes});
});

module.exports = app;
