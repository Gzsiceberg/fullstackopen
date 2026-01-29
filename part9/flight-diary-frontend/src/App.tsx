import { useState, useEffect } from 'react';
import type { DiaryEntry, NewDiaryEntry, Weather, Visibility } from './types';
import { getAllDiaries, createDiary } from './diaryService';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [newDate, setNewDate] = useState('');
  const [newVisibility, setNewVisibility] = useState<Visibility>('great');
  const [newWeather, setNewWeather] = useState<Weather>('sunny');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiaries(data);
    });
  }, []);

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const diaryToAdd: NewDiaryEntry = {
      date: newDate,
      visibility: newVisibility,
      weather: newWeather,
      comment: newComment,
    };
    createDiary(diaryToAdd).then(data => {
      setDiaries(diaries.concat(data));
      setNewDate('');
      setNewComment('');
    });
  };

  return (
    <div>
      <h1>Add new entry</h1>
      <form onSubmit={diaryCreation}>
        <div>
          date <input type="date" value={newDate} onChange={(event) => setNewDate(event.target.value)} />
        </div>
        <div>
          visibility: 
          great <input type="radio" name="visibility" onChange={() => setNewVisibility('great')} checked={newVisibility === 'great'} />
          good <input type="radio" name="visibility" onChange={() => setNewVisibility('good')} checked={newVisibility === 'good'} />
          ok <input type="radio" name="visibility" onChange={() => setNewVisibility('ok')} checked={newVisibility === 'ok'} />
          poor <input type="radio" name="visibility" onChange={() => setNewVisibility('poor')} checked={newVisibility === 'poor'} />
        </div>
        <div>
          weather:
          sunny <input type="radio" name="weather" onChange={() => setNewWeather('sunny')} checked={newWeather === 'sunny'} />
          rainy <input type="radio" name="weather" onChange={() => setNewWeather('rainy')} checked={newWeather === 'rainy'} />
          cloudy <input type="radio" name="weather" onChange={() => setNewWeather('cloudy')} checked={newWeather === 'cloudy'} />
          stormy <input type="radio" name="weather" onChange={() => setNewWeather('stormy')} checked={newWeather === 'stormy'} />
          windy <input type="radio" name="weather" onChange={() => setNewWeather('windy')} checked={newWeather === 'windy'} />
        </div>
        <div>
          comment <input value={newComment} onChange={(event) => setNewComment(event.target.value)} />
        </div>
        <button type='submit'>add</button>
      </form>
      <h1>Flight Diaries</h1>
      <ul>
        {diaries.map(diary => (
          <li key={diary.id}>
            <h3>{diary.date}</h3>
            <p>visibility: {diary.visibility}</p>
            <p>weather: {diary.weather}</p>
            {diary.comment && <p>comment: {diary.comment}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
