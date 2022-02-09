import React from "react";
import SimulationListItem from "./SimulationListItem";

const SimulationList = ({buildingsToSimulate,
                          availableBuildings,
                          setBuildingsToSimulate,
                          queueSimulation,
                          simulationResults,
                          setSimulationResults}) => {
  function onCloseButtonClick (removedBuilding) {
    console.log(`${removedBuilding.IdAdr} (${removedBuilding["50A_UUID"]}) will be removed.`);

    setBuildingsToSimulate(buildingsToSimulate.filter((building) => building["50A_UUID"] !== removedBuilding["50A_UUID"]));
  };

  const renderedListOfBuildings = buildingsToSimulate.map(
    building => <SimulationListItem building={building}
                                    availableBuildings={availableBuildings}
                                    key={building['50A_UUID']}
                                    onCloseButtonClick={onCloseButtonClick}/>
  );

  // Stop render if there's no buildings to simulate
  if (!buildingsToSimulate.length) return null;

  return (
    <div className='SimulationList'>
      <div className='ui segment'>
        <h4>Simulation list</h4>
        <div className="ui tiny list">
          {renderedListOfBuildings}
        </div>
        <button className="ui primary button"
                onClick={() =>
                  queueSimulation()
                    .then(data => setSimulationResults([...simulationResults,...data]))
                    .catch(err => console.error(err))
                }>
          Run simulation
        </button>
      </div>
    </div>
  );
};

export default SimulationList;