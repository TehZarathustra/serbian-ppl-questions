import {getParsedQuestionsFromLocalStorage} from '@storage';

export const ResultItem = ({id, answer, correct, correctAnswer, image, question, theme}) => {
	const questions = getParsedQuestionsFromLocalStorage();
	const isSeen = questions[theme].find(q => q.id === id).seen > 1;

	return(<div key={id} style={{
		background: correct ? 'lightgreen' : 'lightsalmon',
		boxSizing: 'border-box',
		padding: '10px',
		borderRadius: '10px'
	}}>
		<div style={{display: 'flex', justifyContent: 'space-between'}}>
			<div style={{fontSize: '14px'}}><i>{id}</i></div>
			<div style={{fontSize: '14px'}}>seen: {isSeen ? 'yes' : 'no'}</div>
		</div>
		<h4 style={{margin: '10px'}}>{question}</h4>
		{image && <img src={image} alt={question} />}
		<ul>
			<li>{answer} {correct ? '✅' : '❌'}</li>
			{!correct && <li>{correctAnswer}</li>}
		</ul>
	</div>);
}

