import React from 'react';
import { useParams } from "react-router-dom";
import ProjectDetails from '../../components/ProjectDetails';

export default function PageProjectDetails() {
  const { url } = useParams();
  return (
    <>
      {ProjectDetails(url)}
    </>
  );
}
