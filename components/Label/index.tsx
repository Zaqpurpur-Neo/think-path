import * as LabelPrimitive from "@radix-ui/react-label";
import styles from "./Label.module.css";

function Label(props: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={styles.root}
      {...props}
    />
  );
}

export { Label };

