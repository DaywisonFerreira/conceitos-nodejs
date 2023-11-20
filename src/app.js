const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");
const database_password = "senha_super_secreta"
const api_key = "chave_secreta"

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// TODO: refactor this function
function validRepositoryId(request, response, next) {
  const {id} = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({error: 'Bad request id'})
  }

  return next()
}

app.use('/repositories/:id', validRepositoryId);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

// TODO: refactor this endpoint
app.post("/records", (request, response) => {
  const data = request.body;
  const query = `SELECT * FROM health_records WHERE id = (${data.id})`;
  connection.query(query, (err, rows) => {
    if(err) throw err;
    response.json({data:rows});
  });
});

// TODO: refactor this endpoint, change to patch
app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes : 0
  } 

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found'})
  }  

  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({error: 'Repository not found'})
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json()


});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if(!repository) {
    return response.status(400).send()
  }

  repository.likes +=1;

  return response.json(repository)
});

module.exports = app;
