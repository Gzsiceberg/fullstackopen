interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescription {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[];
  kind: "special"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case "basic":
      return (
        <div style={{ marginBottom: 10 }}>
          <b>{part.name} {part.exerciseCount}</b>
          <div><i>{part.description}</i></div>
        </div>
      );
    case "group":
      return (
        <div style={{ marginBottom: 10 }}>
          <b>{part.name} {part.exerciseCount}</b>
          <div>project exercises {part.groupProjectCount}</div>
        </div>
      );
    case "background":
      return (
        <div style={{ marginBottom: 10 }}>
          <b>{part.name} {part.exerciseCount}</b>
          <div><i>{part.description}</i></div>
          <div>submit to {part.backgroundMaterial}</div>
        </div>
      );
    case "special":
      return (
        <div style={{ marginBottom: 10 }}>
          <b>{part.name} {part.exerciseCount}</b>
          <div><i>{part.description}</i></div>
          <div>required skills: {part.requirements.join(", ")}</div>
        </div>
      );
    default:
      return assertNever(part);
  }
};

interface HeaderProps {
  name: string;
}

const Header = (props: HeaderProps) => {
  return <h1>{props.name}</h1>;
};

interface ContentProps {
  courseParts: CoursePart[];
}

const Content = (props: ContentProps) => {
  return (
    <div>
      {props.courseParts.map((part) => (
        <Part key={part.name} part={part} />
      ))}
    </div>
  );
};

interface TotalProps {
  total: number;
}

const Total = (props: TotalProps) => {
  return (
    <p>
      Number of exercises {props.total}
    </p>
  );
};

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total total={totalExercises} />
    </div>
  );
};

export default App;
