import {FC} from 'react';
import {Variants} from './Variants'
import {QuestionItem, ResultItem} from '../../interface'

interface QuestionProps {
	question: QuestionItem
	onFinish: (result: ResultItem) => void
}

const promisify = fn => (...args) => new Promise(resolve => resolve(fn(...args)))

export const Question: FC<QuestionProps> = ({question, onFinish}) => {
	const {id, title, variants, theme, variants: {a: correctAnswer}} = question

	const generateOutput = (answer: string) => promisify((correct: boolean) => ({
		id,
		question: title,
		theme,
		answer,
		correct,
		correctAnswer,
	}))

	const handleCorrect = promisify(() => true)
	const handleIncorrect = promisify(() => false)

	const handleAnswer = (value: string) => value === correctAnswer
		? handleCorrect()
		: handleIncorrect();

	const onSelect = (value: string) => () =>
		handleAnswer(value)
			.then(generateOutput(value))
			.then(promisify(onFinish))

	return (
		<div>
			<h3>{title}</h3>
			<Variants
				data={variants}
				onSelect={onSelect}
			/>
		</div>
	);
}
