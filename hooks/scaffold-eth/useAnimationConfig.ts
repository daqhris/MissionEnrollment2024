import { useEffect, useState } from "react";

const ANIMATION_TIME = 2000;

export function useAnimationConfig<T>(data: T): { showAnimation: boolean } {
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const [prevData, setPrevData] = useState<T | undefined>(undefined);

  useEffect(() => {
    if (prevData !== undefined && prevData !== data) {
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), ANIMATION_TIME);
    }
    setPrevData(data);
  }, [data, prevData]);

  return {
    showAnimation,
  };
}
