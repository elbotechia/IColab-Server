# Course API Routes Documentation

## Rotas para Cursos (`/api/courses`)

### Rotas Básicas CRUD

#### `GET /api/courses`
Listar todos os cursos com paginação e filtros.

**Parâmetros de Query:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10, máximo: 100)
- `search` (opcional): Buscar por nome do curso, abreviação ou variações
- `anos` (opcional): Filtrar por duração em anos (1-10)
- `abbr` (opcional): Filtrar por abreviação específica

**Exemplo:**
```bash
GET /api/courses?page=1&limit=20&search=engenharia&anos=5
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "curso": "Engenharia de Software",
      "anos": 5,
      "abbr": "ES",
      "variacoes": ["Engenharia de Computação", "Eng. Software"],
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

#### `GET /api/courses/:id`
Buscar curso específico por ID.

**Parâmetros:**
- `id`: MongoDB ObjectId do curso

**Exemplo:**
```bash
GET /api/courses/507f1f77bcf86cd799439011
```

#### `POST /api/courses`
Criar novo curso.

**Body:**
```json
{
  "curso": "Engenharia de Software",
  "anos": 5,
  "abbr": "ES",
  "variacoes": ["Engenharia de Computação", "Eng. Software"]
}
```

**Validações:**
- `curso`: Obrigatório, string entre 2-100 caracteres, único
- `anos`: Obrigatório, número inteiro entre 1-10
- `abbr`: Obrigatório, string entre 2-10 caracteres (convertido para maiúsculo)
- `variacoes`: Opcional, array de strings

#### `PUT /api/courses/:id`
Atualizar curso existente.

**Parâmetros:**
- `id`: MongoDB ObjectId do curso

**Body:** (todos os campos são opcionais)
```json
{
  "curso": "Engenharia de Software - Novo Nome",
  "anos": 4,
  "abbr": "ESW",
  "variacoes": ["Engenharia de Software", "Software Engineering"]
}
```

#### `DELETE /api/courses/:id`
Deletar curso.

**Parâmetros:**
- `id`: MongoDB ObjectId do curso

### Rotas Especiais

#### `GET /api/courses/abbr/:abbr`
Buscar curso por abreviação.

**Parâmetros:**
- `abbr`: Abreviação do curso (não case-sensitive)

**Exemplo:**
```bash
GET /api/courses/abbr/es
# ou
GET /api/courses/abbr/ES
```

#### `GET /api/courses/duration/:anos`
Buscar todos os cursos com duração específica.

**Parâmetros:**
- `anos`: Duração em anos (1-10)

**Exemplo:**
```bash
GET /api/courses/duration/5
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "curso": "Engenharia de Software",
      "anos": 5,
      "abbr": "ES",
      "variacoes": ["Engenharia de Computação"]
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "curso": "Medicina",
      "anos": 5,
      "abbr": "MED",
      "variacoes": []
    }
  ],
  "count": 2
}
```

#### `POST /api/courses/:id/variations`
Adicionar nova variação ao curso.

**Parâmetros:**
- `id`: MongoDB ObjectId do curso

**Body:**
```json
{
  "variacao": "Nova Variação do Curso"
}
```

#### `DELETE /api/courses/:id/variations`
Remover variação do curso.

**Parâmetros:**
- `id`: MongoDB ObjectId do curso

**Body:**
```json
{
  "variacao": "Variação a ser removida"
}
```

## Estrutura do Schema

```javascript
{
  curso: String,        // Nome do curso (único, obrigatório)
  anos: Number,         // Duração em anos (1-10, obrigatório)
  abbr: String,         // Abreviação (obrigatório)
  variacoes: [String],  // Array de variações (opcional)
  createdAt: Date,      // Data de criação (automático)
  updatedAt: Date       // Data de atualização (automático)
}
```

## Códigos de Status HTTP

- `200` - Sucesso (GET, PUT, DELETE)
- `201` - Criado com sucesso (POST)
- `400` - Erro de validação
- `404` - Curso não encontrado
- `409` - Conflito (curso com nome duplicado)
- `500` - Erro interno do servidor

## Exemplos de Uso Completo

### Criar um Curso
```bash
POST /api/courses
Content-Type: application/json

{
  "curso": "Ciência da Computação",
  "anos": 4,
  "abbr": "CC",
  "variacoes": ["Computação", "Computer Science"]
}
```

### Buscar Cursos de Engenharia
```bash
GET /api/courses?search=engenharia&limit=50
```

### Adicionar Variação
```bash
POST /api/courses/507f1f77bcf86cd799439011/variations
Content-Type: application/json

{
  "variacao": "Engenharia de Software e Sistemas"
}
```

### Buscar por Abreviação
```bash
GET /api/courses/abbr/cc
```

## Funcionalidades Especiais

1. **Busca Inteligente**: A busca funciona no nome do curso, abreviação e variações
2. **Case Insensitive**: Abreviações são automaticamente convertidas para maiúsculo
3. **Validação de Duração**: Anos limitados entre 1 e 10
4. **Gestão de Variações**: Adicionar/remover variações sem duplicatas
5. **Ordenação**: Cursos listados em ordem alfabética por nome
6. **Unicidade**: Nome do curso deve ser único no sistema
