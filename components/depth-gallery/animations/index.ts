import type { AnimationHandle } from "./galaxy"
import { createGalaxy } from "./galaxy"
import { createIcosphere } from "./icosphere"

export type { AnimationHandle }

type AnimationFactory = (width: number, height: number) => AnimationHandle

/**
 * Registry de animaciones disponibles para los planos de la depth gallery.
 * La key se referencia desde galleryData.ts en el campo `animationId`.
 */
export const animationRegistry: Record<string, AnimationFactory> = {
  galaxy: createGalaxy,
  icosphere: createIcosphere,
}
