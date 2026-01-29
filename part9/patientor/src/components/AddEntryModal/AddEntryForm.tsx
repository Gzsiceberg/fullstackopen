import { useState, SyntheticEvent } from "react";
import {
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Button,
  SelectChangeEvent,
  Tabs,
  Tab,
  Box,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormControl,
} from "@mui/material";

import { EntryFormValues, Diagnosis, HealthCheckRating } from "../../types";

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryFormValues) => void;
  diagnoses: Diagnosis[];
}

type EntryType = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

const healthCheckRatingOptions = [
  { value: HealthCheckRating.Healthy, label: "Healthy" },
  { value: HealthCheckRating.LowRisk, label: "Low Risk" },
  { value: HealthCheckRating.HighRisk, label: "High Risk" },
  { value: HealthCheckRating.CriticalRisk, label: "Critical Risk" },
];

const AddEntryForm = ({ onCancel, onSubmit, diagnoses }: Props) => {
  // Common fields
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  // Entry type
  const [entryType, setEntryType] = useState<EntryType>("HealthCheck");

  // HealthCheck specific
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(
    HealthCheckRating.Healthy
  );

  // Hospital specific
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  // OccupationalHealthcare specific
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState("");
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState("");
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const handleTabChange = (_event: SyntheticEvent, newValue: EntryType) => {
    setEntryType(newValue);
  };

  const handleDiagnosisCodesChange = (
    event: SelectChangeEvent<typeof diagnosisCodes>
  ) => {
    const {
      target: { value },
    } = event;
    setDiagnosisCodes(typeof value === "string" ? value.split(",") : value);
  };

  const handleHealthCheckRatingChange = (event: SelectChangeEvent<number>) => {
    setHealthCheckRating(Number(event.target.value) as HealthCheckRating);
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    if (
      entryType === "OccupationalHealthcare" &&
      ((sickLeaveStartDate && !sickLeaveEndDate) ||
        (!sickLeaveStartDate && sickLeaveEndDate))
    ) {
      setFormError("Both sick leave dates must be provided or both left empty.");
      return;
    }

    setFormError(undefined);

    const baseEntry = {
      description,
      date,
      specialist,
      diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined,
    };

    switch (entryType) {
      case "HealthCheck":
        onSubmit({
          ...baseEntry,
          type: "HealthCheck",
          healthCheckRating,
        });
        break;
      case "Hospital":
        onSubmit({
          ...baseEntry,
          type: "Hospital",
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        });
        break;
      case "OccupationalHealthcare":
        onSubmit({
          ...baseEntry,
          type: "OccupationalHealthcare",
          employerName,
          sickLeave:
            sickLeaveStartDate && sickLeaveEndDate
              ? {
                  startDate: sickLeaveStartDate,
                  endDate: sickLeaveEndDate,
                }
              : undefined,
        });
        break;
    }
  };

  return (
    <div>
      {formError && (
        <Box sx={{ marginBottom: 2, color: "error.main" }}>{formError}</Box>
      )}
      <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 2 }}>
        <Tabs value={entryType} onChange={handleTabChange}>
          <Tab label="Health Check" value="HealthCheck" />
          <Tab label="Hospital" value="Hospital" />
          <Tab label="Occupational" value="OccupationalHealthcare" />
        </Tabs>
      </Box>

      <form onSubmit={addEntry}>
        {/* Common Fields */}
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
          style={{ marginBottom: 10 }}
        />
        <TextField
          label="Date"
          placeholder="YYYY-MM-DD"
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
          style={{ marginBottom: 10 }}
        />
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
          style={{ marginBottom: 10 }}
        />

        {/* Diagnosis Codes Multi-select */}
        <FormControl fullWidth style={{ marginBottom: 10 }}>
          <InputLabel id="diagnosis-codes-label">Diagnosis Codes</InputLabel>
          <Select
            labelId="diagnosis-codes-label"
            multiple
            value={diagnosisCodes}
            onChange={handleDiagnosisCodesChange}
            input={<OutlinedInput label="Diagnosis Codes" />}
            renderValue={(selected) => selected.join(", ")}
          >
            {diagnoses.map((diagnosis) => (
              <MenuItem key={diagnosis.code} value={diagnosis.code}>
                <Checkbox checked={diagnosisCodes.indexOf(diagnosis.code) > -1} />
                <ListItemText primary={`${diagnosis.code} - ${diagnosis.name}`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* HealthCheck specific fields */}
        {entryType === "HealthCheck" && (
          <>
            <InputLabel style={{ marginTop: 10 }}>Health Check Rating</InputLabel>
            <Select
              fullWidth
              value={healthCheckRating}
              onChange={handleHealthCheckRatingChange}
              style={{ marginBottom: 10 }}
            >
              {healthCheckRatingOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </>
        )}

        {/* Hospital specific fields */}
        {entryType === "Hospital" && (
          <>
            <TextField
              label="Discharge Date"
              placeholder="YYYY-MM-DD"
              fullWidth
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
              style={{ marginBottom: 10 }}
            />
            <TextField
              label="Discharge Criteria"
              fullWidth
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
              style={{ marginBottom: 10 }}
            />
          </>
        )}

        {/* OccupationalHealthcare specific fields */}
        {entryType === "OccupationalHealthcare" && (
          <>
            <TextField
              label="Employer Name"
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
              style={{ marginBottom: 10 }}
            />
            <TextField
              label="Sick Leave Start Date (optional)"
              placeholder="YYYY-MM-DD"
              fullWidth
              value={sickLeaveStartDate}
              onChange={({ target }) => setSickLeaveStartDate(target.value)}
              style={{ marginBottom: 10 }}
            />
            <TextField
              label="Sick Leave End Date (optional)"
              placeholder="YYYY-MM-DD"
              fullWidth
              value={sickLeaveEndDate}
              onChange={({ target }) => setSickLeaveEndDate(target.value)}
              style={{ marginBottom: 10 }}
            />
          </>
        )}

        <Grid container spacing={2} style={{ marginTop: 20 }}>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddEntryForm;
