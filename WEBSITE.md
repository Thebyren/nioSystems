# WEBSITE.md — Especificación integral del website actual de NioSystems

## 1) Resumen general del sitio

El sitio `nio.gt` es un website corporativo estático construido con **Astro** para presentar:

- Propuesta de valor de NioSystems (“Primero diagnosticamos. Después construimos.”).
- Catálogo de soluciones Odoo e infraestructura (`/soluciones/`, `/infraestructura/`).
- Integraciones técnicas, destacando Recurrente para Odoo (`/integraciones/`).
- Casos documentados (`/casos/` y rutas dinámicas `/casos/[slug]/`).
- Información legal (`/privacidad/`) y manejo de error (`/404/`).

El tono visual y narrativo es de **documento técnico/brutalista**: marco de “pliego”, códigos de sección, etiquetas monoespaciadas, paneles diagnósticos y estados operativos.

---

## 2) Stack, build, dominio y arquitectura Astro

## 2.1 Stack técnico del sitio

- Framework: `astro` (`^7.0.7`)
- Integración Astro: `@astrojs/sitemap` (`^3.7.4`)
- Tipado funciones Cloudflare: `@cloudflare/workers-types`
- Runtime Node requerido: `>=22.12.0`

Scripts (`package.json`):

- `npm run dev` → `astro dev`
- `npm run build` → `astro build`
- `npm run preview` → `astro preview`

## 2.2 Configuración Astro y despliegue

Archivo: `astro.config.mjs`

- `output: 'static'` → build estático (no SSR en runtime para páginas Astro).
- `site: 'https://nio.gt'` → base para canonical/sitemap/URLs absolutas.
- `trailingSlash: 'always'` → rutas públicas con slash final.
- `integrations: [sitemap()]` → generación de sitemap.

## 2.3 Dominio y redirección

- Dominio principal: `https://nio.gt`
- Redirección de `www` a apex en `public/_redirects`:
  - `https://www.nio.gt/* https://nio.gt/:splat 301`

## 2.4 Estructura de archivos relevante

- Layout base y SEO global:
  - `src/layouts/Base.astro`
- Estilos globales:
  - `src/styles/global.css`
- Componentes compartidos home:
  - `src/components/Nav.astro`
  - `src/components/Hero.astro`
  - `src/components/Filosofia.astro`
  - `src/components/Servicios.astro`
  - `src/components/EstadoNioberp.astro`
  - `src/components/Contacto.astro`
  - `src/components/Footer.astro`
- Páginas:
  - `src/pages/index.astro`
  - `src/pages/soluciones.astro`
  - `src/pages/integraciones.astro`
  - `src/pages/infraestructura.astro`
  - `src/pages/casos/index.astro`
  - `src/pages/casos/[slug].astro`
  - `src/pages/privacidad.astro`
  - `src/pages/404.astro`
- Datos de casos:
  - `src/data/casos.ts`
- Assets públicos:
  - `public/favicon.ico`
  - `public/favicon.svg`
  - `public/og-default.png`
  - `public/robots.txt`
  - `public/_redirects`
  - `public/llms.txt`
- Funciones Cloudflare Pages (backend contacto):
  - `functions/Contacto.ts`
  - `functions/api/contacto.ts`

---

## 3) SEO global, canonical, Open Graph, Twitter y Schema

## 3.1 Metadatos globales (Base.astro)

Props por defecto:

- `title`: `NioSystems | Primero diagnosticamos`
- `description`: consultoría Odoo ERP para Guatemala/LATAM con FEL/DTE, IGSS, ISR.
- `ogImage`: `/og-default.png`
- `noindex`: `false`

Comportamiento:

- Si `noindex = false` → `<link rel="canonical" href="...">`
- Si `noindex = true` → `<meta name="robots" content="noindex">`
- OG:
  - `og:title`
  - `og:description`
  - `og:url`
  - `og:type=website`
  - `og:image` absoluto usando `Astro.site`
- Twitter:
  - `twitter:card=summary_large_image`
- Meta adicional:
  - `msvalidate.01=947077C5F33B9BCE99221DEE75525A1C`
- Ícono:
  - `favicon.svg`

## 3.2 Schema.org por página

- `/` (`index.astro`): `Organization`
  - Incluye nombre, URL, imagen, email, teléfono, logo, dirección (Jutiapa, GT), geocoordenadas, `knowsAbout`, redes `sameAs`, `areaServed`, descripción.
- `/integraciones/`: `SoftwareApplication`
  - Para “Recurrente Checkout para Odoo” (categoría, OS Odoo 19/20, licencia LGPL-3, autor, oferta USD 0, URL App Store).
- `/casos/[slug]/`: `BreadcrumbList`
  - Inicio → Casos → caso actual.

