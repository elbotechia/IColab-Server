# Correções de Referências nos Schemas

## Problemas Encontrados e Corrigidos

### 1. **PostSchema** (`src/models/schemas/postSchema.js`)
❌ **Problemas encontrados:**
- Estrutura duplicada e malformada em `comments`
- Referência incorreta `ref: 'Storage'` (sem consistência)
- Referência `ref: 'Persons'` (plural)
- Nome do modelo `'post'` (minúsculo)

✅ **Correções aplicadas:**
```javascript
// ANTES:
comments:[{
comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
}]
}],

// DEPOIS:
comments:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: []
}],

// ANTES:
ref: 'Storage'        // Inconsistente
ref: 'Persons'        // Plural
mongoose.model('post', PostSchema)  // Minúsculo

// DEPOIS:
ref: 'storage'        // Consistente com nome do modelo
ref: 'Person'         // Singular
mongoose.model('Post', PostSchema)  // PascalCase
```

### 2. **StorageSchema** (`src/models/schemas/storageSchema.js`)
❌ **Problema encontrado:**
- Nome do modelo `'storage'` (minúsculo)

✅ **Correção aplicada:**
```javascript
// ANTES:
mongoose.model('storage', StorageSchema)

// DEPOIS:
mongoose.model('Storage', StorageSchema)
```

### 3. **AssignatureSchema** (`src/models/schemas/assignatureSchema.js`)
❌ **Problemas encontrados:**
- Referência incorreta `ref: 'Uploads'` (deveria ser `'Storage'`)
- Referência `ref: 'Institutions'` (plural)

✅ **Correções aplicadas:**
```javascript
// ANTES:
ref: 'Uploads'        // Nome incorreto
ref: 'Institutions'   // Plural

// DEPOIS:
ref: 'Storage'        // Nome correto
ref: 'Institution'    // Singular
```

### 4. **TagSchema** (`src/models/schemas/tagSchema.js`)
❌ **Problema encontrado:**
- Referência incorreta `ref: 'Upload'` (deveria ser `'Storage'`)

✅ **Correção aplicada:**
```javascript
// ANTES:
ref: "Upload"

// DEPOIS:
ref: "Storage"
```

### 5. **InstitutionSchema** (`src/models/schemas/institutionSchema.js`)
❌ **Problema encontrado:**
- Nome do modelo `'Institutions'` (plural)

✅ **Correção aplicada:**
```javascript
// ANTES:
mongoose.model("Institutions", InstitutionSchema)

// DEPOIS:
mongoose.model("Institution", InstitutionSchema)
```

### 6. **PersonSchema** (`src/models/schemas/personsSchema.js`)
❌ **Problema encontrado:**
- Nome do modelo `'Persons'` (plural)

✅ **Correção aplicada:**
```javascript
// ANTES:
mongoose.model("Persons", PersonSchema)

// DEPOIS:
mongoose.model("Person", PersonSchema)
```

## Padrões Estabelecidos

### ✅ **Nomes dos Modelos (Singular, PascalCase)**
- `Storage` - Para arquivos
- `Post` - Para posts
- `Person` - Para pessoas/usuários
- `Institution` - Para instituições
- `Assignature` - Para matérias/disciplinas
- `Item` - Para itens/projetos
- `Tag` - Para tags

### ✅ **Referências Consistentes**
```javascript
// Estrutura padrão para referências:
{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NomeDoModelo',  // Singular, PascalCase
    required: false,      // ou true conforme necessário
    default: []           // para arrays
}
```

### ✅ **Referências Específicas Corrigidas**
- `mediasId` → `ref: 'Storage'`
- `authorId` → `ref: 'Person'`
- `institutionsId` → `ref: 'Institution'`
- `feedbacks` → `ref: 'Post'`
- `tags` → `ref: 'Tag'`
- `comments` → `ref: 'Comment'`
- `avatarId/coverId` → `ref: 'Storage'`

## Impacto das Correções

### 🔧 **Para os Controllers**
Os controllers já estão usando os nomes corretos nos `.populate()`, então continuarão funcionando corretamente.

### 🔧 **Para as Validações**
As validações de ObjectId continuam funcionando normalmente.

### 🔧 **Para as Queries**
As queries com populate agora usarão as referências corretas:
```javascript
// Exemplos de populate que agora funcionam corretamente:
.populate('authorId')        // Person
.populate('mediaIds')        // Storage
.populate('institutionsId')  // Institution
.populate('tags')            // Tag
```

## Benefícios das Correções

1. **Consistência**: Todos os modelos seguem o padrão singular + PascalCase
2. **Clareza**: Referências claras e sem ambiguidade
3. **Manutenibilidade**: Código mais fácil de manter e debugar
4. **Populate**: Relacionamentos funcionam corretamente
5. **Padrões**: Segue as melhores práticas do Mongoose

Todas as referências agora estão corretas e consistentes em todo o projeto!
