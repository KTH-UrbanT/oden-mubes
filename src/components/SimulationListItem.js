import React from "react";

const SimulationListItem = ({building, availableBuildings, onCloseButtonClick}) => {
  const availableBuilding = availableBuildings.some(uuid => uuid === building['50A_UUID']);

  return (
    <div className="item" id={building['50A_UUID']}>
      {building.IdAdr}

      <i className="right floated grey delete icon" onClick={() => onCloseButtonClick(building)}/>
      {availableBuilding && <i className="right floated green check icon"/>}
      {!availableBuilding && <i className="right floated red ban icon"/>}
    </div>
  );
}

export default SimulationListItem;