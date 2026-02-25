---
description: Flujo de trabajo para la sincronización e implementadación 
---

Paso 1: Verificación de Integridad: Ejecutar git status para asegurar que no hay archivos sensibles sin trackear.

Paso 2: Sincronización Local: Realizar git pull origin main para evitar conflictos de historias.

Paso 3: Commit Normativo: Generar mensajes de commit que describan la consecuencia en la persistencia o dependencias, según la Matriz de Implicaciones.

Paso 4: Push y Despliegue: Ejecutar git push origin main para disparar el build automático en Vercel.