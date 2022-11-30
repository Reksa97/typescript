const Header = ({ courseName }: { courseName: string }) => (
  <h1>{courseName}</h1>
);

interface CoursePart {
  name: string;
  exerciseCount: number;
}

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => (
  <>
    {courseParts.map((p) => (
      <p key={p.name}>
        {p.name} {p.exerciseCount}
      </p>
    ))}
  </>
);

const Total = ({ numberOfExercises }: { numberOfExercises: number }) => (
  <p>Number of exercises {numberOfExercises}</p>
);

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
    },
  ];

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total
        numberOfExercises={courseParts.reduce(
          (carry, part) => carry + part.exerciseCount,
          0
        )}
      />
    </div>
  );
};

export default App;
