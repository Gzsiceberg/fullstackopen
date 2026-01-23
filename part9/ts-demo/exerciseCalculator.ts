interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: 1 | 2 | 3;
  ratingDescription: string;
  target: number;
  average: number;
}

function calculateExercises(dailyHours: number[], target: number): Result {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter(hours => hours > 0).length;
  const average = dailyHours.reduce((sum, hours) => sum + hours, 0) / periodLength;
  const success = average >= target;

  let rating: 1 | 2 | 3;
  let ratingDescription: string;

  const ratio = average / target;

  if (ratio >= 1) {
    rating = 3;
    ratingDescription = 'excellent, you met your target';
  } else if (ratio >= 0.75) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'you need to work harder';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
}

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Please provide target and at least one daily exercise hour');
  console.log('Usage: npm run calculateExercises <target> <day1> <day2> ...');
  process.exit(1);
}

const target = Number(args[0]);
const dailyHours = args.slice(1).map(Number);

if (isNaN(target) || dailyHours.some(isNaN)) {
  console.log('All arguments must be numbers');
  process.exit(1);
}

console.log(calculateExercises(dailyHours, target));
