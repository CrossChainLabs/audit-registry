import React from 'react';
import { useParams } from "react-router-dom";
import ReportAdvisory from '../../components/ReportAdvisory';
import Header from '../../components/Header';
export default function PageReportAdvisory() {
  const { codehash } = useParams();

  return (
    <>
      <Header />
      {ReportAdvisory(codehash)}
    </>
  );
}
