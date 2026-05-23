# AISAPH-CV

Plataforma web da Academia Internacional de Socorrismo e Atendimento Pré-Hospitalar de Cabo Verde.

## Estrutura do Projeto

```text
aisaph-cv_vf/
├── cms/          # Strapi CMS (backend + API)
└── frontend/     # Next.js (site público)
```

## Tecnologias

- Frontend: Next.js 16 (App Router), CSS
- CMS: Strapi 5
- Base de Dados: PostgreSQL
- Gestor de Pacotes: npm

---

## Requisitos

- Node.js 18+
- PostgreSQL
- npm

---

## Instalação

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd aisaph-cv_vf
```

### 2. Configurar o CMS (Strapi)

```bash
cd cms
npm install
```

Criar um ficheiro `.env` na pasta `cms`:

```env
HOST=0.0.0.0
PORT=1337

APP_KEYS=your_app_keys
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
JWT_SECRET=your_jwt_secret

DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=aisaph_cv
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_SSL=false
```

### 3. Restaurar a base de dados (opcional)

```bash
pg_restore -U your_username -d aisaph_cv -F c database_backup.dump
```

### 4. Configurar o Frontend

```bash
cd ../frontend
npm install
```

Criar um ficheiro `.env.local`:

```env
STRAPI_INTERNAL_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000

STRAPI_API_TOKEN=your_api_token
```

---

## Desenvolvimento

Executar o CMS:

```bash
cd cms
npm run develop
```

Executar o Frontend:

```bash
cd frontend
npm run dev
```

Acesso local:

- Frontend: `http://localhost:3000`
- Strapi Admin: `http://localhost:1337/admin`

---

## Produção

### CMS

```bash
cd cms
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm start
```

---

## Backup da Base de Dados

### Exportar

```bash
pg_dump -U your_username -d aisaph_cv -F c -f database_backup.dump
```

### Restaurar

```bash
pg_restore -U your_username -d aisaph_cv -F c database_backup.dump
```

---

## Variáveis de Ambiente em Produção

| Variável | Descrição |
|-----------|------------|
| NEXT_PUBLIC_STRAPI_URL | URL pública do Strapi |
| NEXT_PUBLIC_SITE_URL | URL pública do site |
| STRAPI_API_TOKEN | Token gerado no Strapi |
| DATABASE_HOST | Host da base de dados |
| DATABASE_NAME | Nome da base de dados |
| DATABASE_USERNAME | Utilizador da base de dados |
| DATABASE_PASSWORD | Palavra-passe da base de dados |

---

## Notas

- Não adicionar ficheiros `.env` ao Git.
- Garantir que `.gitignore` contém:

```gitignore
.env
.env.local
.env.production
node_modules
.next
build
dist
```
## K8s

# 1. Create the pull secret on the cluster (one-time)
kubectl create secret docker-registry gitlab-registry-secret \
  --namespace=production \
  --docker-server=registry.sintaxy.com \
  --docker-username=<YOUR_GITLAB_USERNAME> \
  --docker-password=<YOUR_PAT_OR_PASSWORD> \
  --docker-email=<YOUR_EMAIL>

# 2. Build & push images
chmod +x docker-build.sh
./docker-build.sh v1.0.0   # or just: ./docker-build.sh

# 3. Apply K8s manifests (see deployment order in the plan)
kubectl apply -f k8s/