---

## 4) Rutas públicas y contenido visible (ruta por ruta)

## 4.1 `/` (Inicio)

Composición (`src/pages/index.astro`):

- `<Nav />`
- `<Hero />`
- `<Filosofia />`
- `<Servicios />`
- `<EstadoNioberp />`
- `<Contacto />`
- `<Footer />`

### 4.1.1 Navegación (header)

- Links principales:
  - `/soluciones/`
  - `/integraciones/`
  - `/casos/`
  - `/infraestructura/`
- Logo/brand enlaza a `/`.
- CTA desktop: “Diagnóstico gratuito” → `/#contacto`
- Selector de tema (claro/oscuro).
- Menú móvil con hamburguesa + CTA.
- Estado activo por `path.startsWith(href)` y `aria-current="page"`.

### 4.1.2 Hero

- Eyebrow: `Odoo ERP · Guatemala · LATAM`
- H1: `Primero diagnosticamos. Después construimos.` (con efecto outline en “diagnosticamos”).
- Lede: “No vendemos herramienta. Resolvemos problemas…”.
- CTAs:
  - `#contacto`: “Solicitar diagnóstico gratuito”
  - `/casos/`: “Ver casos reales”
- Riel lateral técnico con coordenadas y estado de señal.
- N-Reveal SVG + ondas animadas.
- Panel `diagnostico.log` (extracto de caso real) con 5 líneas:
  - sistema sin actualizar: 4 años
  - FEL/DTE al día
  - inventario con desviación Q 1,04M
  - 23 ajustes a mano
  - historial en riesgo (1 sola copia)
  - cierre: informe preliminar en 72h sin costo
- Franja de estado:
  - Odoo core operativo
  - FEL/DTE conectado
  - IGSS/ISR validado
  - Link externo App Store Recurrente

### 4.1.3 Filosofía (`SEC. 01`)

H2: “El diagnóstico es el trabajo.”

Proceso en 3 cláusulas:

1. Diagnóstico primero
2. Auditoría antes de tocar
3. Documentación mecánica

### 4.1.4 Servicios resumen (`SEC. 02`)

Tarjetas visibles:

- `SVC-01` Implementación Odoo
- `SVC-02` Migración y rescate
- `SVC-03` Diagnóstico de arquitectura
- `SVC-04` Infraestructura propia

Bloque adicional:

- CTA a `/soluciones/` (“Ver catálogo completo →”)
- Nota: `9 líneas de servicio · conectores logísticos · hardware propio`
- Feature module: Recurrente para Odoo + CTA `/integraciones/#recurrente`

### 4.1.5 Estado NioBerp (`SEC. 03`)

- Presenta NioBerp como I+D en Rust no comercial.
- Leyenda de estados: Hecho / En progreso / Pendiente / Planificado.
- 4 fases desplegables con ítems y conteos “X de Y hechos”:
  - Fase 1: kernel financiero
  - Fase 2: dinero real y confiable
  - Fase 3: cumplimiento regional
  - Fase 4: resiliencia y escala

### 4.1.6 Contacto (`SEC. 04`)

- H2: “Empecemos con el diagnóstico.”
- Texto de oferta sin costo.
- CTAs:
  - WhatsApp: `https://wa.me/50255155215?...`
  - Email: `mailto:hola@nio.gt?subject=Consulta%20desde%20nio.gt`
- Promesa: “Respondemos en menos de 24 h · Sin compromiso”

### 4.1.7 Footer (cajetín técnico)

- Proyecto: “Infraestructura que no se nota, porque funciona”
- Ubicación: Jutiapa + coordenadas
- Contacto: `hola@nio.gt`
- Revisión: `A · 2026`
- Legal: link a `/privacidad/`

---

## 4.2 `/soluciones/`

Página catálogo DOC. NIO-SVC con navegación por categorías (`CAT-A` a `CAT-E`) y estado general.

### 4.2.1 Categorías

- `CAT-A` ERP · Odoo
- `CAT-B` Integraciones
- `CAT-C` Infraestructura y diagnóstico
- `CAT-D` Observabilidad operativa
- `CAT-E` Hardware

### 4.2.2 Servicios (todos)

