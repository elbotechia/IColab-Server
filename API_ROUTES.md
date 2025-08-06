# API Routes Documentation

Esta documentação descreve todas as rotas disponíveis na API do IColab-Server.

## Base URL
```
/api
```

## Rotas Principais

### 1. Items (`/api/items`)
- `GET /` - Listar todos os itens com paginação e filtros
- `GET /:id` - Buscar item por ID
- `POST /` - Criar novo item
- `PUT /:id` - Atualizar item
- `DELETE /:id` - Deletar item
- `POST /:id/like` - Curtir item
- `POST /:id/dislike` - Descurtir item

**Parâmetros de query para GET /**:
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10, máximo: 100)
- `type` (opcional): Filtrar por tipo (project, notebook, flashcard, presentation, book, article, research, podcast, video, other)
- `search` (opcional): Buscar por nome ou descrição

### 2. Assignatures (`/api/assignatures`)
- `GET /` - Listar todas as matérias com paginação e filtros
- `GET /:id` - Buscar matéria por ID
- `POST /` - Criar nova matéria
- `PUT /:id` - Atualizar matéria
- `DELETE /:id` - Deletar matéria
- `POST /:id/like` - Curtir matéria
- `POST /:id/dislike` - Descurtir matéria

**Parâmetros de query para GET /**:
- `page` (opcional): Número da página
- `limit` (opcional): Itens por página
- `type` (opcional): Filtrar por tipo (superior, ensino médio, EAD, ensino fundamental, infantil, pós-graduação, MBA, master, curso, técnico, certificação, other)
- `search` (opcional): Buscar por nome ou descrição

### 3. Institutions (`/api/institutions`)
- `GET /` - Listar todas as instituições com paginação e filtros
- `GET /:id` - Buscar instituição por ID
- `POST /` - Criar nova instituição
- `PUT /:id` - Atualizar instituição
- `DELETE /:id` - Deletar instituição
- `GET /domain/:domain` - Buscar instituições por domínio

**Parâmetros de query para GET /**:
- `page` (opcional): Número da página
- `limit` (opcional): Itens por página
- `dominio` (opcional): Filtrar por domínio (educacao, ONG, empresa, comercio, GOV, politico, industria)
- `search` (opcional): Buscar por razão social, nome fantasia ou abreviação

### 4. Persons (`/api/persons`)
- `GET /` - Listar todas as pessoas com paginação e filtros
- `GET /:id` - Buscar pessoa por ID
- `POST /` - Criar nova pessoa
- `PUT /:id` - Atualizar pessoa
- `DELETE /:id` - Deletar pessoa
- `GET /username/:username` - Buscar pessoa por username
- `PUT /:id/password` - Alterar senha

**Parâmetros de query para GET /**:
- `page` (opcional): Número da página
- `limit` (opcional): Itens por página
- `role` (opcional): Filtrar por role (user, admin, professor, mentor, orientador, monitor, aluno, pesquisador)
- `search` (opcional): Buscar por username, nome ou email

### 5. Posts (`/api/posts`)
- `GET /` - Listar todos os posts com paginação e filtros
- `GET /:id` - Buscar post por ID
- `POST /` - Criar novo post
- `PUT /:id` - Atualizar post
- `DELETE /:id` - Deletar post (soft delete)
- `POST /:id/restore` - Restaurar post deletado
- `POST /:id/like` - Curtir post
- `POST /:id/dislike` - Descurtir post
- `POST /:id/comments` - Adicionar comentário ao post

**Parâmetros de query para GET /**:
- `page` (opcional): Número da página
- `limit` (opcional): Itens por página
- `authorId` (opcional): Filtrar por autor
- `tag` (opcional): Filtrar por tag
- `search` (opcional): Buscar por título, conteúdo ou tags
- `includeDeleted` (opcional): Incluir posts deletados (true/false)

### 6. Storage (`/api/storage`)
- `GET /` - Listar todos os arquivos com paginação e filtros
- `GET /:id` - Buscar arquivo por ID
- `POST /` - Criar novo registro de arquivo
- `PUT /:id` - Atualizar arquivo
- `DELETE /:id` - Deletar arquivo (soft delete)
- `POST /:id/restore` - Restaurar arquivo deletado
- `POST /upload` - Upload de arquivo
- `GET /:id/download` - Download de arquivo

**Parâmetros de query para GET /**:
- `page` (opcional): Número da página
- `limit` (opcional): Itens por página
- `search` (opcional): Buscar por nome do arquivo ou URL
- `includeDeleted` (opcional): Incluir arquivos deletados (true/false)
- `fileType` (opcional): Filtrar por tipo de arquivo

### 7. Tags (`/api/tags`)
- `GET /` - Listar todas as tags com paginação e filtros
- `GET /:id` - Buscar tag por ID
- `POST /` - Criar nova tag
- `PUT /:id` - Atualizar tag
- `DELETE /:id` - Deletar tag
- `GET /name/:tagName` - Buscar tag por nome
- `GET /popular` - Buscar tags populares
- `GET /color/:color` - Buscar tags por cor

**Parâmetros de query para GET /**:
- `page` (opcional): Número da página
- `limit` (opcional): Itens por página
- `search` (opcional): Buscar por nome ou descrição
- `color` (opcional): Filtrar por cor (formato hex)

## Estrutura de Resposta

### Sucesso
```json
{
  "success": true,
  "message": "Mensagem de sucesso (opcional)",
  "data": {}, // ou []
  "pagination": { // apenas para listagens
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

### Erro
```json
{
  "success": false,
  "message": "Mensagem de erro",
  "error": "Detalhes do erro (opcional)",
  "errors": { // apenas para erros de validação
    "campo": ["Erro 1", "Erro 2"]
  }
}
```

## Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação
- `404` - Não encontrado
- `409` - Conflito (duplicata)
- `500` - Erro interno do servidor

## Validações

Todas as rotas possuem validações automáticas usando `express-validator`. Os erros de validação são retornados no formato padrão com código 400.

## Middleware

- **Validação**: Todas as rotas possuem validação de entrada
- **Upload**: Configurado para arquivos até 10MB na pasta `STORAGE/`
- **Soft Delete**: Posts e Storage possuem soft delete com mongoose-delete

## Exemplos de Uso

### Criar um Item
```bash
POST /api/items
Content-Type: application/json

{
  "tagName": "Meu Projeto",
  "type": "project",
  "description": "Descrição do projeto",
  "repo": "https://github.com/user/repo",
  "deploy": "https://myproject.com"
}
```

### Upload de Arquivo
```bash
POST /api/storage/upload
Content-Type: multipart/form-data

file: [arquivo]
description: "Descrição opcional"
```

### Buscar Posts com Filtros
```bash
GET /api/posts?page=1&limit=20&authorId=123&search=javascript
```
