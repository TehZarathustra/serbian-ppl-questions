import {useEffect, useState} from 'react'
import {getParsedQuestionsFromLocalStorage} from '@storage'

export const Stats = ({rawQuestions, currentQuestion}) => {
	const [questions, setQuestions] = useState(rawQuestions)
	const [theme, setTheme] = useState('')

	const checkStorage = () => {
		const questions = getParsedQuestionsFromLocalStorage()
		if (questions) setQuestions(questions)
	}

	const checkTheme = (e) => {
		const theme = e.detail
		setTheme(theme)
	}

	useEffect(() => {
		window.addEventListener('storage', checkStorage)

		return () => {
			window.removeEventListener('storage', checkStorage)
		}
	}, [])

	useEffect(() => {
		window.addEventListener('__serb-ppl-theme', checkTheme)

		return () => {
			window.removeEventListener('__serb-ppl-theme', checkTheme)
		}
	}, [])

	const getDebug = (questions) => Object.entries(questions).map(([key, val]) => {
		return (
			<div key={key} style={{
				background: theme === key ? 'crimson' : 'transparent',
				transition: 'background .2s ease-in-out',
				padding: '10px',
				boxSizing: 'border-box',
				borderRadius: '10px',
				color: theme === key ? 'white' : 'black'
			}}>
				<h3 style={{margin: '0'}}>{
					key.charAt(0).toUpperCase()
						+ key.split('').splice(1).join('').split('_').join(' ')
				}</h3>
				<div style={{fontSize: '14px'}}>
					<div>total questions: {val.length}</div>
					<div>questions seen: {val.filter(q => q.seen).length}</div>
					<div>answered correctly: {val.filter(q => q.correctAnswers).length}</div>
					<div>answered incorrectly: {val.filter(q => q.incorrectAnswers).length}</div>
					<div>progress: {((val.filter(q => q.correctAnswers).length / val.length) * 100).toFixed(2)}%</div>
				</div>
			</div>
		)
	});

	return (
		<div style={{
			display: 'grid',
			gap: '20px',
			gridTemplateColumns: '1fr 1fr',
			padding: '10px',
			position: 'sticky',
			top: '10px',
			height: '100%',
		}}>
			{getDebug(questions)}
		</div>
	)
}
