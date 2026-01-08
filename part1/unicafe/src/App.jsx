import { useState } from 'react'

const StatisticsLine = (props) => (
  <tbody>
    <tr>
      <td>{props.text}</td>
      <td> {props.value}</td>
    </tr>
  </tbody>
)

const Statistics = (props) => {
  let total = props.good + props.neutral + props.bad
  let average = (props.good - props.bad) / Math.max(total, 1)
  let positive = (props.good / Math.max(total, 1)) * 100
  return (
    <div>
      <h1>statistics</h1>
      <table>
        <StatisticsLine text="good" value={props.good} />
        <StatisticsLine text="neutral" value={props.neutral} />
        <StatisticsLine text="bad" value={props.bad} />
        <StatisticsLine text="all" value={total} />
        <StatisticsLine text="average" value={average} />
        <StatisticsLine text="positive" value={positive + " %"} />
      </table>
    </div>
  )
}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App