# logistica-back - Backend API

## 📋 Tabla de Contenido
- [Arquitectura General](#arquitectura-general)
- [Modulo RBAC](#modulo-rbac)
- [Tech Stack](#tech-stack)
- [Estructura de Directorios](#estructura-de-directorios)
- [Patrones de Error Global](#patrones-de-error-global)
- [Controladores y Servicios](#controladores-y-servicios)
- [Endpoints API](#endpoints-api)
- [Variables de Entorno](#variables-de-entorno)
- [Scripts Disponibles](#scripts-disponibles)

---

## 🏗️ Arquitectura General

La aplicación sigue una arquitectura **NestJS modular** con separación de responsabilidades:

```
src/
  ├── main.ts          # Punto de entrada
  ├── app.module.ts    # Módulo raíz que agrupa todo
  ├── common/          # Capa compartida (guards, filters, pipes, interceptors)
  ├── config/          # Configuración y validación de entorno
  ├── database/        # Capa de datos (repositorios, entidades, prisma)
  ├── security/        # Middlewares y estrategias de autenticación
  ├── admin/           # Módulo administrativo
  ├── licensing/       # Módulo de licencias y activación
  └── health/          # Health checks
```

### Principios de Diseño:
1. **Single Responsibility** - Cada módulo tiene una responsabilidad única
2. **Dependency Injection** - Servicios inyectados a través del constructor
3. **Domain-Driven Design** - Entidades y repositorios bien definidos
4. **Global Error Handling** - Filtro de excepciones centralizado

## Modulo RBAC

El modulo `src/rbac/` esta organizado por responsabilidad y no depende de Prisma ni de otro ORM:

- `domain/` - tipos y tokens del dominio RBAC.
- `decorators/` - `@Permissions()`.
- `guards/` - autorizacion HTTP mediante `RbacGuard`.
- `services/` - escaneo de controladores y sincronizacion.
- `ports/` - contratos de persistencia y adaptador SQL generico.
- `adapters/` - persistencia JSON local para CLI/desarrollo.
- `cli/` - comando de descubrimiento de permisos.

### Escanear permisos

El comando busca `*.controller.ts`, lee `@Permissions()` y genera un catalogo con controlador, metodo, ruta, verbo HTTP y archivo origen:

```bash
npm run rbac:scan -- src .rbac/permissions.json
```

Tambien acepta `--root` y `--output` cuando el shell/npm los reenvia correctamente:

```bash
node dist/rbac/cli/rbac-scan.js --root src --output .rbac/permissions.json
```

El CLI usa JSON por defecto para ejecutarse sin credenciales. Para guardar en una base de datos, la aplicacion debe implementar `RbacPermissionRepository` o usar `SqlRbacPermissionRepository`, que solo requiere un cliente con `query(sql, parameters)` y no conoce Prisma, TypeORM ni Sequelize.

```typescript
RbacModule.forRoot({
  principalProperty: "admin",
  repository: new SqlRbacPermissionRepository(dbClient),
});
```

El orden de guards debe ser autenticacion y luego autorizacion:

```typescript
@UseGuards(AdminJwtAuthGuard, RbacGuard)
@Permissions("devices:revoke")
```

La autorizacion depende exclusivamente de los permisos presentes en el principal autenticado. Un usuario no necesita un rol concreto: basta con que su claim `permissions` incluya el permiso requerido.

---

## 🛠️ Tech Stack

| Tecnología | Propósito |
|------------|-----------|
| **NestJS** | Framework principal para API REST |
| **TypeScript** | Lenguaje con typing estático |
| **Prisma** | ORM para PostgreSQL |
| **PostgreSQL** | Base de datos relacional |
| **Zod** | Validación de esquemas (env validation) |
| **class-validator / class-transformer** | Validación y transformación de clases |
| **argon2** | Hashed de contraseñas |
| **uuid** | Generación de UUIDs |
| **@nestjs/swagger** | Documentación automática API |
| **bcryptjs** | Hasheo de contraseñas (dev) |
| **async-middleware** | Middleware asíncrono utilities |

---

## 📁 Estructura de Directorios Detallada

### `src/common/`
Capa de funcionalidades compartidas:
- `guards/` - Estrategias de autenticación (JWT, Admin JWT)
- `filters/` - Filtros de excepción global (`DomainExceptionFilter`)
- `interceptors/` - Interceptores (Request-log interceptor)
- `decorators/` - Decoradores personalizados (CurrentDevice decorator)
- `utils/` - Utilidades (fingerprint.util.ts, password.util.ts)

### `src/config/`
- `configuration.ts` - Configuración tipo-safe con Zod
- `env.validation.ts` - Validación de variables de entorno obligatorias

### `src/database/`
- `domain/` - Entidades Prisma y enums (device-status.enum.ts)
- `ports/` - Interfaces de repositorio (codes.repository.ts, devices.repository.ts, etc.)
- `prisma/` - Servicio Prisma y módulo de repositorios

### `src/licensing/` ← **Módulo Principal**
Módulo de licencias con:
- `controllers/` - Endpoints HTTP (license.controller.ts, activation.controller.ts)
- `services/` - Lógica de negocio (LicensesService - ahora con manejo de errores personalizado)
- `dto/` - Data Transfer Objects (activate-request.dto.ts, license-response.dto.ts)

### `src/admin/` ← **Módulo Admin**
- `controllers/` - Endpoints admin (admin-auth.controller.ts, devices.controller.ts, codes.controller.ts)
- `services/` - Servicios administrativos

### `src/errors/` ← **Nuevo: Manejo de Errores**
- `error-codes.ts` - Códigos de error estandarizados
- `custom-exception.ts` - Clases de excepciones personalizadas que extienden `AppException`

---

## 🚨 Patrones de Error Global

### Problema Resuelto
Anteriormente había **"magic strings"** dispersos en controladores y servicios:
- `"CREDENTIALS_INVALID"` en `admin-auth.controller.ts:15`
- `"CODE_INVALID"` en `licenses.service.ts:36`
- `"CODE_ALREADY_USED"` en `licenses.service.ts:46`
- `"DEVICE_ALREADY_TRIALED"` en `licenses.service.ts:60`
- `"UNEXPECTED_ERROR"` en `licenses.service.ts:140`

### Solución Implementada

#### 1. `src/errors/error-codes.ts`
```typescript
export enum ErrorCodes {
  CREDENTIALS_INVALID = "CREDENTIALS_INVALID",
  CODE_INVALID = "CODE_INVALID",
  CODE_ALREADY_USED = "CODE_ALREADY_USED",
  DEVICE_ALREADY_TRIALED = "DEVICE_ALREADY_TRIALED",
  UNEXPECTED_ERROR = "UNEXPECTED_ERROR",
}

export enum HttpStatusCodes {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER = 500,
}
```

#### 2. `src/errors/custom-exception.ts`
Clases de excepciones que encapsulan código y status code:
- `AppException` - Base con message, status, code, context
- `CredentialsInvalidException` - 403 FORBIDDEN
- `CodeInvalidException` - 403 FORBIDDEN
- `CodeAlreadyUsedException` - 403 FORBIDDEN
- `DeviceAlreadyTrialedException` - 403 FORBIDDEN
- `UnexpectedErrorException` - 500 INTERNAL_SERVER, con contexto opcional

#### 3. `src/common/filters/domain-exception.filter.ts`
Filtro `@Catch()` que:
- Detecta instancias de `AppException` y usa su status/code
- Para errores genéricos `Error`, retorna 500 Internal Server
- Formatea respuesta JSON consistente:
```json
{
  "statusCode": 403,
  "message": "Código inválido",
  "code": "CODE_INVALID",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/endpoint",
  "requestId": "uuid"
}
```

---

## 👨‍💻 Controladores y Servicios

### LicensesService (Actualizado)
**Antes:** Throwing `new Error("CODE_INVALID")`
**Después:** Throwing `new CodeInvalidException()`

El servicio ahora lanza excepciones tipadas que el filtro global convierte en respuestas HTTP estructuradas.

### AdminAuthController
**Antes:** `throw new Error("CREDENTIALS_INVALID")`
**Después:** `throw new CredentialsInvalidException()`

### Endpoints Principales

#### `POST /api/v1/admin/login`
- Login administrador con bootstrap credentials
- Retorna token JWT o lanza `CredentialsInvalidException` (403)

#### `POST /api/v1/license/activate`
- Activa una licencia con código y fingerprint
- Validaciones:
  - Código inexistente → `CodeInvalidException` (403)
  - Código ya usado → `CodeAlreadyUsedException` (403)
  - Dispositivo ya probado → `DeviceAlreadyTrialedException` (403)
  - Error inesperado → `UnexpectedErrorException` (500)

#### `POST /api/v1/admin/devices/:id/revoke`
- Revocar trial de un dispositivo

#### `GET /api/v1/admin/codes`
- Listar códigos y estado

---

## 🌐 Variables de Entorno

Archivo `.env` requerido:

```env
# Server
PORT=3000

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/logistica"

# Security
ADMIN_BOOTSTRAP_EMAIL=admin@logistica.com
ADMIN_BOOTSTRAP_PASSWORD=secure-password
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=1h

# App Settings
ADMIN_TOKEN_TTL_HOURS=8

# Argon2
ARGON2_MEMORY=65536
ARGON2_TIME=3
ARGON2_PARALLELISM=2
```

---

## 📦 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `dev` | Ejecutar en modo desarrollo con hot-reload |
| `build` | Compilar TypeScript a JavaScript |
| `rbac:scan` | Escanear controladores y generar el catálogo de permisos |
| `start` | Ejecutar en producción |
| `test` | Ejecutar tests (configurar en package.json) |
| `postinstall` | Ejecutar `prisma skills sync` después de install |
| `migrate` | Ejecutar migraciones Prisma (`npx prisma migrate deploy`) |

---

## 🔄 Flujo de Errores

1. **Service detecta error** → Lanza `new CodeInvalidException()`
2. **Nest catches exception** → `DomainExceptionFilter.catch()` se activa
3. **Filter analiza excepción** → Detecta `instanceof CodeInvalidException`
4. **Retorna respuesta JSON** → Status 403 + message "Código inválido" + code "CODE_INVALID"
5. **Cliente recibe error estructurado** → Fácil de manejar en frontend

---

## 📈 Mejoras Realizadas en Este Push

1. ✅ **Eliminado magic strings** - Todos los errores usan clases tipadas
2. ✅ **Consistencia en respuestas** - Todos los errores siguen el mismo formato JSON
3. ✅ **Mejor mantenibilidad** - Los códigos de error están centralizados en `error-codes.ts`
4. ✅ **Mejor documentación** - Los códigos de error son auto-explicativos
5. ✅ **Filtro global robusto** - Maneja tanto excepciones personalizadas como errores genéricos
6. ✅ **Códigos HTTP apropiados** - 403 para errores de negocio, 500 para errores inesperados

---

## 🚀 Despliegue

```bash
# 1. Clonar repositorio
git clone https://github.com/gilbertL97/logistiCustom.git

# 2. Instalar dependencias
npm install

# 3. Ejecutar migraciones
npx prisma migrate deploy

# 4. Iniciar
npm run dev
```

---

**Último commit:** `4259601` - Implement global error management: remove magic strings, add custom exceptions and error filter