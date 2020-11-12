import React from 'react';
import { useParams } from "react-router-dom";
import ProjectHistory from '../../components/ProjectHistory';

export default function PageProjectHistory() {
  const { url } = useParams();
  return (
    <>
      {ProjectHistory(url)}
    </>
  );
}
