import React from 'react';
import { useParams } from "react-router-dom";
import AuditorDetails from '../../components/AuditorDetails';

export default function PageAuditorDetails() {
  const { auditor, metadata } = useParams();

  return (
    <>
      {AuditorDetails(auditor, metadata)}
    </>
  );
}
