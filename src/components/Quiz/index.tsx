import {useState, useRef, FC} from 'react'
import {Question} from '../Question'
import {Results} from '../Results'
import {ResultItem, QuizProps} from '../../interface'

export const Quiz: FC<QuizProps> = ({questions, shuffle, highlight, onLog}) => {
	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [isFinished, setIsFinished] = useState(false)
	const answers = useRef<ResultItem[]>([])

	const handleFinish = (result: ResultItem) => {
		answers.current.push(result)

		if (currentQuestion + 1 >= questions.length) {
			setIsFinished(true)

			// remove highlight
			const event = new CustomEvent('__serb-ppl-theme', {detail: ''})
			window.dispatchEvent(event)

			return
		}

		setCurrentQuestion(currentQuestion + 1)
	}

	if (!questions) return null

	return (
		<>
			{isFinished
				? <Results data={answers.current} />
				: <Question
					question={questions[currentQuestion]}
					progressMessage={`${currentQuestion + 1} of ${questions.length}`}
					onFinish={handleFinish}
					shuffle={shuffle}
					highlight={highlight}
					onLog={onLog}
				/>
			}
		</>
	);
}
