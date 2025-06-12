// src/components/ReportCard.jsx
import React from 'react';
import '../styles/ReportCard.css';

const ReportCard = ({ type, text }) => (
  <div className="report-card">
    <div className="card-label">{type}</div>
    <div className="card-text">{text}</div>
  </div>
);

export default ReportCard;
