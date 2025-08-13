# Teste da API de Persons

## Endpoints Disponíveis:

### 1. POST /api/persons (Criar pessoa)
```json
{
  "firstName": "João",
  "lastName": "Silva",
  "username": "joaosilva",
  "email": "joao@email.com",
  "password": "MinhaSenh@123",
  "hex": "#3498db",
  "roles": ["user"],
  "bio": "Minha biografia",
  "newsletter": false,
  "social": {
    "github": "https://github.com/joao",
    "linkedin": "https://linkedin.com/in/joao",
    "twitter": "NÃO INFORMADO",
    "instagram": "NÃO INFORMADO",
    "facebook": "NÃO INFORMADO"
  }
}
```

### 2. GET /api/persons (Listar pessoas)
- Query params: page, limit, role, search, username, email, isActive

### 3. GET /api/persons/:id (Buscar por ID)

### 4. GET /api/persons/username/:username (Buscar por username)

### 5. PUT /api/persons/:id (Atualizar pessoa)

### 6. DELETE /api/persons/:id (Excluir pessoa)

### 7. PUT /api/persons/:id/password (Alterar senha)
```json
{
  "currentPassword": "senhaAtual",
  "newPassword": "NovaSenha@123",
  "confirmPassword": "NovaSenha@123"
}
```

## Melhorias Implementadas:

### 🔧 Schema (PersonSchema):
- ✅ Validações completas com mensagens personalizadas
- ✅ Campos obrigatórios e opcionais bem definidos
- ✅ Campo `newsletter` adicionado
- ✅ Campos `isActive` e `lastLogin` para controle
- ✅ Pre-save middleware para hash automático de senha
- ✅ Métodos para comparar e alterar senha
- ✅ Método toJSON() que remove automaticamente o passwordHash
- ✅ Índices otimizados (sem duplicatas)

### 🛡️ Segurança:
- ✅ Rate limiting na criação (3 tentativas por 15min)
- ✅ Hash de senha com bcrypt (12 salt rounds)
- ✅ Sanitização automática de dados
- ✅ Headers de segurança (XSS, CSRF protection)
- ✅ Remoção automática de passwordHash nas respostas

### 📋 Validação:
- ✅ Validação de senha forte obrigatória
- ✅ Confirmação de senha
- ✅ Validação de URLs para redes sociais
- ✅ Validação de hex colors
- ✅ Validação de nomes (apenas letras)
- ✅ Validação de username (letras, números, _ e -)
- ✅ Suporte para campos flat e aninhados

### 🎯 Funcionalidades:
- ✅ Suporte para frontend enviando dados flat ou aninhados
- ✅ Conversão automática de role (string) para roles (array)
- ✅ Processamento inteligente de redes sociais
- ✅ Valores padrão automáticos
- ✅ Busca por username/email para verificação de unicidade
- ✅ Mensagens em português
- ✅ Tratamento completo de erros

### 🚀 Performance:
- ✅ Populamento automático de avatarId e coverId
- ✅ Paginação otimizada
- ✅ Busca com regex case-insensitive
- ✅ Índices para consultas rápidas

## Estado Atual:
- ✅ Servidor rodando na porta 3003
- ✅ MongoDB conectado
- ✅ Todas as rotas funcionando
- ✅ Validações implementadas
- ✅ Segurança implementada
- ✅ Compatível com o frontend fornecido

## Como Testar:
1. O servidor já está rodando
2. Use Postman/Insomnia ou o formulário frontend
3. Teste criar um usuário com os dados do formulário
4. Verifique se as validações estão funcionando
5. Teste as buscas e atualizações
