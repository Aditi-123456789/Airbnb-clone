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
              <div className="font-semibold">Room in {hotel.District}</div>
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

const SetBoundsRectangles = ({ setInnerMap, setDisplayHotels, date, priceRange }) => {
  const map = useMap();

  const isDateInRange = (availabilitydates, selectedDate) => {
    if (!selectedDate.startDate || !selectedDate.endDate) return true;
    const selectedStartDate = new Date(selectedDate.startDate);
    const selectedEndDate = new Date(selectedDate.endDate);

    return availabilitydates.some(({ from, to }) => {
      const hotelStartDate = new Date(from);
      const hotelEndDate = new Date(to);
      return (
        (selectedStartDate >= hotelStartDate && selectedStartDate <= hotelEndDate) ||
        (selectedEndDate >= hotelStartDate && selectedEndDate <= hotelEndDate) ||
        (selectedStartDate <= hotelStartDate && selectedEndDate >= hotelEndDate)
      );
    });
  };

  const fetchHotelsWithinBounds = () => {
    const hotels = hotelData.filter((hotel) => {
      const inBounds = map.getBounds().contains(hotel.location);
      const inDateRange = isDateInRange(hotel.availabilitydates, date);
      const inPriceRange = typeof priceRange === 'number' ? hotel.price <= priceRange : true;
      return inBounds && inDateRange && inPriceRange;
    });
    setInnerMap(hotels);
    setDisplayHotels(hotels);
  };

  useEffect(() => {
    fetchHotelsWithinBounds();
  }, [map, date, priceRange]);

  useMapEvents({
    moveend: fetchHotelsWithinBounds,
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

const MissionMap = ({ setDisplayHotels, location, date, priceRange }) => {
  const [innerMap, setInnerMap] = useState([]);

  return (
    <div className="h-full w-full">
      <MapContainer center={location.latLon} zoom={location.zoom || 12} className="h-[100%]" scrollWheelZoom={true}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <SetBoundsRectangles 
          setInnerMap={setInnerMap} 
          setDisplayHotels={setDisplayHotels} 
          date={date} 
          priceRange={priceRange} 
        />
        <HotelMarkers innerMap={innerMap} />
        <UpdateMapCenter location={location} />
      </MapContainer>
    </div>
  );
};

export default MissionMap;
