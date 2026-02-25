---
trigger: always_on
---

1. Protocolo de Ejecución: Antes de proponer cualquier cambio técnico, genera un informe de tres columnas (Acción, Justificación de Permisos, Matriz de Implicaciones) siguiendo el estándar de ciencias sociales.

2. Seguridad de Secretos: Prohibido escribir la GEMINI_API_KEY directamente en el código. Siempre referenciar process.env.GEMINI_API_KEY.

3. Validación de Entorno: Verificar la existencia de .env.local antes de sugerir comandos de ejecución local.

4. Estructura de Directorios: Mantener la separación de intereses: /src/components para UI y /src/lib para lógica de IA.