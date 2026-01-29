import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box } from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';

import { Patient, Gender } from "../../types";
import patientService from "../../services/patients";

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        try {
          const patient = await patientService.get(id);
          setPatient(patient);
        } catch (e) {
          console.error(e);
        }
      }
    };
    void fetchPatient();
  }, [id]);

  if (!patient) return null;

  const genderIcon = () => {
    switch (patient.gender) {
      case Gender.Male:
        return <MaleIcon />;
      case Gender.Female:
        return <FemaleIcon />;
      case Gender.Other:
        return <TransgenderIcon />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <Box style={{ marginBottom: "1em", marginTop: "1em" }}>
        <Typography variant="h4">
            {patient.name} {genderIcon()}
        </Typography>
        <Typography variant="body1">
            ssn: {patient.ssn}
        </Typography>
        <Typography variant="body1">
            occupation: {patient.occupation}
        </Typography>
      </Box>

      <Box style={{ marginBottom: "1em" }}>
          <Typography variant="h5">
              entries
          </Typography>
          {patient.entries.map((entry, index) => (
              <div key={index}>
                  <p>{JSON.stringify(entry)}</p>
              </div>
          ))}
      </Box>
    </div>
  );
};

export default PatientPage;
