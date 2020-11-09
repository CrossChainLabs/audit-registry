import React from 'react';
import { useParams } from "react-router-dom";
import SignAudit from '../../components/SignAudit';
import Header from '../../components/Header';
export default function PageSignAudit() {
  const { codehash } = useParams();

  return (
    <>
      <Header />
      {SignAudit(codehash)}
    </>
  );
}
