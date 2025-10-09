import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MiniMap() {
    const position = [10.8514, 106.7581]; // Ví dụ: HCM

    return (
        <div className="w-full h-full">
            <div className="w-full h-full flex flex-col justify-center items-center ">
                <div className="text-3xl font-bold py-5 text-blue-400">Tìm Kiếm Chúng Tôi Trên Bản Đồ

                </div>                <div>
                    <MapContainer
                        center={position}
                        zoom={15}
                        style={{ width: "800px", height: "400px", borderRadius: "12px", boxShadow: "2px 2px 2px 2px" }}
                    >
                        {/* Tile từ OpenStreetMap (free) */}
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {/* Marker */}
                        <Marker position={position}>
                            <Popup>Đây là vị trí của bạn 🚩</Popup>
                        </Marker>
                    </MapContainer>

                </div>
            </div>
        </div>
    );
}
