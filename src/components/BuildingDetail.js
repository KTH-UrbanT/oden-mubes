import React from "react";

const BuildingDetail = ({building}) => {
  if (!building) return null;

  return(
    <div className="BuildingDetail">
      <div className="ui segment">
        <h4 className="ui header">Sickla Kanalgata 17</h4>
        <div className="ui content">
          Flerbostadshus<br/>
          1750 m2
        </div>
      </div>
    </div>
  );
};

export default BuildingDetail;