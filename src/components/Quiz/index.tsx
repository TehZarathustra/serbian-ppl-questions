import {useState, useRef, FC} from 'react'
import {Question} from '../Question'
import {Results} from '../Results'
import {ResultItem, QuizProps} from '../../interface'

export const Quiz: FC<QuizProps> = ({data}) => {
	const [questions] = useState(data)
	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [isFinished, setIsFinished] = useState(false)
	const answers = useRef<ResultItem[]>([])

	const handleFinish = (result: ResultItem) => {
		answers.current.push(result);

		if (currentQuestion + 1 >= questions.length) {
			return setIsFinished(true);
		}

		setCurrentQuestion(currentQuestion + 1);
	}

	return (
		<>
			{isFinished
				? <Results data={answers.current} />
				: <div>
					<div>{currentQuestion + 1} of {questions.length}</div>
					<Question
						question={questions[currentQuestion]}
						onFinish={handleFinish}
					/>
				</div>
			}
		</>
	);
}
