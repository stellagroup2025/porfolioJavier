// Ref compartida con la posición suavizada del cursor en coordenadas 0..1.
// El GeometricBackground la mantiene actualizada en cada frame; cualquier otro
// componente puede leerla para sincronizar efectos de iluminación.
export const mousePositionRef: {
  current: { x: number; y: number; hasMoved: boolean }
} = {
  current: { x: 0.5, y: 0.5, hasMoved: false },
}