| Código | Nombre | Problema que resuelve | Descripción (resumen fiel) | Estado | Tags | Casos relacionados |
|---|---|---|---|---|---|---|
| SVC-01 | Implementación Odoo | Arrancar Odoo en GT con FEL, IGSS, ISR desde día 1 | Implementación Community/Enterprise, SAT FEL/DTE (l10n_gt_fel_tekra), validación NIT/CUI-DPI, migración de datos y capacitación | Disponible | Community, Enterprise, FEL/DTE, l10n_gt_fel_tekra, IGSS, ISR | CASO-001, CASO-009 |
| SVC-02 | Migración y rescate de versión | Instancia vieja/rota/sin actualizar | Migraciones de cualquier versión, incluye salto v10→v19 con nómina, preservando historial y trazabilidad | Disponible | v10→v19, Nómina, Módulos custom, Datos históricos | CASO-008 |
| SVC-03 | Módulos y desarrollo a medida | Procesos no cubiertos por Odoo estándar | Módulos de diagnóstico vehicular, tracking web en tiempo real, parches POS, reportes fiscales por entidad | Disponible | Python, OWL/QWeb, SQL, Reportes, POS | CASO-007, CASO-010 |
| SVC-04 | Integraciones de plataformas | Doble digitación entre sistemas | Conexiones WooCommerce, migración CRM HubSpot, pasarelas Recurrente/QpayPro | Disponible | WooCommerce, HubSpot, Recurrente, QpayPro, REST | — |
| SVC-05 | Conectores logísticos propios | Envíos fuera de Odoo sin trazabilidad | Conectores propios Forza, Guatex, CargoExpreso, Boxful (próximo) | En producción · Boxful próximo | Forza, Guatex, CargoExpreso, Boxful, Trazabilidad | — |
| SVC-06 | Automatización WhatsApp + IA | Atención manual repetitiva sobre pedidos | API oficial WhatsApp Business + CRM Odoo + flujos e IA opcional contextual | Disponible | WhatsApp API, IA, CRM, Automatización, Notificaciones | — |
| SVC-07 | Hosting multi-tenant | Gestión compleja de servidores/backup/certificados | Infraestructura Docker + PostgreSQL + Caddy TLS auto, backup diario validado | Disponible · Cupo limitado | Docker, PostgreSQL, Caddy, TLS, Backup validado | — |
| SVC-08 | Diagnóstico y corrección de arquitectura | Inventario no cuadra, cierres lentos, consumo alto | Detección y corrección de sobrevaloración, cuellos de memoria y vulnerabilidades POS | Disponible | Valuación, Contabilidad, POS, Memoria, Rendimiento | CASO-002, CASO-003, CASO-004, CASO-005 |
| SVC-09 | Auditoría fiscal y reportes | Reportes fiscales/auditoría manuales | Libro mayor, ventas/compras por régimen, SAT, formatos IGSS y gobierno | Disponible | SAT, IGSS, Libro mayor, Reportes, Guatemala | CASO-006 |
| SVC-10 | Portal de clientes: observabilidad de la relación | Falta de visibilidad de estado/horas/decisiones | Portal con estado proyecto, tickets, horas, saldo, decisiones y pendientes en tiempo real | En desarrollo | Proyecto, Soporte, Tickets, Horas, Decisiones, ADR | — |
| HW-01 | nioClock: terminal de asistencia | Control de asistencia desconectado y dependiente de terceros | Hardware biométrico + RFID, OTA, integración Odoo Attendance, ESP32-C3/S6 | Desarrollo avanzado | ESP32, RFID, Biométrico, OTA, Odoo Attendance | — |

Notas visibles adicionales:

- Hero menciona explícitamente SVC-01 a SVC-09 como disponibles.
- `HW-01` se muestra separado como estado de desarrollo.
- CTA final: email y WhatsApp para diagnóstico de código aplicable.

---

## 4.3 `/integraciones/`

Página DOC. NIO-INT enfocada en **INT-01 Recurrente para Odoo** y bloque de INT-02 a INT-06.

## 4.3.1 INT-01 Recurrente para Odoo

Datos visibles:

- Módulo gratis
- Licencia LGPL-3
- Odoo 19 y 20
- Community + Enterprise
- Monedas GTQ + USD
- Descarga App Store: `https://apps.odoo.com/apps/modules/20.0/payment_recurrente_api`

Capacidades documentadas:

1. Checkout alojado (tarjeta no pasa por servidor Odoo).
2. Tarjetas guardadas para cobros futuros (suscripciones).
3. Reembolsos totales/parciales con idempotencia.
4. Seguridad:
   - Webhooks firmados con Svix
   - Verificación de estado vía API
   - Llaves test/live separadas
   - Neutralización de credenciales en bases neutralizadas

Flujo de pago visible:

1. Cliente paga en checkout Recurrente.
2. Odoo consulta API con llave secreta + webhook firmado.
3. Odoo marca transacción pagada/pendiente/fallida.

Regla de confianza explícita: ni redirección ni cuerpo de webhook son “verdad”; el estado se consulta a API.

Pasos de instalación (5):

