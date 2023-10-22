export const Results = ({data}) => {
	return (
		<>
			{
				data.map(({id, answer, correct, correctAnswer, question, theme}) => (
					<ul key={id}>
						<li>{id} {question}</li>
						<li>{answer} {correct ? '✅' : '❌'}</li>
						{!correct && <li>{correctAnswer}</li>}
					</ul>
				))
			}
		</>
	)
}
