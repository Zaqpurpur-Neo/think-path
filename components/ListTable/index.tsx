import styles from "./ListTable.module.css";

export default function ListTable({
	headers = [],
	arrays = [],
	setup = (item) => ([])
}) {
	return (
		<table className={styles.table}>
			<thead>
				<tr className={styles.tr}>
					{headers.map(item => <th className={styles.th}>{item}</th>)}

				</tr>
			</thead>
			<tbody>
			{arrays.map(item => {
				return <tr className={styles.tr}> 
				{setup(item).map(ix => <td className={styles.td}>{ix}</td>)}
				</tr>
			})}								
			</tbody>
		</table>

	)
}
