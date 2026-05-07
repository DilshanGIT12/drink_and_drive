import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { Search, MapPin, Navigation } from 'lucide-react';

// Fix for default marker icons in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Custom Icons
const pickupIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const dropoffIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Helper component to recenter map
function ChangeView({ center }) {
    const map = useMap();
    useEffect(() => {
        map.invalidateSize();
        if (center) map.setView(center, 13);
    }, [center, map]);
    return null;
}

const Map = ({ onLocationSelect, pickup, dropoff, setDistance, activeTrips = [], showSearch = true }) => {

    const [searchQuery, setSearchQuery] = useState({ pickup: '', dropoff: '' });
    const [suggestions, setSuggestions] = useState({ pickup: [], dropoff: [] });
    const [route, setRoute] = useState([]);
    const defaultCenter = [6.9271, 79.8612]; // Colombo

    // Free Search Function (Nominatim)
    const handleSearch = async (query, type) => {
        setSearchQuery(prev => ({ ...prev, [type]: query }));
        if (query.length < 3) return;

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5&countrycodes=lk`);
            const data = await response.json();
            setSuggestions(prev => ({ ...prev, [type]: data }));
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    const selectSuggestion = (item, type) => {
        const location = {
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            address: item.display_name
        };
        onLocationSelect(type, location);
        setSearchQuery(prev => ({ ...prev, [type]: item.display_name }));
        setSuggestions(prev => ({ ...prev, [type]: [] }));
    };

    // Calculate Route and Distance (Using OSRM - Free Routing Machine)
    useEffect(() => {
        if (pickup && dropoff) {
            const fetchRoute = async () => {
                try {
                    const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=full&geometries=geojson`);
                    const data = await response.json();
                    
                    if (data.routes && data.routes.length > 0) {
                        const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
                        setRoute(coords);
                        if (setDistance) setDistance(data.routes[0].distance / 1000);
                    }
                } catch (error) {
                    console.error('Routing error:', error);
                }
            };
            fetchRoute();
        }
    }, [pickup, dropoff, setDistance]);

    const mapCenter = (pickup && !isNaN(pickup.lat) && !isNaN(pickup.lng)) 
        ? [pickup.lat, pickup.lng] 
        : defaultCenter;

    return (
        <div className="h-full w-full relative">
            <MapContainer 
                center={mapCenter} 
                zoom={13} 
                style={{ height: '100%', width: '100%', background: '#111', zIndex: 1 }} 
                zoomControl={false}
            >
                <TileLayer 
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <ZoomControl position="bottomright" />
                
                {pickup && <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon} />}
                {dropoff && <Marker position={[dropoff.lat, dropoff.lng]} icon={dropoffIcon} />}
                {route.length > 0 && <Polyline positions={route} color="#ef4444" weight={5} opacity={0.8} />}
                
                {/* Admin View: Show Multiple Active Missions */}
                {activeTrips.map((trip, idx) => (
                    <React.Fragment key={trip._id || idx}>
                        <Marker 
                            position={[trip.pickupLocation.coordinates[1], trip.pickupLocation.coordinates[0]]} 
                            icon={pickupIcon} 
                        />
                        <Marker 
                            position={[trip.dropoffLocation.coordinates[1], trip.dropoffLocation.coordinates[0]]} 
                            icon={dropoffIcon} 
                        />
                    </React.Fragment>
                ))}

                
                <ChangeView center={mapCenter} />
            </MapContainer>

            {/* Tactical Search Interface */}
            {showSearch && (
                <div className="absolute top-6 left-6 right-6 z-[1000] flex flex-col md:flex-row gap-3 pointer-events-none">
                    <SearchBox 
                        type="pickup" 
                        placeholder="Pickup Point" 
                        icon={<Navigation size={24} className="text-accent" />}
                        value={searchQuery.pickup}
                        suggestions={suggestions.pickup}
                        onSearch={handleSearch}
                        onSelect={selectSuggestion}
                    />
                    <SearchBox 
                        type="dropoff" 
                        placeholder="Mission Destination" 
                        icon={<MapPin size={24} className="text-red-500" />}
                        value={searchQuery.dropoff}
                        suggestions={suggestions.dropoff}
                        onSearch={handleSearch}
                        onSelect={selectSuggestion}
                    />
                </div>
            )}
        </div>
    );
};

const SearchBox = ({ type, placeholder, icon, value, suggestions, onSearch, onSelect }) => (
    <div className="flex-1 pointer-events-auto relative">
        <div className="bg-[#111111]/90 backdrop-blur-xl border border-white/10 rounded-xl flex items-center p-1.5 shadow-2xl">
            <div className="w-10 h-10 flex items-center justify-center scale-75">{icon}</div>
            <input 
                type="text"
                placeholder={placeholder}
                className="flex-1 bg-transparent border-none text-white text-[11px] font-black uppercase italic p-2 outline-none placeholder:text-gray-800"
                value={value}
                onChange={(e) => onSearch(e.target.value, type)}
            />
            <div className="p-3"><Search size={24} className="text-gray-700" /></div>
        </div>

        {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#111111] border border-white/5 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                {suggestions.map((item, idx) => (
                    <button 
                        key={idx}
                        onClick={() => onSelect(item, type)}
                        className="w-full text-left p-4 hover:bg-white/5 text-xs font-bold text-gray-400 border-b border-white/[0.02] last:border-none transition-colors truncate"
                    >
                        {item.display_name}
                    </button>
                ))}
            </div>
        )}
    </div>
);

export default Map;
