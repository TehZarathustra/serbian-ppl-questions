import {ResultItem} from './ResultItem'

export const Results = ({data}) => {
	const correctAnswers = data.reduce((acc, q) => q.correct ? acc + 1 : acc, 0);
	const percentOf = Math.floor((correctAnswers / data.length) * 100);
	const isPassed = percentOf >= 75;
	const percentStyles = {
		color: isPassed ? 'green' : 'red',
		fontWeight: 'bold'
	};

	return (
		<div style={{marginBottom: '40px'}}>
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
				<h3>Results: <span style={percentStyles}>{isPassed ? 'PASS' : 'FAIL'}</span></h3>
				<div>{correctAnswers} of {data.length}, <span style={percentStyles}>{percentOf}%</span></div>
			</div>
			<div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
				{data.map(props => (<ResultItem key={props.id} {...props} />))}
			</div>
		</div>
	)
}
