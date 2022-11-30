interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

interface CoursePartBaseWithDesc extends CoursePartBase {
  description: string;
}

interface CourseNormalPart extends CoursePartBaseWithDesc {
  type: "normal";
}

interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

interface CourseSubmissionPart extends CoursePartBaseWithDesc {
  type: "submission";
  exerciseSubmissionLink: string;
}

interface CourseBackendPart extends CoursePartBaseWithDesc {
  type: "special";
  requirements: string[];
}

type CoursePart =
  | CourseNormalPart
  | CourseProjectPart
  | CourseSubmissionPart
  | CourseBackendPart;

const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is the easy course part",
    type: "normal",
  },
  {
    name: "Advanced",
    exerciseCount: 7,
    description: "This is the hard course part",
    type: "normal",
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3,
    type: "groupProject",
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev",
    type: "submission",
  },
  {
    name: "Backend development",
    exerciseCount: 21,
    description: "Typing the backend",
    requirements: ["nodejs", "express", "jest"],
    type: "special",
  },
];

const Header = ({ courseName }: { courseName: string }) => (
  <h1>{courseName}</h1>
);

const Part = ({ p }: { p: CoursePart }) => {
  const PartHeader = (
    <b>
      {p.name} {p.exerciseCount}
    </b>
  );
  switch (p.type) {
    case "normal":
      return (
        <p>
          {PartHeader}
          <br />
          <i>{p.description}</i>
        </p>
      );
    case "groupProject":
      return (
        <p>
          <b>
            {p.name} {p.exerciseCount}
          </b>
          <br />
          There are {p.groupProjectCount} group projects in this part
        </p>
      );
    case "submission":
      return (
        <p>
          {PartHeader}
          <br />
          <i>{p.description}</i>
        </p>
      );
    case "special":
      return (
        <p>
          {PartHeader}
          <br />
          <i>{p.description}</i>
          <br />
          Required skills:
          {p.requirements.map((r, i, a) =>
            i + 1 === a.length ? ` ${r}` : ` ${r},`
          )}
        </p>
      );
    default:
      return null;
  }
};

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => (
  <>
    {courseParts.map((p) => (
      <Part key={p.name} p={p} />
    ))}
  </>
);

const Total = ({ numberOfExercises }: { numberOfExercises: number }) => (
  <p>Number of exercises in the whole course: {numberOfExercises}</p>
);

const App = () => {
  const courseName = "Half Stack application development";
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