1. Instalar módulo y abrir configuración proveedor Recurrente.
2. Pegar llave `sk_test_...` o `sk_live_...`.
3. Registrar webhook (`intent.*`, `refund.create`) y secreto `whsec_...` en Odoo.
4. Probar sandbox con tarjeta `4242 4242 4242 4242`.
5. Habilitar proveedor y opcional guardar métodos de pago.

Requisito visible:

- Cuenta activa en Recurrente.
- El módulo es gratis; procesamiento depende de condiciones de Recurrente.

## 4.3.2 Integraciones INT-02 a INT-06

| Código | Integración | Descripción fiel | Estado | Tags |
|---|---|---|---|---|
| INT-02 | Conectores logísticos | Forza, Guatex, CargoExpreso en producción; Boxful próximo; trazabilidad completa en Odoo | En producción | Forza, Guatex, CargoExpreso, Boxful |
| INT-03 | WhatsApp Business | Notificaciones, entregas, alertas inventario y flujos CRM; IA opcional | Disponible | WhatsApp API, CRM, IA |
| INT-04 | Tiendas en línea | WooCommerce conectado en tiempo real (inventario, pedidos, clientes) | Disponible | WooCommerce, REST, Inventario |
| INT-05 | Pasarela QpayPro | Opción de cobro local integrada al flujo de facturación Odoo | Disponible | QpayPro, Pagos |
| INT-06 | Migración de CRM | Migración desde HubSpot a Odoo CRM con trazabilidad comercial | Disponible | HubSpot, CRM, Migración |

CTA final:

- WhatsApp para integración a medida
- Email `hola@nio.gt`

---

## 4.4 `/infraestructura/`

Página DOC. NIO-INF con stack, hosting, hardware y LT-01.

## 4.4.1 Stack técnico por categorías

1. Lenguajes
   - Python
   - Rust
   - JavaScript
   - SQL

2. Plataformas y runtime
   - Odoo ERP (Community/Enterprise, v10-v19)
   - Docker
   - PostgreSQL
   - Caddy
   - Linux (Debian/Ubuntu)

3. CI/CD y operaciones
   - GitHub Actions (build → test → security → deploy)
   - Trivy
   - Backup diario con verificación
   - Monitoreo continuo

4. Integraciones y protocolos
   - REST / JSON-RPC / XML-RPC
   - OAuth 2.0 / JWT
   - WhatsApp Business API
   - SAT Guatemala (FEL/DTE)

## 4.4.2 Arquitectura de hosting

Contenido visible:

- Cada cliente en contenedor Docker aislado.
- PostgreSQL dedicado.
- Caddy con TLS automático.
- Respaldo diario + verificación de integridad.
- Pipeline CI/CD automático (sin push manual a producción).

Diagrama textual ARCH-DIAGRAM REV A incluye:

- Actions: build, test, trivy scan, deploy ✓
- Caddy TLS auto
- Docker red aislada
- Odoo instance + PostgreSQL
- Backup diario integridad OK

## 4.4.3 nioClock (HW-01)

- Estado: Desarrollo avanzado (pruebas de campo en curso).
- Descripción: terminal asistencia modular, biométrico + RFID.
- Base hardware: ESP32-C3/S6.
- Firmware: arquitectura dos etapas y OTA.
- Integración: Odoo Attendance nativo.
- Dependencia cloud de terceros: ninguna.

## 4.4.4 NioBerp (LT-01)

- “NIOBERP · Rust”
- Estado: “No comercial · I+D”
- Mensaje: laboratorio de investigación para concurrencia, acceso a datos y UI; aprendizaje aplicado a proyectos productivos.
- Link a estado en home: `/#nioberp`

CTA final:

- Email/WhatsApp para diagnóstico de infraestructura.

---

## 4.5 `/casos/` (índice)

Página DOC. NIO-CASOS:

- Titular: “Experiencia aplicada, resultados documentados.”
- Aclara confidencialidad (detalles generalizados).
- Status strip:
  - 11 casos documentados
  - sectores listados
  - cobertura geográfica y rango v10→v19

Lista de tarjetas por caso:

- Muestra `id`, `sector`, `titulo`, bloque “Resultado”, `tags` y CTA “Leer el caso completo”.
- Cada tarjeta enlaza a `/casos/{slug}/`.

CTA final “Su caso” con email y WhatsApp.

---

## 4.6 Rutas dinámicas de casos (`/casos/[slug]/`)

Generación de rutas:

- Archivo: `src/pages/casos/[slug].astro`
- `getStaticPaths()` recorre `casos` y genera páginas estáticas para cada `slug`.
- Para cada ruta pasa props:
  - `caso` actual
  - `prev` y `next` (navegación entre casos)

Contenido de cada página dinámica:

