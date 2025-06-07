# PathExplorer – The Bytles

PathExplorer es una plataforma web desarrollada por el equipo The Bytles como solución para la gestión del desarrollo profesional en Accenture, centralizando perfiles de empleados, proyectos, habilidades, metas y recomendaciones impulsadas por IA.

## Objetivo del Proyecto

Abordar la fragmentación de datos en el ciclo de vida del talento dentro de una empresa, permitiendo decisiones más informadas sobre asignaciones, crecimiento profesional y compatibilidad entre roles y personas.

## Stack Tecnológico

- Frontend: React + Vite
- Backend: FastAPI (Python)
- Base de datos y autenticación: Supabase (PostgreSQL + Auth)
- Almacenamiento: Supabase Storage (.pdf, .png)
- IA: Cohere API (embeddings y generación de texto)
- Testing: Cypress
- Despliegue:
  - Frontend: Vercel
  - Backend: RailWay
  - CI/CD: GitHub Actions

## Funcionalidades Clave

- Registro y autenticación de usuarios (empleados, managers)
- Gestión de perfiles (CV, metas, habilidades, certificaciones)
- Creación de proyectos con archivos RFP y roles generados automáticamente por IA
- Recomendaciones personalizadas de cursos y certificaciones
- Cálculo de compatibilidad semántica entre perfiles y roles
- Asignación de roles y visualización de reportes e historial
- Interfaz de usuario modular, moderna y responsiva

## Pruebas

Se utilizan pruebas manuales y automatizadas:

npm run cypress:open

## Clona el repositorio

git clone https://github.com/tu-usuario/TheBytles_Reto.git
cd TheBytles_Reto/TheBytles_Reto

## Instala dependencias

npm install
npm install @supabase/supabase-js
npm install chart.js react-chartjs-2

## Configura las variables de entorno

Crea un archivo .env siguiendo el ejemplo de .env.example y agrega tus claves de Supabase y Cohere.

## Estructura de Carpetas

/TheBytles_Reto
│
├── public/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   └── utils/
├── cypress/
├── .env
├── vite.config.js
└── package.json

Equipo de Desarrollo

Ana Karina Aramoni Ruíz – A07192068
Yuting Lin – A00835917
René Miguel Macías Olivar – A00836714
Eugenio Andrés Mejía Fanjón – A01412143
Pedro Enrique Gómez Palafox – A01027841
Rodrigo Garza de la Rosa – A01383556