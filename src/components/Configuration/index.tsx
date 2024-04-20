import {
	Button,
	TextField,
	Switch,
	FormControlLabel
} from '@mui/material'

export const Configuration = ({onSubmit, onReset}) => {
	const buildConfig = (e: any) => {
		e.preventDefault()

		const config = {
			highlight: e.target[0].checked,
			shuffleVariants: e.target[1].checked,
			shuffleQuestions: e.target[2].checked,
			keepStats: e.target[3].checked,
			limit: e.target[4].value
		}

		onSubmit(config)
	}

	return (
		<form style={{display: 'flex', gap: '20px'}} onSubmit={buildConfig}>
			{/* highlight correct answer */}
			<div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
				<FormControlLabel
					style={{display: 'none'}}
					control={<Switch />}
					id="highlight"
					label="Highlight correct answer"
				/>
				{/* shuffle variants */}
				<FormControlLabel
					control={<Switch />}
					id="shuffleVariants"
					label="Shuffle variants"
					checked
				/>
				{/* shuffle questions */}
				<FormControlLabel
					control={<Switch />}
					id="shuffleQuestions"
					label="Shuffle questions"
					checked
				/>
				{/* keep stats */}
				<FormControlLabel
					style={{display: 'none'}}
					control={<Switch />}
					id="keepStats"
					label="Keep stats"
				/>
				{/* questions per theme */}
				<TextField
					label="Questions per theme"
					type="number"
					id="limit"
					size="small"
					defaultValue={5}
					InputLabelProps={{
						shrink: true,
					}}
				/>
				<Button
					variant="outlined"
					type="submit"
					size="large"
				>
					Start quiz
				</Button>
				{/* reset progression */}
				<Button
					variant="text"
					size="large"
					onClick={onReset}
					color="info"
				>
					Reset progression
				</Button>
			</div>
		</form>
	)
}
