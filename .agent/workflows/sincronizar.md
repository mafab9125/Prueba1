---
description: Flujo de trabajo para la sincronización e implementación
---

Paso 1: Verificación de Integridad: Ejecutar git status para asegurar que no hay archivos sensibles sin trackear.

Paso 2: Sincronización Local: Realizar git pull origin main para evitar conflictos de historias.

Paso 2.5: Validación de Arquitectura: Antes del commit, ejecutar la Jerarquía Multiagente (Regla 7) para que el Auditor de QA confirme que no hay rastros de gemini-1.5-flash o JSON mal formateado

Paso 3: Commit Normativo: Generar mensajes de commit que describan la consecuencia en la persistencia o dependencias, según la Matriz de Implicaciones.

Paso 4: Push y Despliegue: Ejecutar git push origin main para disparar el build automático en Vercel.