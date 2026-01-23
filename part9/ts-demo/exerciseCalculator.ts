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

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
