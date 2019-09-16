import {useRef} from 'react'
import {RefCallbackInstance} from '../types/generics'
import {BezierCurve, ReflectionStackPerspective, Times} from '../types/constEnums'
import requestDoubleAnimationFrame from '../components/RetroReflectPhase/requestDoubleAnimationFrame'

const CARD_SPACING = 54
const useFlipDeal = (count: number) => {
  const isAnimatingRef = useRef(false)
  const lastListItemsRef = useRef([] as RefCallbackInstance[])
  const ref = (idx: number) => (c: RefCallbackInstance) => {
    lastListItemsRef.current[idx] = c
    if (isAnimatingRef.current || !c) return
    if (idx === count - 1) {
      isAnimatingRef.current = true
      const variableDelay = Math.max(Times.REFLECTION_DEAL_CARD_MIN_DELAY, (Times.REFLECTION_DEAL_TOTAL_DURATION - Times.REFLECTION_DEAL_CARD_DURATION - Times.REFLECTION_DEAL_CARD_INIT_DELAY) / (count - 1))
      for (let i = 0; i < count; i++) {
        const delay = Times.REFLECTION_DEAL_CARD_INIT_DELAY + variableDelay * (count - i - 1)
        const lastReflection = lastListItemsRef.current[i]
        if (!lastReflection) return
        const hiddenPenalty = i >= 3 ? ReflectionStackPerspective.Y : 0
        const cachedTransform = `translateY(${-(CARD_SPACING + hiddenPenalty) * i}px)`
        const cachedTransition = `transform ${Times.REFLECTION_DEAL_CARD_DURATION}ms ${delay}ms ${BezierCurve.STANDARD_CURVE}`
        lastReflection.style.transform = cachedTransform
        requestDoubleAnimationFrame(() => {
          lastReflection.style.transition = cachedTransition
          lastReflection.style.transform = ''
        })
      }
    }
  }
  const reverse = (count: number) => {
    for (let i = 0; i < count; i++) {
      const lastReflection = lastListItemsRef.current[i]
      if (!lastReflection) return
      const hiddenPenalty = i >= 3 ? ReflectionStackPerspective.Y : 0
      lastReflection.style.transition = `transform ${Times.REFLECTION_DEAL_CARD_DURATION}ms ${BezierCurve.STANDARD_CURVE}`
      requestAnimationFrame(() => {
        lastReflection.style.transform = `translateY(${-(CARD_SPACING + hiddenPenalty) * i}px)`
      })
    }
    isAnimatingRef.current = false
  }
  return [ref, reverse] as [typeof ref, typeof reverse]
}

export default useFlipDeal
