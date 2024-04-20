import {ResultItem} from './ResultItem'

export const Results = ({data}) => {
	return (
		<div style={{marginBottom: '40px'}}>
			<h3>Results</h3>
			<div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
				{data.map(props => (<ResultItem key={props.id} {...props} />))}
			</div>
		</div>
	)
}
