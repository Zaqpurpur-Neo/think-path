import styles from "./QuestionTable.module.css"

interface TabelData {
	columns?: number
	rows?: number[][]
}

interface Props {
	table?: TabelData
	caption?: string
}

export function QuestionTable({ table, caption = "Question Table" }: Props) {
	return (
		<table className={styles.table}>
		  <caption className={styles.caption}>{caption}</caption>
		  <thead>
			<tr className={styles.tr}>
			  {Array.from({ length: table.columns }).map((_, i) => (
				<th key={i} className={styles.th}>
				  Col {i + 1}
				</th>
			  ))}
			</tr>
		  </thead>
		  <tbody>
			{table.rows.map((row, rowIndex) => (
			  <tr key={rowIndex} className={styles.tr}>
				{row.map((cell, colIndex) => (
				  <td key={colIndex} className={styles.td}>
					{cell}
				  </td>
				))}
			  </tr>
			))}
		  </tbody>
		</table>
	)
}