- Breadcrumb: `Casos / {ID}`
- Meta: `ID` + `sector`
- H1 título del caso
- Bloques:
  - Contexto
  - Problema identificado
  - Intervención
  - Resultado
- Tags
- Nota de confidencialidad
- Pager caso anterior/siguiente
- CTA final (WhatsApp + email)

SEO específico:

- `title`: `{titulo} | Caso Odoo | NioSystems`
- `description`: título + primera frase de resultado, recortada ~158 chars.
- JSON-LD `BreadcrumbList`

### 4.6.1 Los 11 casos de `src/data/casos.ts`

| ID | Slug | Sector | Título |
|---|---|---|---|
| CASO-001 | caso-001-precios-multizona | Distribución mayorista | Precios por zona, recompensas de volumen y fuerza de ventas en campo |
| CASO-002 | caso-002-sobrevaloracion-inventario | Importación / Comercio exterior | Diagnóstico y corrección de sobrevaloración de inventario de Q1,000,000 |
| CASO-003 | caso-003-contabilidad-anglosajona-memoria | Restauración / Food service | Configuración de contabilidad anglosajona consumía 53% de la memoria de instancia |
| CASO-004 | caso-004-pos-condicion-de-carrera | Hotelería / Restauración · Instancia propia | Condición de carrera en POS: empleados eliminaban órdenes ya cobradas |
| CASO-005 | caso-005-pos-saas-sin-codigo | Restauración · Instancia SaaS oficial | El mismo fraude de POS, sin acceso a código: solución por configuración y trazabilidad |
| CASO-006 | caso-006-facturacion-igss | Salud / Sector público | Automatización de formatos de facturación para contratos IGSS |
| CASO-007 | caso-007-diagnostico-vehicular | Manufactura | Módulo de diagnóstico vehicular integrado a ventas y contabilidad |
| CASO-008 | caso-008-migracion-v10-v19 | Manufactura / Construcción | Migración v10 → v19 con nómina completa |
| CASO-009 | caso-009-multiempresa-multimoneda | Consultoría contable | Estructura multiempresa para cartera de clientes con multi-moneda |
| CASO-010 | caso-010-tracking-pedidos-web | E-commerce / Equipamiento industrial | Módulo de tracking de pedido visible al cliente en tiempo real desde la web |
| CASO-011 | caso-011-soporte-regional-multisucursal | Soporte regional · Centroamérica | Soporte continuo a instancia multi-sucursal con presencia en 4 países |

#### CASO-001

- Contexto: distribuidora con 3 CEDIS y ruteros con conectividad intermitente.
- Problema: precios no contemplaban zona/volumen; cálculo externo en hojas y recaptura manual.
- Intervención: lógica de precios multi-zona, volumen por período, ventas móvil offline-first y múltiples UoM.
- Resultado: eliminación de cálculo manual, precios correctos en campo y cero descuadres al cierre.
- Tags: Distribución, Multi-zona, App móvil, Múltiples UoM, Offline-first.

#### CASO-002

- Contexto: importadora industrial con valoración promedio y ajustes aduaneros manuales.
- Problema: diferencia ~Q1,000,000 en ~120 movimientos por modificación previa en recálculo contable.
- Intervención: trazado movimiento a movimiento, corrección en código, módulo de prorrateo DUCA al ingreso.
- Resultado: diferencia corregida y prevención de nuevas acumulaciones.
- Tags: Inventario, Valoración, DUCA, Importaciones, Código fuente Odoo.

#### CASO-003

- Contexto: cadena de 5 POS con cierres lentos y caídas en picos.
- Problema: contabilidad anglosajona activada generaba millones de líneas y consulta consumía 53% RAM.
- Intervención: análisis SQL de cierre POS, trazado a configuración, desactivación anglosajona y limpieza de asientos.
- Resultado: memoria normalizada sin cambiar hardware.
- Tags: POS, Rendimiento, Contabilidad, SQL, Restaurantes.

#### CASO-004

- Contexto: hotel/restaurante alto volumen.
- Problema: condición de carrera en POS durante transición de pago/sincronización permitía eliminar órdenes cobradas.
- Intervención: análisis de estados en código POS y parche de núcleo bloqueando eliminación al iniciar pago.
- Resultado: vulnerabilidad cerrada de forma transparente.
- Tags: POS, Seguridad, Condición de carrera, Núcleo Odoo, Hotelería.

#### CASO-005

- Contexto: 2 restaurantes en SaaS oficial odoo.com.
- Problema: mismo fraude POS de CASO-004 sin acceso a código/base para parchear.
- Intervención: permisos restringidos + trazabilidad de estado de caja para auditoría visible.
- Resultado: vector de fraude cerrado por configuración replicable en SaaS.
- Tags: POS, SaaS, Seguridad, Permisos, Trazabilidad.

