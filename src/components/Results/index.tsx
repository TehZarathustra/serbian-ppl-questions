export const Results = ({data}) => {
	return (
		<div style={{marginTop: '-10%'}}>
			<h3>Results</h3>
			{
				data.map(({id, answer, correct, correctAnswer, question, theme}) => (
					<div key={id}>
						<div>{question} <i>{id}</i></div>
						<ul>
							<li>{answer} {correct ? '✅' : '❌'}</li>
							{!correct && <li>{correctAnswer}</li>}
						</ul>
					</div>
				))
			}
		</div>
	)
}
