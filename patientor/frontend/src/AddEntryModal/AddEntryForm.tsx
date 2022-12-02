import { Grid, Button } from "@material-ui/core";
import { Field, Formik, Form } from "formik";

import {
  TextField,
  SelectField,
  TypeOption,
  DiagnosisSelection,
  HealthCheckRatingOption,
} from "./FormField";
import { EntryFormValues, HealthCheckRating } from "../types";
import { useStateValue } from "../state";

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const typeOptions: TypeOption[] = [
  { value: "OccupationalHealthcare", label: "Occupational Healthcare" },
  { value: "HealthCheck", label: "Health Check" },
  { value: "Hospital", label: "Hospital" },
];

const healthCheckRatingOptions: HealthCheckRatingOption[] = [
  { value: HealthCheckRating.Healthy, label: "Healthy" },
  { value: HealthCheckRating.LowRisk, label: "Low Risk" },
  { value: HealthCheckRating.HighRisk, label: "High Risk" },
  { value: HealthCheckRating.CriticalRisk, label: "Critical Risk" },
];

export const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ diagnoses }] = useStateValue();
  return (
    <Formik
      initialValues={{
        date: new Date().toLocaleString(),
        description: "",
        specialist: "",
        type: "OccupationalHealthcare",
        diagnosisCodes: [],
        employerName: "",
        sickLeave: {
          startDate: "",
          endDate: "",
        },
        discharge: {
          date: "",
          criteria: "",
        },
        healthCheckRating: HealthCheckRating.Healthy,
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = "Field is required";
        const errors: { [field: string]: string } = {};
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.type) {
          errors.type = requiredError;
        }
        if (values.type === "OccupationalHealthcare") {
          if (!values.employerName) {
            errors.employerName = requiredError;
          }
        }
        if (values.type === "HealthCheck") {
          if (
            !Object.values(HealthCheckRating).includes(values.healthCheckRating)
          ) {
            errors.healthCheckRating = requiredError;
          }
        }
        if (values.type === "Hospital") {
          if (!values.discharge.date) {
            errors["discharge.date"] = requiredError;
          }
          if (!values.discharge.criteria) {
            errors["discharge.criteria"] = requiredError;
          }
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
        return (
          <Form className="form ui">
            <SelectField label="Type" name="type" options={typeOptions} />
            <Field
              label="Date"
              placeholder="Date"
              name="date"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={diagnoses ? Object.values(diagnoses) : []}
            />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            {values.type === "OccupationalHealthcare" && (
              <>
                <Field
                  label="Employer"
                  placeholder="Employer"
                  name="employerName"
                  component={TextField}
                />
                <Field
                  label="Sick leave start"
                  placeholder="Sick leave start"
                  name="sickLeave.startDate"
                  component={TextField}
                />
                <Field
                  label="Sick leave end"
                  placeholder="Sick leave end"
                  name="sickLeave.endDate"
                  component={TextField}
                />
              </>
            )}
            {values.type === "HealthCheck" && (
              <SelectField
                label="Health check rating"
                name="healthCheckRating"
                options={healthCheckRatingOptions}
              />
            )}
            {values.type === "Hospital" && (
              <>
                <Field
                  label="Discharge date"
                  placeholder="Date"
                  name="discharge.date"
                  component={TextField}
                />
                <Field
                  label="Discharge criteria"
                  placeholder="Criteria"
                  name="discharge.criteria"
                  component={TextField}
                />
              </>
            )}

            <Grid>
              <Grid item>
                <Button
                  color="secondary"
                  variant="contained"
                  style={{ float: "left" }}
                  type="button"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right",
                  }}
                  type="submit"
                  variant="contained"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
