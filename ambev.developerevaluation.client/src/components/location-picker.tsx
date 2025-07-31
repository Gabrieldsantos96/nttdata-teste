"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { MapPin, Navigation, Loader2, Search } from "lucide-react";

declare global {
  interface Window {
    L: any;
  }
}

interface AddressData {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  houseNumber?: string;
}

export interface LocationData {
  lat: number;
  lng: number;
  address?: AddressData;
}

interface LocationPickerProps {
  onLocationChange: (data: LocationData) => void;
  initialValueLat?: number;
  initialValueLng?: number;
}

interface NominatimAddress {
  house_number?: string;
  road?: string;
  street?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
}

interface NominatimResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: NominatimAddress;
  boundingbox: string[];
}

export default function LocationPicker({
  onLocationChange,
  initialValueLat,
  initialValueLng,
}: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    initialValueLat && initialValueLng
      ? { lat: initialValueLat, lng: initialValueLng }
      : null
  );

  const reverseGeocode = async (
    lat: number,
    lng: number
  ): Promise<LocationData> => {
    setIsGeocodingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=pt-BR,pt,en`
      );

      if (!response.ok) {
        throw new Error("Erro na busca do endereço");
      }

      const data: NominatimResponse = await response.json();

      const address: AddressData = {
        street: data.address?.road || data.address?.street,
        city:
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          "",
        houseNumber: data.address?.house_number || "",
        state: data.address?.state || "",
        zipCode: data.address?.postcode || "",
        country: data.address?.country || "Brasil",
      };

      return {
        lat,
        lng,
        address,
      };
    } catch (error) {
      console.error("Erro no geocoding reverso:", error);
      return { lat, lng };
    } finally {
      setIsGeocodingAddress(false);
    }
  };

  const loadLeaflet = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Window is not defined"));
        return;
      }

      if (window.L && leafletLoaded) {
        resolve();
        return;
      }

      const cssLink = document.createElement("link");
      cssLink.rel = "stylesheet";
      cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      cssLink.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      cssLink.crossOrigin = "";
      document.head.appendChild(cssLink);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";

      script.onload = () => {
        setLeafletLoaded(true);
        resolve();
      };

      script.onerror = () => {
        reject(new Error("Failed to load Leaflet"));
      };

      document.head.appendChild(script);
    });
  };

  async function loadMap(): Promise<void> {
    try {
      await loadLeaflet();
      const L = window.L;

      if (!L) {
        throw new Error("Leaflet not loaded");
      }

      if (mapRef.current) {
        const defaultLat = initialValueLat || -23.5505;
        const defaultLng = initialValueLng || -46.6333;

        const mapInstance = L.map(mapRef.current).setView(
          [defaultLat, defaultLng],
          13
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(mapInstance);

        let markerInstance: any = null;
        if (initialValueLat && initialValueLng) {
          markerInstance = L.marker([initialValueLat, initialValueLng]).addTo(
            mapInstance
          );
        }

        mapInstance.on("click", async (e: any) => {
          const { lat, lng } = e.latlng;

          if (markerInstance) {
            mapInstance.removeLayer(markerInstance);
          }

          markerInstance = L.marker([lat, lng]).addTo(mapInstance);
          setMarker(markerInstance);

          const locationData = await reverseGeocode(lat, lng);

          setSelectedLocation(locationData);
          onLocationChange(locationData);
        });

        setMap(mapInstance);
        setMarker(markerInstance);
      }
    } catch (error) {
      console.error("Erro ao carregar o mapa:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  async function getCurrentLocation(): Promise<void> {
    setIsGettingLocation(true);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          if (map && window.L) {
            map.setView([latitude, longitude], 15);

            if (marker) {
              map.removeLayer(marker);
            }

            const newMarker = window.L.marker([latitude, longitude]).addTo(map);
            setMarker(newMarker);
          }

          const locationData = await reverseGeocode(latitude, longitude);

          setSelectedLocation(locationData);
          onLocationChange(locationData);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
          setIsGettingLocation(false);
        }
      );
    } else {
      console.error("Geolocalização não suportada");
      setIsGettingLocation(false);
    }
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">
              {selectedLocation
                ? `Lat: ${selectedLocation.lat.toFixed(6)}, Lng: ${selectedLocation.lng.toFixed(6)}`
                : "Nenhuma localização selecionada"}
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            disabled={isGettingLocation || !leafletLoaded}
            className="flex items-center gap-2 bg-transparent"
          >
            {isGettingLocation ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            Minha Localização
          </Button>
        </div>

        {isGeocodingAddress && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
            <Search className="w-4 h-4 animate-pulse" />
            <span>Buscando endereço...</span>
          </div>
        )}

        {selectedLocation?.address && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <p className="text-sm font-medium text-green-800 mb-1">
              Endereço encontrado:
            </p>
            <div className="text-xs text-green-700 space-y-1">
              {selectedLocation.address.street && (
                <p>
                  <strong>Rua:</strong> {selectedLocation.address.street}
                </p>
              )}
              {selectedLocation.address.city && (
                <p>
                  <strong>Cidade:</strong> {selectedLocation.address.city}
                </p>
              )}
              {selectedLocation.address.zipCode && (
                <p>
                  <strong>CEP:</strong> {selectedLocation.address.zipCode}
                </p>
              )}
              {selectedLocation.address.country && (
                <p>
                  <strong>País:</strong> {selectedLocation.address.country}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg z-10">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Carregando mapa...</span>
              </div>
            </div>
          )}
          <div
            ref={mapRef}
            className="w-full h-64 rounded-lg border"
            style={{ minHeight: "256px" }}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          💡 Dica: Clique em qualquer ponto do mapa para definir sua localização
          e buscar o endereço automaticamente.
        </p>
      </div>
    </Card>
  );
}
