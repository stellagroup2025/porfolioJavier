import type { AnimationFactoryOptions, AnimationHandle } from "./galaxy"
import { createGalaxy } from "./galaxy"
import { createIcosphere } from "./icosphere"
import { createQuantum } from "./quantum"
import { createPhysics } from "./physics"
import { createHeuristics } from "./heuristics"
import { createHawking } from "./hawking"

export type { AnimationFactoryOptions, AnimationHandle }

export type AnimationFactory = (
  width: number,
  height: number,
  opts?: AnimationFactoryOptions,
) => AnimationHandle

/**
 * Registry de animaciones disponibles para los planos de la depth gallery.
 * La key se referencia desde galleryData.ts en el campo `animationId`.
 */
export const animationRegistry: Record<string, AnimationFactory> = {
  galaxy: createGalaxy,
  icosphere: createIcosphere,
  quantum: createQuantum,
  physics: createPhysics,
  heuristics: createHeuristics,
  hawking: createHawking,
}
