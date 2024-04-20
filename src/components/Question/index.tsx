import {FC, useState, useEffect} from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import {
	Button,
	FormControl,
	FormLabel,
	FormControlLabel,
	RadioGroup,
	Radio,
	Typography
} from '@mui/material'
import {QuestionItem, ResultItem} from '../../interface'
import {fisherShuffle, promisify} from '@utils'
import {getQuestionFromLocalStorage} from '@storage'

interface QuestionProps {
	question: QuestionItem
	shuffle?: boolean
	highlight?: boolean
	onFinish: (result: ResultItem) => void
}

export const Question: FC<QuestionProps> = ({question, shuffle, highlight, onFinish, onLog, progressMessage}) => {
	const {id, title, variants, theme, correctAnswer, image: imgSrc} = question

	const [radioValue, setRadioValue] = useState('')
	const [highlighted, setHighlighted] = useState(false)
	const [processedVariants, setProcessedVariants] = useState<Record<string, string>>(variants)

	const image = new URL(`../../../edited/${imgSrc}`, import.meta.url).href

	useEffect(() => {
		const event = new CustomEvent('__serb-ppl-theme', {detail: question?.theme});

		window.dispatchEvent(event)
	}, [question])

	useEffect(() => {
		if (!shuffle) return setProcessedVariants(variants)

		const shuffleVariants = (variants: Record<string, string>) => {
			return fisherShuffle(Object.keys(variants))
				.reduce((acc, key) => ({...acc, [key]: variants[key]}), {})
		}

		setProcessedVariants(shuffleVariants(variants))
	}, [variants, shuffle])

	useEffect(() => {
		const logQuestion = (question: QuestionItem) => {
			const updatedQuestion = {
				...getQuestionFromLocalStorage(question.id),
				seen: question.seen + 1
			}

			console.log('updatedQuestion >>>', updatedQuestion)

			onLog(updatedQuestion)
		}

		logQuestion(question)
	}, [question, onLog])

	const generateOutput = (answer: string) => promisify((correct: boolean) => ({
		id,
		question: title,
		image,
		theme,
		answer,
		correct,
		correctAnswer,
	}))

	const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRadioValue((event.target as HTMLInputElement).value)
	}

	const handleCorrect = promisify(() => {
		const updatedQuestion = {
			...getQuestionFromLocalStorage(question.id),
			correctAnswers: question.correctAnswers + 1,
		}

		onLog(updatedQuestion)

		return true
	})

	const handleIncorrect = promisify(() => {
		const updatedQuestion = {
			...getQuestionFromLocalStorage(question.id),
			incorrectAnswers: question.incorrectAnswers + 1,
		}

		onLog(updatedQuestion)

		return false
	})

	const themeParser = (theme: string) => {
		return theme.split('_').map(
			(word: string) => word.charAt(0).toUpperCase() + word.slice(1)
		).join(' ')
	}

	const handleAnswer = (value: string) => value === correctAnswer
		? handleCorrect()
		: handleIncorrect()

	const highlightRightAnswer = () => {
		setHighlighted(true)
	}

	const getHighlightColor = (value: string) => {
		if (highlighted && value === correctAnswer) {
			return 'green'
		}

		return '#e0e0e0'
	}

	const parseOutput = (result: ResultItem | unknown) => {
		if (!highlight) return result

		if (typeof result !== 'object') {
			throw new Error('Invalid result')
		}

		if (!(result as ResultItem).correct) {
			highlightRightAnswer()

			throw new Error('Incorrect answer')
		}

		return result
	}

	const onSelect = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!radioValue) return

		handleAnswer(radioValue)
			.then(generateOutput(radioValue))
			.then(parseOutput)
			.then(promisify(onFinish))
			.then(() => {
				setRadioValue('')
				setHighlighted(false)
			})
			.catch(console.error)
	}

	console.log('radioValue >>>', radioValue)
	console.log('variants >>>', variants)

	return (
		<Card sx={{maxWidth: 700, mt: 10, width: '100%'}}>
			<CardContent>
			<Typography sx={{fontSize: 14, display: 'flex', justifyContent: 'space-between'}} color="text.secondary" gutterBottom>
				<div>{themeParser(theme)}</div>
				<div>{progressMessage}</div>
			</Typography>
			<form onSubmit={onSelect}>
				<FormControl sx={{m: 3}} variant="standard">
					<FormLabel
						sx={{fontSize: 20, fontWeight: 500, mb: 2}}
						focused={false}
					>
						{title}
					</FormLabel>
					<img src={image} style={{width: '100%'}} alt="" />
					<RadioGroup
						aria-labelledby="error-radios"
						name="question"
						value={radioValue}
						onChange={handleRadioChange}
					>
						{Object.entries(processedVariants).map(([key, value]) => (
							<FormControlLabel
								key={key}
								sx={{
									m: 1,
									borderRadius: 1,
									border: `1px solid ${getHighlightColor(value)}`,
									p: 1,
									'&:hover': {backgroundColor: '#f5f5f5'},
								}}
								value={value}
								control={<Radio />}
								label={value}
							/>
						))}
					</RadioGroup>
					{/* <FormHelperText>helperText</FormHelperText> */}
					<Button sx={{mt: 1, mr: 1}} type="submit" variant="outlined">
						Next
					</Button>
				</FormControl>
			</form>
			</CardContent>
		</Card>
	);
}
