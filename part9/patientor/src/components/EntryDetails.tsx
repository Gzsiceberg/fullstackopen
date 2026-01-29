import { Box, Typography } from "@mui/material";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Entry, Diagnosis, HealthCheckEntry, OccupationalHealthcareEntry, HospitalEntry, HealthCheckRating } from "../types";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const EntryDetails: React.FC<Props> = ({ entry, diagnoses }) => {

  const findDiagnosisName = (code: string) => {
    const diagnosis = diagnoses.find(d => d.code === code);
    return diagnosis ? diagnosis.name : null;
  };

  const DiagnosisList = () => {
    if (!entry.diagnosisCodes || entry.diagnosisCodes.length === 0) {
      return null;
    }

    return (
      <ul>
        {entry.diagnosisCodes.map((code) => (
          <li key={code}>
            {code} {findDiagnosisName(code)}
          </li>
        ))}
      </ul>
    );
  };

  const HealthRatingIcon = ({ rating }: { rating: HealthCheckRating }) => {
    let color: string;
    switch (rating) {
      case HealthCheckRating.Healthy:
        color = "green";
        break;
      case HealthCheckRating.LowRisk:
        color = "yellow";
        break;
      case HealthCheckRating.HighRisk:
        color = "orange";
        break;
      case HealthCheckRating.CriticalRisk:
        color = "red";
        break;
      default:
        color = "black";
    }
    return <FavoriteIcon style={{ color }} />;
  };


  const HospitalEntryDetails: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
    return (
        <Box sx={{ border: '1px solid black', borderRadius: '5px', padding: '10px', marginBottom: '10px' }}>
            <Typography variant="body1">
                {entry.date} <LocalHospitalIcon />
            </Typography>
            <Typography variant="body1" style={{ fontStyle: 'italic' }}>
                {entry.description}
            </Typography>
            <DiagnosisList />
            <Typography variant="body1">
                diagnose by {entry.specialist}
            </Typography>
        </Box>
    );
  };

  const OccupationalHealthcareEntryDetails: React.FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) => {
    return (
        <Box sx={{ border: '1px solid black', borderRadius: '5px', padding: '10px', marginBottom: '10px' }}>
            <Typography variant="body1">
                {entry.date} <WorkIcon /> {entry.employerName}
            </Typography>
            <Typography variant="body1" style={{ fontStyle: 'italic' }}>
                {entry.description}
            </Typography>
            <DiagnosisList />
            <Typography variant="body1">
                diagnose by {entry.specialist}
            </Typography>
        </Box>
    );
  };

  const HealthCheckEntryDetails: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
    return (
        <Box sx={{ border: '1px solid black', borderRadius: '5px', padding: '10px', marginBottom: '10px' }}>
             <Typography variant="body1">
                {entry.date} <MedicalServicesIcon />
            </Typography>
            <Typography variant="body1" style={{ fontStyle: 'italic' }}>
                {entry.description}
            </Typography>
            <HealthRatingIcon rating={entry.healthCheckRating} />
            <DiagnosisList />
            <Typography variant="body1">
                diagnose by {entry.specialist}
            </Typography>
        </Box>
    );
  };

  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryDetails entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryDetails entry={entry} />;
    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
