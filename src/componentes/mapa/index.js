import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components"; 

const Button = styled.button`
  padding: 12px 24px;
  background: #6a11cb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
  position: absolute;
  right: 20px;
  z-index: 1000;

  &:hover {
    background: #2575fc;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ListButton = styled(Button)`
  top: 20px;
`;

const LoginButton = styled(Button)`
  top: 80px;
`;

const PopupContainer = styled.div`
  font-family: 'Arial', sans-serif;
  padding: 10px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: left;
`;

const PopupTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 18px;
  color: #333;
`;

const PopupText = styled.p`
  margin: 5px 0;
  font-size: 14px;
  color: #555;
`;

function Mapa() {
  const [pontosServicos, setPontosServicos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPontos = async () => {
      try {
        const response = await axios.get("http://localhost:5001/pontos");
        setPontosServicos(response.data);
      } catch (error) {
        console.error("Erro ao buscar os pontos de serviço", error);
      }
    };

    fetchPontos();
  }, []);

  useEffect(() => {
    const defaultIcon = new L.Icon({
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
      shadowSize: [41, 41],
    });

    L.Marker.prototype.options.icon = defaultIcon;
  }, []);

  return (
    <div className="relative h-screen w-screen flex">    
      <ListButton onClick={() => navigate("/lista")}>
        Ir para Lista
      </ListButton>
     
      <LoginButton onClick={() => navigate("/")}>
        Voltar para Login
      </LoginButton>

      <div className="flex-1">
        <MapContainer
          center={[-9.6658, -35.7353]}
          zoom={13}
          style={{ height: "100vh", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {pontosServicos.map((ponto, index) => (
            <Marker key={index} position={[ponto.latitude, ponto.longitude]}>
              <Popup>
                <PopupContainer>
                  <PopupTitle>{ponto.etiqueta}</PopupTitle>
                  <PopupText>Latitude: {ponto.latitude}</PopupText>
                  <PopupText>Longitude: {ponto.longitude}</PopupText>
                  <PopupText>Logradouro: {ponto.logradouro}</PopupText>
                  <PopupText>Tipo: {ponto.tipo}</PopupText>
                </PopupContainer>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default Mapa;