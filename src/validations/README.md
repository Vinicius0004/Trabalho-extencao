# Validações com Yup

Este projeto usa Yup para validação de formulários em todo o sistema.

## Schemas Disponíveis

### 1. `studentSchema.js` - Validação de Alunos
Campos validados:
- **Nome**: obrigatório, 3-100 caracteres, apenas letras (incluindo acentos), trim automático
- **CPF**: opcional, se preenchido deve ter 11 dígitos e ser válido (validação com dígitos verificadores)
- **Email**: opcional, formato válido
- **PCD**: opcional, máximo 100 caracteres
- **Descrição**: opcional, máximo 500 caracteres
- **Turma**: opcional, máximo 50 caracteres
- **Anotações**: opcional, máximo 1000 caracteres

### 2. `authSchema.js` - Autenticação
#### Login (`loginSchema`)
- **Email**: obrigatório, formato válido
- **Senha**: obrigatório, mínimo 6 caracteres

#### Registro (`registerSchema`)
- **Nome**: obrigatório, 3-100 caracteres, apenas letras (incluindo acentos)
- **Email**: obrigatório, formato válido, domínio válido, minúsculas
- **Senha**: obrigatório, mínimo 8 caracteres, deve conter:
  - Uma letra minúscula
  - Uma letra maiúscula
  - Um número
  - Um caractere especial (@$!%*?&)
- **Confirmação de senha**: obrigatório, deve ser igual à senha

### 3. `controleInternoSchema.js` - Controle Interno
Campos validados:
- **Aluno**: obrigatório (seleção de aluno)
- **Ingresso**: obrigatório, data válida, não pode ser no futuro
- **Primeira Avaliação**: obrigatório, data válida
- **Segunda Avaliação**: obrigatório, data válida, deve ser posterior à primeira avaliação
- **Primeira Entrevista**: obrigatório, data válida
- **Segunda Entrevista**: obrigatório, data válida, deve ser posterior à primeira entrevista
- **Resultado**: obrigatório, 10-500 caracteres, trim automático

### 4. `encaminhamentoSchema.js` - Encaminhamento
Campos validados:
- **Aluno**: obrigatório (seleção de aluno)
- **Data Admissão**: obrigatório, data válida, não pode ser no futuro
- **Empresa**: obrigatório, 2-200 caracteres, apenas letras, números e caracteres especiais permitidos, trim automático
- **Função**: obrigatório, 2-100 caracteres, apenas letras, trim automático
- **Contato RH**: obrigatório, 3-100 caracteres, aceita email ou telefone, trim automático
- **Data Desligamento**: opcional, deve ser posterior à data de admissão

### 5. `notificacaoSchema.js` - Notificações
Campos validados:
- **Título**: obrigatório, 3-200 caracteres, trim automático
- **Data**: obrigatório, data válida
- **Descrição**: opcional, máximo 500 caracteres

## Uso em Componentes

```javascript
import { validateSchema } from '../validations';
import { studentSchema } from '../validations/studentSchema';

function MyComponent() {
  const [errors, setErrors] = useState({});
  
  const handleSubmit = async () => {
    const result = await validateSchema(studentSchema, formData);
    
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    
    setErrors({});
    // Continua com a submissão...
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={formData.name} onChange={...} />
      {errors.name && <span className="error-text">{errors.name}</span>}
    </form>
  );
}
```

## Estilo CSS

O estilo `.error-text` está definido globalmente em `src/styles/global.css`:

```css
.error-text {
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 4px;
  display: block;
  font-weight: 600;
  line-height: 1.4;
}
```

## Características das Validações

✅ **Campos obrigatórios**: validados antes da submissão
✅ **Tamanhos mínimos e máximos**: para todos os campos de texto
✅ **Formato de dados**: email, CPF (validação real com dígitos verificadores), datas
✅ **Validações condicionais**: 
   - Desligamento posterior à admissão
   - Segunda avaliação posterior à primeira
   - Segunda entrevista posterior à primeira
   - Datas não podem ser no futuro
✅ **Validação de CPF**: verificação dos dígitos verificadores
✅ **Senha forte**: mínimo 8 caracteres com maiúscula, minúscula, número e caractere especial
✅ **Validação de formato**: nomes apenas letras, funções apenas letras, empresa com caracteres permitidos
✅ **Validação de contato**: aceita email ou telefone
✅ **Mensagens claras**: erros em português brasileiro
✅ **Trim automático**: remove espaços em branco
✅ **Validação de datas**: formato e consistência temporal
