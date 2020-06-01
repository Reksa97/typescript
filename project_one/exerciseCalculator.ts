type rating = 1 | 2 | 3;

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
};

const calculateExercises = (exercises: Array<number>, targetDaily: number): Result => {
    const days: number = exercises.length;
    const daysTrained: number = exercises.reduce((acc, cur) => {
        if (cur > 0) acc++;
        return acc;
    }, 0);

    const averageDailyHours = exercises.reduce((acc, cur) => acc + cur, 0) / days;

    let rating: rating;
    let success = false;

    if (averageDailyHours >= targetDaily) {
        rating = 3;
        success = true;
    } else if (averageDailyHours > targetDaily - 1) {
        rating = 2;
    } else {
        rating = 1;
    }

    return {
        periodLength: days,
        trainingDays: daysTrained,
        success,
        rating,
        ratingDescription: ratingDescriptions[rating],
        target: targetDaily,
        average: averageDailyHours
    };
};

interface ExerciseArguments {
    exercises: Array<number>,
    target: number
}

const parseExerciseArguments = (args: Array<string>): ExerciseArguments => {
    if (args.length < 4) throw new Error('Not enough arguments');

    const target = Number(args[2]);

    if (isNaN(target)) {
        throw new Error('Target value was not a number!');
    }

    const exercises = args.slice(3).map(ex => Number(ex));

    exercises.forEach(ex => {
        if (isNaN(ex)) throw new Error('Provided values were not numbers!');
    });

    return {
        target,
        exercises
    };
};

try {
    const { exercises, target } = parseExerciseArguments(process.argv);
    console.log(calculateExercises(exercises, target));
} catch (e) {
    const message = (e as Error).message;
    console.log(message);
}
