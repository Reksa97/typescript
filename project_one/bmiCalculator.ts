export const calculateBmi = (heightInCm: number, weight: number): string => {
    const heightInMeters = heightInCm / 100;
    const BMI: number = weight / (heightInMeters * heightInMeters);

    if (BMI < 15) {
        return 'Very severely underweight';
    }

    if (BMI < 16) {
        return 'Severely underweight';
    }

    if (BMI < 18.5) {
        return 'Underweight';
    }

    if (BMI < 25) {
        return 'Normal (healthy weight)';
    }

    if (BMI < 30) {
        return 'Overweight';
    }

    if (BMI < 35) {
        return 'Obese Class I (Moderately obese)';
    }

    if (BMI < 40) {
        return 'Obese Class II (Severely obese)';
    }

    return 'Obese Class III (Very severely obese)';
};

interface HeightAndWeight {
    height: number,
    weight: number
}

const parseBmiArguments = (args: Array<string>): HeightAndWeight => {
    if (args.length < 4) throw new Error('Not enough arguments');
    if (args.length > 4) throw new Error('Too many arguments');

    if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
        return {
            height: Number(args[2]),
            weight: Number(args[3])
        };
    } else {
        throw new Error('Provided values were not numbers!');
    }
};

try {
    const { height, weight } = parseBmiArguments(process.argv);
    console.log(calculateBmi(height, weight));
} catch (e) {
    const message = (e as Error).message;
    console.log(message);
}
