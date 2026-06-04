import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

import type { GeoPoint, Hazard, RouteResult, Shelter } from '../../domain/entities';
import { RiskType } from '../../domain/enums';
import styles from '../styles.module.css';

interface LeafletMapProps {
  center: GeoPoint;
  zoom?: number;
  hazards?: readonly Hazard[];
  shelters?: readonly Shelter[];
  origin?: GeoPoint | null;
  route?: RouteResult | null;
  /** When set, clicking the map reports the clicked point (citizen flow). */
  onMapClick?: (point: GeoPoint) => void;
}

const RISK_COLOR: Record<RiskType, string> = {
  [RiskType.Flood]: '#1E88E5',
  [RiskType.Fire]: '#FFB300',
  [RiskType.Landslide]: '#8D6E63',
};

const DEFAULT_ZOOM = 12;
const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION = '© OpenStreetMap contributors';

/**
 * Imperative Leaflet wrapper. Leaflet owns the DOM inside its container,
 * so the map instance and its layer groups live in refs and are mutated
 * inside effects — the React tree only declares the container.
 */
export function LeafletMap({
  center,
  zoom = DEFAULT_ZOOM,
  hazards = [],
  shelters = [],
  origin = null,
  route = null,
  onMapClick,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<Record<string, L.LayerGroup>>({});
  const onMapClickRef = useRef(onMapClick);
  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  // Init once: create the map, tile layer, and empty layer groups.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: true }).setView(
      [center.lat, center.lng],
      zoom,
    );
    L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION, maxZoom: 19 }).addTo(map);

    layersRef.current = {
      hazards: L.layerGroup().addTo(map),
      shelters: L.layerGroup().addTo(map),
      route: L.layerGroup().addTo(map),
      origin: L.layerGroup().addTo(map),
    };

    map.on('click', (e: L.LeafletMouseEvent) => {
      onMapClickRef.current?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapRef.current = map;
    // Leaflet sometimes mis-measures the container before layout settles.
    setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // Center/zoom are handled by a dedicated effect; init must run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recenter when the region changes.
  useEffect(() => {
    mapRef.current?.setView([center.lat, center.lng], zoom);
  }, [center.lat, center.lng, zoom]);

  // Hazard polygons.
  useEffect(() => {
    const group = layersRef.current.hazards;
    if (!group) return;
    group.clearLayers();
    for (const hazard of hazards) {
      const color = RISK_COLOR[hazard.type];
      L.polygon(
        hazard.polygon.map((p) => [p.lat, p.lng] as [number, number]),
        { color, weight: 1, fillColor: color, fillOpacity: 0.25 },
      )
        .bindTooltip(hazard.title, { sticky: true })
        .addTo(group);
    }
  }, [hazards]);

  // Shelter markers.
  useEffect(() => {
    const group = layersRef.current.shelters;
    if (!group) return;
    group.clearLayers();
    for (const shelter of shelters) {
      L.marker([shelter.position.lat, shelter.position.lng], { icon: shelterIcon() })
        .bindTooltip(`${shelter.name}`, { direction: 'top' })
        .addTo(group);
    }
  }, [shelters]);

  // Citizen origin marker.
  useEffect(() => {
    const group = layersRef.current.origin;
    if (!group) return;
    group.clearLayers();
    if (origin) {
      L.marker([origin.lat, origin.lng], { icon: originIcon() })
        .bindTooltip('Você está aqui', { direction: 'top' })
        .addTo(group);
    }
  }, [origin]);

  // Route polyline + fit to its bounds.
  useEffect(() => {
    const group = layersRef.current.route;
    const map = mapRef.current;
    if (!group || !map) return;
    group.clearLayers();
    if (route && route.geometry.length > 0) {
      const line = L.polyline(
        route.geometry.map((p) => [p.lat, p.lng] as [number, number]),
        { color: '#00E5FF', weight: 5, opacity: 0.9 },
      ).addTo(group);
      map.fitBounds(line.getBounds(), { padding: [40, 40] });
    }
  }, [route]);

  return <div ref={containerRef} className={styles.map} role="application" aria-label="Mapa" />;
}

function shelterIcon(): L.DivIcon {
  return L.divIcon({
    className: '',
    html:
      '<span style="display:block;width:16px;height:16px;border-radius:50%;' +
      'background:#00E5FF;border:2px solid #070D1A;box-shadow:0 0 8px rgba(0,229,255,.7)"></span>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function originIcon(): L.DivIcon {
  return L.divIcon({
    className: '',
    html:
      '<span style="display:block;width:18px;height:18px;border-radius:50%;' +
      'background:#FFB300;border:2px solid #070D1A;box-shadow:0 0 0 6px rgba(255,179,0,.25)"></span>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}
