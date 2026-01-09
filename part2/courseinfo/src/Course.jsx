const Header = (props) => {
  return <h2>{props.course}</h2>
}

const Total = (props) => {
  const parts = props.parts
  let total = parts.map(part => part.exercises).reduce((sum, curr) => sum + curr, 0)
  return (
    <p>
      Number of exercises {total}
    </p>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  )
}

const Content = (props) => {
  let parts = props.parts
  return (
    <div>
      {parts.map(part => <Part key={part.id} part={part} />)}
    </div>
  )
}

const Course = (props) => {
  return (
    <div>
      <Header course={props.course.name} />
      <Content parts={props.course.parts} />
      <Total parts={props.course.parts} />
    </div>
  )
}

export default Course