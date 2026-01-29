import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Button } from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';
import axios from "axios";

import { Patient, Gender, Diagnosis, EntryFormValues } from "../../types";
import patientService from "../../services/patients";
import EntryDetails from "../EntryDetails";
import AddEntryModal from "../AddEntryModal";

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

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

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    if (!id || !patient) return;

    try {
      const newEntry = await patientService.createEntry(id, values);
      setPatient((prev) =>
        prev
          ? {
              ...prev,
              entries: prev.entries.concat(newEntry),
            }
          : prev
      );
      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "object") {
          const data = e.response.data as { error?: unknown };
          if (Array.isArray(data.error)) {
            // Zod validation errors
            const messages = data.error.map((issue: { message: string; path: string[] }) => 
              `${issue.path.join('.')}: ${issue.message}`
            ).join('; ');
            setError(messages);
          } else if (typeof data.error === "string") {
            setError(data.error);
          } else {
            setError("Unknown error occurred");
          }
        } else {
          setError("Unknown Axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

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
          {patient.entries.map((entry) => (
              <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
          ))}
      </Box>

      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
        diagnoses={diagnoses}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </div>
  );
};

export default PatientPage;
