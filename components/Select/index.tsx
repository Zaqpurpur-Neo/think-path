import { ChevronDown } from "lucide-react";
import styles from "./Select.module.css";
import { useLayoutEffect, useRef, useState } from "react";

export default function Select({ named, title, label, items, onChange, ...props }) {
	const [selected, setSelected] = useState("");
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [placement, setPlacement] = useState<"top" | "bottom">("bottom");

	const handleSelect = (item: string) => {
		setSelected(item);
		setDropdownOpen(false);
		onChange(named, item)
	}

	const buttonRef = useRef<HTMLDivElement>(null);
  	const menuRef = useRef<HTMLDivElement>(null);

  	useLayoutEffect(() => {
		if (!open || !buttonRef.current || !menuRef.current) return;

		const rect = buttonRef.current.getBoundingClientRect();
		const spaceBelow = window.innerHeight - rect.bottom;
		const spaceAbove = rect.top;

		if (spaceBelow < 200 && spaceAbove > spaceBelow) {
		  setPlacement("top");
		} else {
		  setPlacement("bottom");
		}
	}, [dropdownOpen]);

	return (
		<div className={styles.selectRoot}>
			<label htmlFor={"id-" + named}>{label}</label>
			<div ref={buttonRef} className={styles.box} onClick={() => setDropdownOpen(prev => !prev)}>
				<p>{selected.length > 0 ? selected : title}</p>
				<ChevronDown />
			</div>

			<div ref={menuRef} className={dropdownOpen ? (styles["dropdown-" + placement]) : styles.dropdownHidden }>
				<p className={styles.label}>{label}</p>
				<ul>
					{items.map((item) => <li key={item} onClick={() => handleSelect(item)}>{item}</li>)}
				</ul>
			</div>
		</div>
	)
}
