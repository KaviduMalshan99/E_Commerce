import React from 'react';
import './SizeChartModal.scss'; // Create this CSS file for styling

const SizeChartModal = ({ imgSrc, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" style={{ background:'none'}} onClick={onClose}>X</button>
        <img src={imgSrc} alt="Size Chart" className="size-chart-image" />
      </div>
    </div>
  );
};

export default SizeChartModal;
