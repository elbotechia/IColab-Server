# Estrutura Completa da API - IColab Server

Este documento resume toda a estrutura criada para a API baseada nos schemas existentes.

## 📁 Estrutura de Pastas Criadas

```
src/
├── validators/          # ✅ NOVO - Validadores para cada entidade
├── middlewares/         # ✅ NOVO - Middleware de validação
├── controllers/         # ✅ EXPANDIDO - Controllers completos
└── routes/             # ✅ EXPANDIDO - Routers completos
```

## 🔍 Validators Criados

### `src/validators/`
- ✅ `assignatureValidator.js` - Validações para matérias/disciplinas
- ✅ `institutionValidator.js` - Validações para instituições  
- ✅ `itemValidator.js` - Validações para itens/projetos
- ✅ `personValidator.js` - Validações para pessoas/usuários
- ✅ `postValidator.js` - Validações para posts
- ✅ `storageValidator.js` - Validações para arquivos
- ✅ `tagValidator.js` - Validações para tags

**Características dos Validators:**
- Validação completa de entrada usando `express-validator`
- Validações específicas para create, update, getById, delete, getAll
- Validações customizadas (like, dislike, upload, etc.)
- Sanitização de dados (trim, normalizeEmail, etc.)
- Validação de tipos, formatos, comprimentos
- Validação de ObjectIds do MongoDB

## 🛡️ Middlewares Criados

### `src/middlewares/`
- ✅ `validationMiddleware.js` - Middleware para processar erros de validação

**Funcionalidades:**
- Captura erros do `express-validator`
- Formata erros em estrutura JSON padronizada
- Agrupa erros por campo
- Retorna resposta 400 com detalhes dos erros

## 🎮 Controllers Criados/Atualizados

### `src/controllers/`
- ✅ `assignatureController.js` - CRUD completo + like/dislike
- ✅ `institutionController.js` - CRUD completo + busca por domínio
- ✅ `itemController.js` - ATUALIZADO - CRUD completo + like/dislike
- ✅ `personController.js` - CRUD completo + busca por username + alteração de senha
- ✅ `postController.js` - CRUD completo + like/dislike + soft delete + comentários
- ✅ `storageController.js` - CRUD completo + upload/download + soft delete
- ✅ `tagController.js` - CRUD completo + busca por nome/cor + tags populares

**Características dos Controllers:**
- CRUD completo (Create, Read, Update, Delete)
- Paginação automática com `page` e `limit`
- Filtros de busca dinâmicos
- Populate automático de relacionamentos
- Tratamento de erros padronizado
- Respostas JSON estruturadas
- Soft delete para Posts e Storage
- Funcionalidades específicas (like, dislike, upload, etc.)

## 🛤️ Routers Criados/Atualizados

### `src/routes/`
- ✅ `assignatureRouter.js` - Rotas completas para matérias
- ✅ `institutionRouter.js` - Rotas completas para instituições
- ✅ `itemRouter.js` - ATUALIZADO - Rotas completas para itens
- ✅ `personRouter.js` - Rotas completas para pessoas
- ✅ `postRouter.js` - Rotas completas para posts
- ✅ `storageRouter.js` - Rotas completas para arquivos + upload
- ✅ `tagRouter.js` - Rotas completas para tags
- ✅ `apiRouter.js` - ATUALIZADO - Router principal com todas as rotas

**Características dos Routers:**
- Integração completa com validators e middleware
- Rotas RESTful padronizadas
- Upload de arquivos configurado (multer)
- Binding correto dos métodos dos controllers
- Estrutura modular e reutilizável

## 📊 Schemas Atualizados

### `src/models/schemas/`
- ✅ `assignatureSchema.js` - Adicionado export do modelo
- ✅ `itemSchema.js` - Adicionado export do modelo
- ✅ `personsSchema.js` - Corrigido import do mongoose
- ✅ `tagSchema.js` - Corrigido export do modelo

## 📋 Funcionalidades Implementadas

### ✅ Validação Completa
- Validação de entrada para todas as rotas
- Validação de tipos de dados
- Validação de formatos (email, URL, hex colors, CNPJ)
- Validação de comprimentos de string
- Validação de arrays e ObjectIds

### ✅ CRUD Completo
- Create (POST /)
- Read All (GET / com paginação e filtros)
- Read One (GET /:id)
- Update (PUT /:id)
- Delete (DELETE /:id)

### ✅ Funcionalidades Extras
- **Like/Dislike**: Items, Assignatures, Posts
- **Upload/Download**: Storage com multer
- **Soft Delete**: Posts e Storage
- **Busca Avançada**: Filtros e busca por texto
- **Paginação**: Automática em todas as listagens
- **Relacionamentos**: Populate automático

### ✅ Tratamento de Erros
- Erros de validação (400)
- Recursos não encontrados (404)
- Conflitos de duplicata (409)
- Erros internos (500)
- Estrutura de resposta padronizada

### ✅ Upload de Arquivos
- Configurado com multer
- Limite de 10MB
- Armazenamento em pasta STORAGE/
- Nomes únicos para arquivos
- Download direto por ID

## 🚀 Como Usar

### 1. Estrutura de URL
```
BASE_URL/api/{entidade}/{ação}
```

### 2. Exemplos de Rotas
```bash
# Listar itens com paginação
GET /api/items?page=1&limit=10&type=project

# Criar nova pessoa
POST /api/persons
{
  "username": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "hex": "#FF5733",
  "passwordHash": "hashedpassword"
}

# Upload de arquivo
POST /api/storage/upload
(multipart/form-data com campo 'file')

# Curtir um post
POST /api/posts/:id/like
```

### 3. Estrutura de Resposta
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {...},
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

## 📦 Dependências Utilizadas
- `express-validator` - Validação de entrada
- `mongoose` - ODM para MongoDB
- `mongoose-delete` - Soft delete
- `multer` - Upload de arquivos
- `bcryptjs` - Hash de senhas

## 🎯 Benefícios da Estrutura

1. **Modular**: Cada entidade tem seus próprios arquivos
2. **Reutilizável**: Padrões consistentes em toda a API
3. **Escalável**: Fácil adicionar novas entidades
4. **Segura**: Validação completa e tratamento de erros
5. **Documentada**: Código bem comentado e documentação completa
6. **RESTful**: Segue padrões REST
7. **Consistente**: Estrutura de resposta padronizada

Esta estrutura fornece uma API completa e robusta baseada nos schemas existentes, pronta para uso em produção!
