type JSON = Record<string, {
	title: string
	variants: Record<string, string>
}>

type GenerateProps = [string, JSON]

export const generateQuestions = ([theme, json]: GenerateProps) => Object.entries(json)
	.map(([key, value]) => ({
		id:`${theme}${key}`,
		theme,
		...value,
		correctAnswer: value.variants[Object.keys(value.variants)[0]],
		seen: 0,
		correctAnswers: 0,
		incorrectAnswers: 0,
	}))

export const fisherShuffle = (arr: unknown[]) => {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]]
	}

	return arr
}

