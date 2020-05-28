type rating = 1 | 2 | 3

interface Result {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: rating,
    ratingDescription: string,
    target: number,
    average: number
}

const ratingDescriptions = {
    1: 'you can do better...',
    2: 'you nearly did it!',
    3: 'you did it!'
}

const calculateExercises = (exercises: Array<number>, targetDaily: number): Result => {
    const days: number = exercises.length
    const daysTrained: number = exercises.reduce((acc, cur) => {
        if (cur > 0) acc++
        return acc
    }, 0)

    const averageDailyHours = exercises.reduce((acc, cur) => acc+cur, 0)/days

    let rating: rating
    let success: boolean = false

    if (averageDailyHours >= targetDaily) {
        rating = 3
        success = true
    } else if (averageDailyHours > targetDaily - 1) {
        rating = 2
    } else {
        rating = 1
    }

    return {
        periodLength: days,
        trainingDays: daysTrained,
        success,
        rating,
        ratingDescription: ratingDescriptions[rating],
        target: targetDaily,
        average: averageDailyHours
    }
}

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 1))