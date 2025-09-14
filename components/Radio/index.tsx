import React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import styles from "./Radio.module.css";
import { CircleIcon } from "lucide-react";

export function RadioGroup(props: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={styles.root}
      {...props}
    />
  );
}

export function RadioGroupItem(props: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={styles.item}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className={styles.indicator}
      >
        <CircleIcon className={styles.circleIcon} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

