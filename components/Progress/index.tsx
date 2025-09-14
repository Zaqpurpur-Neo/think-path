import { useEffect, useState } from "react";
import styles from "./Progress.module.css";

import * as ProgressPrimitive from "@radix-ui/react-progress"

function Progress({
  className,
  value,
  delay = 0,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
	const [progress, setProgress] = useState(1);

	useEffect(() => {
		if(delay > 0) {
			const timer = setTimeout(() => { 
				setProgress(value)
			}, delay);
			return () => clearTimeout(timer);
		} else setProgress(value)
	}, [value])

    return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={styles.root}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={styles.indicator}
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </ProgressPrimitive.Root>  
  )
}

export { Progress }

