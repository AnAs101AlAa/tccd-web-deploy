import type { Dispatch, SetStateAction } from "react";

export const animateCounter = async (
  setter: Dispatch<SetStateAction<number>>,
  totalSteps: number,
  startSpeed: number,
  endSpeed: number,
  initialDelay: number,
) => {
  await new Promise((resolve) => setTimeout(resolve, initialDelay));

  for (let i = 0; i < totalSteps; i++) {
    const progress = i / totalSteps;
    const delay = startSpeed + (endSpeed - startSpeed) * Math.pow(progress, 2);

    setTimeout(
      () => {
        setter((prevCount) => prevCount + 1);
      },
      i === 0 ? 0 : delay * i,
    );
  }
};