#### CASO-006

- Contexto: intermediaria de equipo médico con contratos IGSS/gobierno.
- Problema: armado manual de formatos por entidad copiando desde Word.
- Intervención: mapeo formatos, módulo que detecta entidad y selecciona plantilla QWeb con campos del contrato.
- Resultado: facturación automatizada por entidad; proceso de horas pasó a botón.
- Tags: IGSS, Sector público, QWeb, Automatización.

#### CASO-007

- Contexto: manufactura motos con diagnósticos en papel.
- Problema: sin trazabilidad digital diagnóstico→presupuesto→OT→inventario.
- Intervención: módulo completo de diagnóstico vehicular integrado a ventas, inventario y contabilidad.
- Resultado: ciclo completo trazable sin doble captura.
- Tags: Manufactura, Módulo custom, Órdenes de trabajo, Inventario.

#### CASO-008

- Contexto: empresa construcción/asfaltos en v10 con años de datos.
- Problema: fuera de soporte, salto de 6 versiones mayores y riesgo de pérdida de datos.
- Intervención: migración por etapas en staging, transformaciones de esquema por salto y reescritura custom para v19.
- Resultado: v19 productiva con historial íntegro y nómina operativa desde primer período.
- Tags: Migración, v10→v19, Nómina, Construcción.

#### CASO-009

- Contexto: consultora contable multicompañía y multimoneda.
- Problema: cruces de asientos entre compañías y consolidado con conversión incorrecta.
- Intervención: reconfiguración jerarquías intercompañía, reconciliación automática, multi-moneda y reportes separados/consolidados.
- Resultado: aislamiento correcto y cero correcciones manuales en siguiente cierre.
- Tags: Multiempresa, Contabilidad, Multi-moneda, Consultoría.

#### CASO-010

- Contexto: e-commerce de equipamiento de laboratorio LATAM con logística compleja.
- Problema: cliente sin visibilidad post-confirmación; seguimiento manual por equipo comercial.
- Intervención: módulo de tracking con etapas técnicas + código único web y actualización en tiempo real desde Odoo.
- Resultado: autoseguimiento cliente y baja medible de consultas.
- Tags: E-commerce, Tracking, LATAM, Sitio web, Importaciones.

#### CASO-011

- Contexto: empresa multi-sucursal en 4 países con una instancia compartida.
- Problema: soporte regional con variaciones fiscales y cambios sin afectar otras sucursales activas.
- Intervención: soporte técnico-funcional continuo 2 años, ajustes por unidad, coordinación multi-sucursal y documentación por país.
- Resultado: estabilidad regional por dos años sin incidentes inter-sucursal.
- Tags: Regional, Centroamérica, Multi-sucursal, Soporte continuo.

---

## 4.7 `/privacidad/`

Documento legal (DOC. NIO-LEG):

- Responsable: NioSystems, Jutiapa, correo `hola@nio.gt`.
- Datos recogidos:
  - No formularios/cuentas/analítica/publicidad para navegación.
  - Solo datos cuando contactan por correo o WhatsApp.
- Uso: responder consultas, diagnóstico/propuesta; no venta de datos.
- Terceros:
  - Cloudflare (hosting y datos técnicos/IP)
  - Google Fonts
  - WhatsApp/Meta y proveedor de correo
- Almacenamiento local:
  - solo preferencia de tema en navegador (no tracking cookie).
- Derechos ARCO simplificados por email.
- Cambios publicados en esta misma página.
- Fecha visible: octubre 2026.

---

## 4.8 `/404/`

Página de error no encontrada:

- Título: “No encontramos esa página.”
- Mensaje: posible cambio de enlace.
- Botones a:
  - `/`
  - `/soluciones/`
  - `/integraciones/`
  - `/casos/`
- SEO: `noindex` activado desde `Base`.

---

## 5) Estilos visuales y comportamiento de diseño

Fuente principal de diseño: `src/styles/global.css`.

## 5.1 Variables CSS principales

Tokens globales:

- Tipografías:
  - `--font-sans: Archivo`
  - `--font-mono: ui-monospace...`
- Layout:
  - `--container: 1120px`
  - `--gutter: clamp(16px, 4vw, 32px)`
  - `--sheet-gap`
- Bordes/radios/transición:
  - `--radius-btn: 2px`
  - `--transition: .15s ease-out`

Paleta base dark:

- Azules: `--niobium-blue`, `--niobium-blue-hover`, `--nio-indigo`
- Ámbar: `--nio-amber`
- Fondo/tintas/bordes definidos por `--bg`, `--ink`, `--border`, etc.
- `color-scheme: dark`

