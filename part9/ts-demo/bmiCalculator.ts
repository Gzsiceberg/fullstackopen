function calculateBmi(height: number, weight: number): string {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    if (bmi < 18.5) {
        return 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
        return 'Normal Range';
    } else if (bmi >= 25 && bmi < 30) {
        return 'Overweight';
    } else {
        return 'Obese';
    }
}

const height = Number(process.argv[2]);
const weight = Number(process.argv[3]);

if (isNaN(height) || isNaN(weight)) {
    console.log('Please provide valid numbers for height and weight.');
} else {
    console.log(calculateBmi(height, weight));
}