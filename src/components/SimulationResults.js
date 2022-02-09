import React from "react";

const SimulationResults = ({simulationResults}) => {
  // Return empty if no simulation results
  if(!simulationResults.length) return null;

  return (
    <div  className='SimulationResults'>
      <div className="ui mini message">
        <div className="header">Simulation results</div>
        <div className="scrolling content">
          <p>{simulationResults.join('\r\n')}</p>
        </div>
      </div>
    </div>
  );
}

export default SimulationResults