Tema light (`[data-theme="light"]`):

- redefine fondo, borde, acento, tintas y `color-scheme: light`

## 5.2 Tipografía, colores y espaciado

- H1/H2/H3 con pesos altos y tracking negativo.
- Párrafos en `--ink-secondary`.
- Énfasis “outline” por `.outline-word` (texto hueco con stroke).
- `section` con padding vertical `clamp(...)` y líneas divisorias entre secciones.

## 5.3 Layout `.sheet` y estética “pliego técnico/brutalista”

- `.sheet` envuelve todo el body:
  - borde perimetral
  - patrón de puntos radial (papel técnico)
  - marcas de registro (`.reg-mark`) en esquinas
  - etiqueta superior `.sheet-ref` (`DOC. NIO-INF-01 · REV A`)
- Filosofía visual: documento técnico, no landing decorativa.

## 5.4 Botones y componentes comunes

- `.btn`, `.btn-primary`, `.btn-ghost`
- Interacciones por hover/transición y bordes secos.

## 5.5 Navegación desktop/móvil

- Desktop:
  - links monoespaciados con prefijo `/`
  - estado activo `.is-active`
- Móvil:
  - hamburguesa visible `<980px`
  - dropdown `.mobile-menu` con atributo `hidden`
  - CTA full-width

## 5.6 Hero, N-Reveal, paneles diagnóstico y animaciones

- Hero grid 3 columnas (riel/texto/visual).
- SVG N-Reveal con anillos y clip de la “N”.
- Ondas `ring-pulse` animadas (`@keyframes ring-emit`) saliendo del centro.
- Panel `.diag-panel` superpuesto al símbolo.
- `status-dot` con animación ping (`signal-ping`).

## 5.7 Grids y patrones de tarjetas

- `list` de servicios home: malla 2 columnas compartiendo bordes.
- `proceso` como tabla de cláusulas.
- Repetición de patrones tipo card/table en soluciones, integraciones, casos e infraestructura.

## 5.8 Breakpoints responsive

- `max-width: 980px`: nav móvil/hamburguesa.
- `max-width: 920px`: hero 1 columna, oculta riel/N-Reveal.
- `max-width: 768px`: compacta secciones y footer a 1 columna.
- `max-width: 640px`: elimina marco `.sheet` para ganar ancho útil.
- Otros breakpoints locales por página (`860`, `760`, `720`, `480`).

## 5.9 Accesibilidad y reduced motion

- `:focus-visible` con outline de acento.
- `aria-label`, `aria-current`, `aria-expanded`, `aria-controls`, `aria-pressed` en navegación/tema.
- `role="img"` + `aria-label` en panel diagnóstico.
- `prefers-reduced-motion: reduce` desactiva animaciones de pulsos.

## 5.10 Estilos locales importantes por componente/página

- `Servicios.astro`: `.catalog-cta`, `.module-feature` destacado Recurrente.
- `EstadoNioberp.astro`: leyenda/dots por estado, acordeón `<details>` con pills y conteos.
- `soluciones.astro`: `cat-nav`, `svc-grid` adaptativa, `estado-pill`, `tag-row`.
- `integraciones.astro`: `badge-row`, panel `flow`, `cap-grid`, `int-grid`.
- `infraestructura.astro`: `stack-grid`, `arch-block`, `spec-row`, `lt-card`.
- `casos/index.astro`: cards lineales y etiquetas sector.
- `casos/[slug].astro`: bloques con borde semántico por tipo (problema/intervención/resultado), pager prev/next.
- `privacidad.astro`: tipografía legal y listas.
- `404.astro`: layout minimal de error con CTA.

---

## 6) Interacciones JavaScript y comportamiento dinámico

## 6.1 Selector de tema (Base + Nav)

- En `<head>`, script inline:
  - Lee `localStorage.theme`.
  - Si no existe, usa `prefers-color-scheme: light` para decidir `light`/`dark`.
  - Aplica `data-theme` al `<html>` antes del render visible.
- Botón de tema en `Nav`:
  - Alterna `data-theme`.
  - Guarda en `localStorage`.
  - Actualiza `aria-label` (“Cambiar a tema claro/oscuro”).
  - Actualiza `aria-pressed`.

## 6.2 Menú móvil e inert

Script inline en `Nav.astro`:

- `openMenu()`:
  - pone `inert` a `main, footer`
  - `aria-expanded=true`
  - remueve `hidden` de `#mobile-menu`
  - agrega clase `.menu-open`
- `closeMenu()`:
  - remueve `inert`
  - `aria-expanded=false`
  - vuelve a ocultar menu (`hidden`)
  - quita `.menu-open`
- Cierre adicional:
  - click en link del menú
  - click fuera del nav
  - tecla `Escape`

