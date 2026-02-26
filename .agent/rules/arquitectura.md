---
trigger: always_on
---

1. Protocolo de Ejecución: Antes de proponer cualquier cambio técnico, genera un informe de tres columnas (Acción, Justificación de Permisos, Matriz de Implicaciones) siguiendo el estándar de ciencias sociales.

2. Seguridad de Secretos: Prohibido escribir la GEMINI_API_KEY directamente en el código. Siempre referenciar process.env.GEMINI_API_KEY.

3. Blindaje de Entorno (Pre-vuelo Técnico): Antes de proponer cualquier cambio en ai.ts o sugerir comandos de ejecución local, el Agente debe verificar obligatoriamente la existencia del archivo .env.local. Acto seguido, debe ejecutar internamente una prueba de conectividad exitosa para asegurar que las credenciales son válidas. Si falta el archivo o la prueba falla, el Agente debe detenerse y solicitar la corrección del entorno al usuario.

4. Estructura de Directorios: Mantener la separación de intereses: /src/components para UI y /src/lib para lógica de IA.

5. Modelo Mandatorio (Restricción Estricta): Queda terminantemente prohibido el uso de gemini-1.5-flash. Ante cualquier solicitud de este modelo, el Agente debe denegar la acción inmediatamente sin realizar pruebas de conectividad (omitiendo la Regla 3 en este caso específico) y notificar al usuario que la orden viola una política de seguridad crítica del proyecto.

6. Integridad de Datos: Toda función que procese respuestas de IA debe incluir obligatoriamente el método de limpieza safeJsonParse para evitar errores de sintaxis JSON.

7. Jerarquía Multiagente: El Agente Constructor debe solicitar siempre una validación al Agente de QA antes de dar una tarea por finalizada.

8. Criterio UX Pro Max: Todo componente nuevo debe ser contrastado con los estándares de la carpeta @Antigravity_Skills para asegurar la calidad visual.