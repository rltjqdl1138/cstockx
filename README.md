## 1. Prerequisite
- nodeJS & npm
- docker
- mySQL
## 2. Create Prisma Server
### 2.1.Installation
```
# npm install prisma -g
```
### 2.2. make files

```
# mkdir prisma & cd prisma
# prisma init
```
it makes 3 files automatically

if message "prisma: command not found" show,
export npm-packages directory to PATH

**Or**

```
# touch docker-compose.yml prisma.yml datamodel.prisma
```

#### 2.2.1 prisma.yml
```
endpoint: http://localhost:4466
datamodel: datamodel.prisma

generate:
  - generator: typescript-client
    output: ../src/generated/prisma-client/

```

#### 2.2.2. docker-compose.yml
```
version: '3'
services:
  prisma:
    image: prismagraphql/prisma:1.29
    restart: always
    ports:
    - "4466:4466"
    environment:
      PRISMA_CONFIG: |
        port: 4466
        # uncomment the next line and provide the env var PRISMA_MANAGEMENT_API_SECRET=my-secret to activate cluster security
        # managementApiSecret: my-secret
        databases:
          default:
            connector: mysql
            host: host.docker.internal
            user: root
            password: 1138877
            rawAccess: true
            port: 3306
            migrations: true
  mysql:
    image: mysql:5.7
    restart: always
    # PORT: "external:internal"
    ports:
    - "33060:3306"
    environment:
      MYSQL_ROOT_PASSWORD: 1138877
    volumes:
      - mysql:/var/lib/mysql
    command:
      --default-authentication-plugin=mysql_native_password
      --character-set-server=utf8mb4
      --collation-server=utf8mb4_unicode_ci
volumes:
  mysql:
  ```
#### 2.2.3. datamodel.prisma
```
type Product {
  id: ID! @unique
  name: String!
}
```
This is just sample. I will edit soon

### 2.3. Run prisma and MySQL in Docker
```
# docker-compose up -d
Creating prisma_mysql_1 ... done
Creating prisma_prisma_1 ... done
```

### 2.4. Deploy
```
# prisma deploy

...
...

Applying changes 1.1s

Your Prisma GraphQL database endpoint is live:

  HTTP:  http://localhost:4466
  WS:    ws://localhost:4466

You can view & edit your data here:

  Prisma Admin: http://localhost:4466/_admin
```

### 2.5. Generate TypeScripte Code
```
# prisma generate
Generating schema __ms
Saving Prisma Client (TypeScript) at .../src/generated/prisma-client/
```

## 3. Make TypeScript Project
First, go to Project's root Directory
### 3.1. Installation
```
# npm install typescript -g
# tsc -virsion
Version X.X.X
```
### 3.2. Create **tsconfig.json**
```
{
  "compilerOptions": {
    "lib": ["es2016", "esnext.asynciterable"]
  }
}
```
### 3.3 Initialize npm project
```
# npm init -y
# npm install --save prisma-client-lib
# npm install --save-dev typescript ts-node
```