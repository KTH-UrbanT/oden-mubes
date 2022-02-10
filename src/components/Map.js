import React, {useEffect, useRef, useState} from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import BuildingDetail from './BuildingDetail';
import SimulationList from './SimulationList';
import SimulationResults from './SimulationResults';
import mubes from '../api/mubes';

mapboxgl.accessToken = 'pk.eyJ1Ijoib2xla3NpaXBhc2ljaG55aSIsImEiOiJja3c0ejJhNzcwMmRnMzFsNXMzMGltaW93In0.lO5JrzQ_cp4Jt-XTzqE62w';

const Map = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    // Default startup location
    // const [lng, setLng] = useState(18.07);
    // const [lat, setLat] = useState(59.32);
    // const [zoom, setZoom] = useState(12);

    // Minneberg startup location
    const [lng, setLng] = useState(18.00);
    const [lat, setLat] = useState(59.34);
    const [zoom, setZoom] = useState(14);

    const [availableBuildings, setAvailableBuildings] = useState([]);
    const [buildingsToSimulate, setBuildingsToSimulate] = useState([]);
    const [simulationResults, setSimulationResults] = useState([]);

    // MAP INITIALISATION
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [lng, lat],
            zoom: zoom
        });

        // Adding buildings' layer
        map.current.on('load', () => {
            // Local file option
            // map.current.on('load', () => {
            //     map.current.addSource('buildings', {
            //         type: 'geojson',
            //         data: './data/pmBuildings.geojson'
            //     });

            // Remote Mapbox layer option
            map.current.addSource('pmBuildings', {
                type: 'vector',
                url: 'mapbox://oleksiipasichnyi.pmBuildings'
            });

            map.current.addLayer({
                'id': 'buildings',
                'type': 'fill',
                'source': 'pmBuildings', // reference the data source
                'source-layer': 'pmBuildings',
                'layout': {},
                'paint': {
                    'fill-color': '#0080ff', // blue color fill
                    'fill-opacity': 0.5
                }
            });
        });

        const getListOfBuildings = async () => {
            const response = await mubes.get('buildings/all')
            return response.data;
        }

        getListOfBuildings()
          .then(data => setAvailableBuildings(data))
          .catch(err => console.error(err));
    });


    // MAP UPDATE
    useEffect(() => {
        if (!map.current) return; // wait for map to initialize

        function onBuildingClick(e) {
            // If building has no EPC return
            if(!e.features[0].properties?.Godkand) return;

            // If building is already in the list return
            if(buildingsToSimulate.some(building => building['50A_UUID'] === e.features[0].properties['50A_UUID'])) {
                console.log(`${e.features[0].properties['50A_UUID']} is already in the list`)
                return;
            };

            // console.log(e.features[0].properties);
            setBuildingsToSimulate([...buildingsToSimulate,e.features[0].properties]);
        }

        // Create a popup, but don't add it to the map yet.
        const buildingPopup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        function showBuildingPopup(e) {
            // Change the cursor style as a UI indicator.
            map.current.getCanvas().style.cursor = 'pointer';

            // console.log(e.features);

            // Copy coordinates array.
            const coordinates = e.lngLat;

            const description = '<h4 className="ui segment">' + e.features[0].properties.IdAdr + '</h4>';

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            buildingPopup.setLngLat(coordinates).setHTML(description).addTo(map.current);
        }

        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });

        map.current.on('mouseenter', 'buildings', showBuildingPopup);

        map.current.on('mouseleave', 'buildings', () => {
            map.current.getCanvas().style.cursor = '';
            buildingPopup.remove();
        });

        map.current.on('click', 'buildings', onBuildingClick);

    });

    // POST-based request
    const queueSimulations = async () => {
        const uuidsToSimulate = buildingsToSimulate.map(building => {
            return {
                uuid: building['50A_UUID']
            }
        });

        console.log(`Simulation is queued for ${uuidsToSimulate.map(b => b['uuid'])}`);
        const response = await mubes.post('buildings', uuidsToSimulate);

        return response.data;
    }
    const uuidsToSimulate = buildingsToSimulate.map(building => {
            return {
                uuid: building['50A_UUID']
            }
        });

    console.log(uuidsToSimulate);

    // console.log(buildingsToSimulate);

    // GET-based request
    // const queueSimulation = async () => {
    //     const uuidsToSimulate = buildingsToSimulate.map(building => building['50A_UUID']);
    //     console.log(`Simulation is queued for ${uuidsToSimulate}`);
    //     const response = await mubes.get('buildings', {
    //         params: {
    //             id: uuidsToSimulate[0]
    //         }
    //     });
    //
    //     return response.data;
    // }

    return (
      <div>
          <div className="sidebar">
              Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
          </div>
          <div ref={mapContainer} className="map-container"/>
          <BuildingDetail/>
          <SimulationList buildingsToSimulate={buildingsToSimulate}
                          availableBuildings={availableBuildings}
                          setBuildingsToSimulate={setBuildingsToSimulate}
                          queueSimulations={queueSimulations}
                          simulationResults = {simulationResults}
                          setSimulationResults = {setSimulationResults}
          />
          <SimulationResults simulationResults = {simulationResults}/>
      </div>
    );
};

export default Map;
