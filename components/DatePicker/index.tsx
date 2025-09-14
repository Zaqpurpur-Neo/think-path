import { useEffect, useState } from "react";
import styles from "./DatePicker.module.css";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

function formatDateDisplay(str: string) {
	const ghh = str.split("-");
	return `${ghh[2]}/${parseInt(ghh[1])+1}/${ghh[0]}`
}

function DateOfMonth({ year, month, setCurrentDate }) {
	const lastOfMonth = new Date(year, month + 1, 0);
	const lastOfPrevMonth = new Date(year, month, 0);
	const firstOfNextMonth = new Date(year, month + 1, 1);
	
	const prevDates: number[] = 
		Array
			.from({ length: lastOfPrevMonth.getDay() })
			.map((_, idx) => (["not-now", lastOfPrevMonth.getDate() - lastOfPrevMonth.getDay() + idx + 1]));

	const dates: number[] = 
		Array.from({ length: lastOfMonth.getDate() }).map((_, idx) => (["now", idx + 1]));

	const nextDates: number[] =
		Array
			.from({ length: 7 - firstOfNextMonth.getDay() + 1 })
			.map((_, idx) => (["not-now", 
				firstOfNextMonth.getDate() - firstOfNextMonth.getDay() + idx + firstOfNextMonth.getDay()
			]));

	const normalDates = [...prevDates, ...dates, ...nextDates];

	return (
		<div className={styles.dates}>
			{normalDates.map((item, dix) => 
				<button 
					key={dix} 
					disabled={(item[0] === "not-now")} 
					className={styles["date-" + item[0]]} onClick={
						(e) => {
							e.preventDefault();
							setCurrentDate(item[1]);
						}
					}>
				{item[1]}
				</button>
			)}
		</div>
	)
}

function DatePopup({ setFullDate }) {
	const days: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	const firstYear = 1925;
	const dateNow = new Date();
	
	const getYearNow = dateNow.getFullYear();
	const years = Array.from({ length: getYearNow - firstYear + 1 }).map((_, idx) => firstYear + idx)

	const months = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	]
	const getNumberMonthNow = dateNow.getMonth()
	const getMonthNow = months[getNumberMonthNow];

	const [monthNow, setMonthNow] = useState(getMonthNow)
	const [monthNumberNow, setMonthNumberNow] = useState(getNumberMonthNow)
	const [yearNow, setYearNow] = useState(getYearNow)
	const [currentDate, setCurrentDate] = useState(null)

	useEffect(() => {
		if(currentDate !== null) {
			const date = new Date(yearNow, monthNumberNow, currentDate);
			setFullDate(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`)
		}
	}, [currentDate])

	const nextMonth = (e) => {
		e.preventDefault();
	}

	const prevMonth = (e) => {
		e.preventDefault();
	}

	return (
		<div className={styles.datePopup}>
			<div className={styles.topper}>
				<button onClick={prevMonth}><ChevronLeft /></button>
				<div className={styles.topperCenter}>
					<select 
						onChange={(e) => {
							setMonthNow(e.currentTarget.value);
							setMonthNumberNow(months.indexOf(e.currentTarget.value));
						}}
						value={monthNow}> 
						{months.map((item, idx) => <option key={idx} value={item}>{item}</option>)}
					</select>
					<select 
						onChange={(e) => {
							setYearNow(e.currentTarget.value)
						}}
						value={yearNow}> 
						{years.map((item, idx) => <option key={idx} value={item}>{item}</option>)}
					</select>
				</div>
				<button onClick={nextMonth}><ChevronRight /></button>
			</div>
			
			<div className={styles.days}>
				{days.map((item, id) => <span key={id}>{item}</span>)}
			</div>
			<DateOfMonth 
				year={yearNow} 
				month={monthNumberNow} 
				setCurrentDate={setCurrentDate}
			 />

		</div>
	)
}

export default function DatePicker({ title, value, onChange, ...props }) {
	const [dateSelected, setDateSelected] = useState<string | null>(null);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	return (
		<div className={styles.datePicker}>
			<label>{title}</label>
			<div className={styles.box} onClick={() => setDropdownOpen(prev => !prev)}>
				<p>{dateSelected === null ? title : formatDateDisplay(dateSelected)}</p>
				<ChevronDown />
			</div>

			{dropdownOpen && <DatePopup setFullDate={(item) => {
				setDateSelected(item);
				setDropdownOpen(false);
				onChange(props.name, item)
			}} />}
		</div>
	)
}