## 6.3 Enlaces mailto/WhatsApp

Uso intensivo de deep links:

- `mailto:` con `subject` prellenado por contexto de página.
- `wa.me` con texto prellenado (diagnóstico, integraciones, infraestructura, casos).
- En casos dinámicos, link WA se construye con `encodeURIComponent` incluyendo ID + título.

## 6.4 Funciones Cloudflare de contacto (`functions/Contacto.ts` y `functions/api/contacto.ts`)

## 6.4.1 Variables de entorno usadas

- `RESEND_API_KEY`
- `CONTACT_EMAIL`
- `TURNSTILE_SECRET_KEY` (solo en `functions/api/contacto.ts`)

## 6.4.2 Flujo general POST

1. Lee `FormData` (`nombre`, `empresa`, `contacto`, `problema`).
2. Valida campos obligatorios.
3. (ruta `api/contacto`) valida Turnstile:
   - token `cf-turnstile-response`
   - verify endpoint Cloudflare Turnstile
   - usa IP `CF-Connecting-IP` opcional
4. Si válido, envía email a Resend API.
5. Responde JSON con CORS fijo a `https://nio.gt`.

## 6.4.3 Respuestas HTTP

- `200` → `{ ok: true }`
- `400` → campos incompletos o verificación faltante
- `403` → Turnstile no válido (solo `api/contacto`)
- `500` → error interno / error al enviar
- `OPTIONS` → `204` preflight CORS (`POST, OPTIONS`, `Content-Type`)

## 6.4.4 Seguridad implementada

- CORS restringido a `https://nio.gt`
- Turnstile para anti-bot (`api/contacto`)
- Verificación de éxito en respuesta Turnstile
- Separación de secretos por variables de entorno

> Nota: este documento no incluye ningún valor secreto, solo nombres de variables y comportamiento.

---

## 7) Assets públicos y archivos de plataforma

## 7.1 `public/favicon.ico` y `public/favicon.svg`

- Favicon en ambos formatos.
- `favicon.svg` también se usa como logo de marca en navegación (`img.brand-mark`).

## 7.2 `public/og-default.png`

- Imagen Open Graph por defecto para metadatos sociales.

## 7.3 `public/robots.txt`

- `User-agent: *`
- `Allow: /`
- `Sitemap: https://nio.gt/sitemap-index.xml`

## 7.4 `public/_redirects`

- Redirección 301 de `www.nio.gt` a `nio.gt`.

## 7.5 `public/llms.txt`

Resumen textual para consumo por modelos/sistemas:

- descripción NioSystems
- servicios y rutas
- casos
- recurso de Recurrente App Store
- aviso de privacidad

---

## 8) Tabla final: rutas, componentes y fuentes de contenido

| Ruta pública | Tipo | Componentes/layout | Fuente de contenido principal |
|---|---|---|---|
| `/` | Estática | `Base`, `Nav`, `Hero`, `Filosofia`, `Servicios`, `EstadoNioberp`, `Contacto`, `Footer` | Texto inline en componentes + schema `Organization` en `index.astro` |
| `/soluciones/` | Estática | `Base`, `Nav`, `Footer` | Catálogo inline `catalogo[]` + mapeo `casos` (`casoLabel`, `casoSlug`) |
| `/integraciones/` | Estática | `Base`, `Nav`, `Footer` | Arrays inline `capacidades`, `pasos`, `otras`; schema `SoftwareApplication` |
| `/infraestructura/` | Estática | `Base`, `Nav`, `Footer` | Arrays/objetos inline `stack`, `hardware` |
| `/casos/` | Estática | `Base`, `Nav`, `Footer` | `src/data/casos.ts` listado de tarjetas |
| `/casos/{slug}/` | Estática generada por build | `Base`, `Nav`, `Footer` | `src/data/casos.ts` vía `getStaticPaths()` + plantilla en `[slug].astro` |
| `/privacidad/` | Estática | `Base`, `Nav`, `Footer` | Texto legal inline en `privacidad.astro` |
| `/404/` | Estática especial | `Base` (`noindex`), `Nav`, `Footer` | Texto/CTAs inline en `404.astro` |

---

## 9) Conclusión operativa

El website actual de NioSystems es un sitio estático Astro, centrado en contenido técnico-comercial, con diseño documental consistente, navegación clara por verticales (soluciones, integraciones, infraestructura, casos), y una capa mínima de JavaScript para interacción UX (tema y menú). Las rutas dinámicas de casos están totalmente respaldadas por `src/data/casos.ts`, y la capa de contacto backend en Cloudflare Functions define validación, CORS, anti-bot y envío por Resend sin exponer secretos en frontend.
