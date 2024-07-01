import React, { useState, useEffect } from 'react';
import { MapContainer, useMapEvents, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';
import hotelData from './hotelData';
import hotelImg from '../../utils/hotel.jpeg';
import './customstyles.css';

const HotelMarkers = ({ innerMap }) => {
  return innerMap.map((hotel) => {
    const icon = divIcon({
      className: 'custom-icon',
      iconSize: [30, 30],
      html: `<div>${hotel.price}</div>`,
    });
    return (
      <Marker key={hotel.id} position={hotel.location} icon={icon}>
        <Popup>
          <div className="flex flex-col items-start justify-center content-center">
            <img src={hotelImg} alt="Hotel" className="rounded-2xl" />
            <div className="flex justify-between items-center w-full">
              <div className="font-semibold">Room in New Delhi</div>
            </div>
            <div className="font-thin">{hotel.name}</div>
            <div className="font-thin">A cozy apartment</div>
            <div className="font-thin">10-15 Mar</div>
            <div className="font-semibold pt-2">₹{hotel.price} night</div>
          </div>
        </Popup>
      </Marker>
    );
  });
};

const SetBoundsRectangles = ({ setInnerMap, setDisplayHotels }) => {
  const map = useMap();
  
  const fetchHotelsWithinBounds = () => {
    const hotels = hotelData.filter((hotel) => map.getBounds().contains(hotel.location));
    setInnerMap(hotels);
    setDisplayHotels(hotels);
  };

  useEffect(() => {
    fetchHotelsWithinBounds();
  }, [map]);

  useMapEvents({
    move: () => {
      fetchHotelsWithinBounds();
    }
  });

  return null;
};

const UpdateMapCenter = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (location.latLon) {
      map.setView(location.latLon, location.zoom);
    }
  }, [location, map]);

  return null;
};

const MissionMap = ({ setDisplayHotels, location }) => {
  const [innerMap, setInnerMap] = useState([]);
  
  return (
    <div className="h-full w-full">
      <MapContainer center={location.latLon} zoom={location.zoom || 12} className="h-[100%]" scrollWheelZoom={true}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <SetBoundsRectangles setInnerMap={setInnerMap} setDisplayHotels={setDisplayHotels} />
        <HotelMarkers innerMap={innerMap} />
        <UpdateMapCenter location={location} />
      </MapContainer>
    </div>
  );
};

export default MissionMap;
