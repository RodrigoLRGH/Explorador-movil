# Explorador móvil

Aplicación hecha con Expo y React Native (TypeScript) que permite capturar una fotografía, consultar la ubicación GPS actual y visualizar la orientación aproximada del teléfono con el magnetómetro.

## Requisitos

- Node.js y un editor de código.
- Un teléfono Android o iOS con **Expo Go** instalado.
- El teléfono y la computadora en la misma red local.

## Instalación

```bash
cd explorador-movil
npm install
```

## Ejecución

```bash
npx expo start
```

Escanea el código QR con Expo Go (cámara del teléfono en iOS, o la propia app en Android).

## Limitaciones conocidas

- El ángulo de la brujula se calcula solo con los ejes X e Y, supone que el teléfono está horizontal y no corrige la inclinación ni la declinación magnética.
- Los valores en µT dependen de que el dispositivo los informe en esas unidades.
- La precisión del GPS es una estimación del dispositivo
- La fotografía se muestra en la app pero no se guarda en la galería.
- La app se probó con Expo Go. Una compilación propia (fuera de Expo Go) puede requerir declarar descripciones de uso de permisos en la configuración de Expo.
- No incluye soporte para orientación horizontal de la pantalla;

## Evidencias

- `capturas/camara.jpeg`: fotografía capturada
- `capturas/ubicacion.jpeg`: coordenadas obtenidas (con dígitos ocultos por privacidad)
- `capturas/brujula.jpeg`: lectura de la brújula
- `capturas/video.mp4`: Video de demostración (1–2 minutos) en un teléfono físico