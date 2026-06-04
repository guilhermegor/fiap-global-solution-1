/*
 * Sentinela — vanilla SPA (FIAP Global Solution 2026/1 deliverable).
 *
 * Pure HTML + CSS + JS. No framework, no build. Runs from file://.
 * Mirrors the React app: real data from Nominatim (geocoding), NASA EONET
 * (hazards), OSM Overpass (shelters) and OpenRouteService (safe route that
 * avoids hazards), with a labelled demo hazard so the route always bends.
 *
 * Index
 *   1.  Config + vocabulary
 *   2.  Utilities (escape, fetch, geo-math, document validation, format)
 *   3.  App state
 *   4.  External adapters (real APIs via fetch)
 *   5.  localStorage request repository
 *   6.  Toast notifications
 *   7.  Leaflet map view (imperative)
 *   8.  Actions (search, select region, toggles, rescue, status)
 *   9.  Views (one render function per screen)
 *   10. Router + bootstrap
 */

(function () {
  'use strict';

  /* ======================================================================
     1. CONFIG + VOCABULARY
     ====================================================================== */

  var ENDPOINTS = {
    nominatim: 'https://nominatim.openstreetmap.org/search',
    eonet: 'https://eonet.gsfc.nasa.gov/api/v3/events',
    overpassMirrors: [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.kumi.systems/api/interpreter',
      'https://overpass.openstreetmap.fr/api/interpreter',
    ],
    orsDirections: 'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
  };

  var SETTINGS = {
    requestTimeoutMs: 12000,
    shelterSearchRadiusM: 6000,
    maxShelters: 8,
    hazardBufferKm: 1.2,
    globalEventLimit: 40,
    demoOffsetDeg: 0.022,
    demoRadiusKm: 1.2,
    maxRouteCandidates: 4,
    maxAvoidHazards: 6,
  };

  var RISK = {
    flood: { label: 'Enchente', emoji: '🌊', color: '#1E88E5' },
    fire: { label: 'Fogo / Queimada', emoji: '🔥', color: '#FFB300' },
    landslide: { label: 'Deslizamento', emoji: '⛰️', color: '#8D6E63' },
  };

  var SITUATION = {
    trapped: 'Ilhado / preso',
    medical: 'Emergência médica',
    evacuate: 'Preciso evacuar',
    stranded: 'Sem transporte',
  };

  var STATUS = { pending: 'Pendente', en_route: 'Em rota', resolved: 'Concluído' };
  var STATUS_FLOW = ['pending', 'en_route', 'resolved'];

  var DEFAULT_CENTER = { lat: -14.235, lng: -51.925 };
  var DEFAULT_ZOOM = 4;
  var REGION_ZOOM = 13;
  var ROUTE_COLOR = '#00E5FF';

  function orsKey() {
    return (window.__SENTINELA_ORS_KEY__ || '').trim();
  }

  /* ======================================================================
     2. UTILITIES
     ====================================================================== */

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function fetchJson(url, options) {
    var controller = new AbortController();
    var timer = setTimeout(function () {
      controller.abort();
    }, SETTINGS.requestTimeoutMs);
    var opts = Object.assign({}, options || {}, { signal: controller.signal });
    return fetch(url, opts)
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status + ' em ' + url);
        return response.json();
      })
      .finally(function () {
        clearTimeout(timer);
      });
  }

  var EARTH_RADIUS_M = 6371000;
  var KM_PER_DEGREE_LAT = 111.32;

  function toRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function haversineMeters(a, b) {
    var dLat = toRad(b.lat - a.lat);
    var dLng = toRad(b.lng - a.lng);
    var lat1 = toRad(a.lat);
    var lat2 = toRad(b.lat);
    var h =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
  }

  function circlePolygon(center, radiusKm, segments) {
    segments = segments || 16;
    var dLat = radiusKm / KM_PER_DEGREE_LAT;
    var dLng = radiusKm / (KM_PER_DEGREE_LAT * Math.cos(toRad(center.lat)) || 1);
    var ring = [];
    for (var i = 0; i < segments; i += 1) {
      var theta = (i / segments) * 2 * Math.PI;
      ring.push({ lat: center.lat + dLat * Math.sin(theta), lng: center.lng + dLng * Math.cos(theta) });
    }
    ring.push({ lat: ring[0].lat, lng: ring[0].lng });
    return ring;
  }

  function centroid(points) {
    var sum = points.reduce(
      function (acc, p) {
        return { lat: acc.lat + p.lat, lng: acc.lng + p.lng };
      },
      { lat: 0, lng: 0 },
    );
    return { lat: sum.lat / points.length, lng: sum.lng / points.length };
  }

  function pointInPolygon(point, polygon) {
    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
      var a = polygon[i];
      var b = polygon[j];
      var intersects =
        a.lat > point.lat !== b.lat > point.lat &&
        point.lng < ((b.lng - a.lng) * (point.lat - a.lat)) / (b.lat - a.lat) + a.lng;
      if (intersects) inside = !inside;
    }
    return inside;
  }

  function sanitizeDocument(raw) {
    return String(raw || '').replace(/\D/g, '');
  }

  /** CPF mod-11 when 11 digits; RG sanity by length otherwise. */
  function validateDocument(raw) {
    var digits = sanitizeDocument(raw);
    if (digits.length === 11) {
      return isValidCpf(digits)
        ? { ok: true, digits: digits }
        : { ok: false, reason: 'CPF inválido — verifique os dígitos.' };
    }
    if (digits.length >= 7 && digits.length <= 9) {
      return { ok: true, digits: digits };
    }
    return { ok: false, reason: 'Documento inválido — informe um CPF (11 dígitos) ou RG.' };
  }

  function isValidCpf(digits) {
    if (/^(\d)\1{10}$/.test(digits)) return false;
    function checkDigit(sliceLength) {
      var sum = 0;
      for (var i = 0; i < sliceLength; i += 1) {
        sum += Number(digits[i]) * (sliceLength + 1 - i);
      }
      var remainder = (sum * 10) % 11;
      return remainder === 10 ? 0 : remainder;
    }
    return checkDigit(9) === Number(digits[9]) && checkDigit(10) === Number(digits[10]);
  }

  function formatDocument(digits) {
    if (digits.length === 11) return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    if (digits.length === 9) return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    return digits;
  }

  function formatKm(meters) {
    return (meters / 1000).toFixed(1) + ' km';
  }
  function formatMin(seconds) {
    return Math.round(seconds / 60) + ' min';
  }
  function minutesAgo(date) {
    var mins = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));
    if (mins < 1) return 'agora';
    if (mins < 60) return 'há ' + mins + ' min';
    var hours = Math.round(mins / 60);
    return 'há ' + hours + ' h';
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'id-' + Date.now() + '-' + Math.random().toString(16).slice(2);
  }

  /* ======================================================================
     3. APP STATE
     ====================================================================== */

  var state = {
    regionResults: [],
    searching: false,
    region: null,
    hazards: [],
    shelters: [],
    activeTypes: { flood: true, fire: true, landslide: true },
    demoMode: true,
    loadingRegionData: false,
    requests: [],
    selectedRequestId: null,
    citizenOrigin: null,
    citizenRoute: null,
    globalEvents: [],
    loadingGlobal: false,
    offline: false,
  };

  /** Hazards visible given active layers + demo scenario. */
  function visibleHazards() {
    var list = state.hazards.slice();
    if (state.demoMode && state.region) list.push(buildDemoHazard(state.region));
    return list.filter(function (h) {
      return state.activeTypes[h.type];
    });
  }

  function buildDemoHazard(region) {
    var center = { lat: region.center.lat, lng: region.center.lng + SETTINGS.demoOffsetDeg };
    return {
      id: 'demo-hazard',
      type: 'flood',
      severity: 'high',
      title: 'Enchente (cenário de simulação)',
      date: new Date(),
      source: 'Sentinela · simulação',
      center: center,
      polygon: circlePolygon(center, SETTINGS.demoRadiusKm),
    };
  }

  /* ======================================================================
     4. EXTERNAL ADAPTERS (real APIs)
     ====================================================================== */

  function geocodeSearch(query) {
    var url =
      ENDPOINTS.nominatim +
      '?q=' +
      encodeURIComponent(query) +
      '&format=jsonv2&limit=5&accept-language=pt-BR';
    return fetchJson(url, { headers: { Accept: 'application/json' } }).then(function (items) {
      return items.map(function (item) {
        var bb = item.boundingbox.map(Number);
        return {
          name: (item.name || item.display_name.split(',')[0]).trim(),
          displayName: item.display_name,
          center: { lat: Number(item.lat), lng: Number(item.lon) },
          boundingBox: [bb[0], bb[1], bb[2], bb[3]],
        };
      });
    });
  }

  function categoryToRiskType(id) {
    if (id === 'wildfires' || id === 'volcanoes') return 'fire';
    if (id === 'landslides') return 'landslide';
    return 'flood';
  }

  function eonetToHazards(events) {
    var out = [];
    events.forEach(function (event) {
      var geometry = event.geometry[event.geometry.length - 1];
      if (!geometry) return;
      var categoryId = (event.categories[0] && event.categories[0].id) || '';
      var polygon = [];
      if (geometry.type === 'Point') {
        var lng = geometry.coordinates[0];
        var lat = geometry.coordinates[1];
        if (typeof lng !== 'number' || typeof lat !== 'number') return;
        polygon = circlePolygon({ lat: lat, lng: lng }, SETTINGS.hazardBufferKm);
      } else {
        var ring = geometry.coordinates[0] || [];
        polygon = ring.map(function (pair) {
          return { lat: pair[1], lng: pair[0] };
        });
      }
      if (polygon.length === 0) return;
      var title = event.categories[0] ? event.title + ' · ' + event.categories[0].title : event.title;
      out.push({
        id: event.id,
        type: categoryToRiskType(categoryId),
        severity: categoryId === 'wildfires' || categoryId === 'volcanoes' ? 'critical' : 'high',
        title: title,
        date: new Date(geometry.date),
        source: 'NASA EONET',
        center: centroid(polygon),
        polygon: polygon,
      });
    });
    return out;
  }

  function hazardsNear(region) {
    var bb = region.boundingBox; // [south, north, west, east]
    var url =
      ENDPOINTS.eonet + '?status=open&bbox=' + bb[2] + ',' + bb[1] + ',' + bb[3] + ',' + bb[0];
    return fetchJson(url).then(function (data) {
      return eonetToHazards(data.events || []);
    });
  }

  function hazardsGlobal() {
    var url = ENDPOINTS.eonet + '?status=open&limit=' + SETTINGS.globalEventLimit;
    return fetchJson(url).then(function (data) {
      return eonetToHazards(data.events || []);
    });
  }

  function sheltersNear(region) {
    var lat = region.center.lat;
    var lng = region.center.lng;
    var r = SETTINGS.shelterSearchRadiusM;
    var query =
      '[out:json][timeout:25];(' +
      'node["amenity"="hospital"](around:' + r + ',' + lat + ',' + lng + ');' +
      'node["amenity"="school"](around:' + r + ',' + lat + ',' + lng + ');' +
      'node["amenity"="community_centre"](around:' + r + ',' + lat + ',' + lng + ');' +
      'node["emergency"="assembly_point"](around:' + r + ',' + lat + ',' + lng + ');' +
      ');out body ' + SETTINGS.maxShelters * 4 + ';';

    var mirrors = ENDPOINTS.overpassMirrors.slice();
    function attempt(index) {
      if (index >= mirrors.length) return Promise.reject(new Error('Overpass indisponível.'));
      return fetchJson(mirrors[index], {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'data=' + encodeURIComponent(query),
      }).catch(function () {
        return attempt(index + 1);
      });
    }
    return attempt(0).then(function (data) {
      var kindOf = function (tags) {
        if (tags.amenity === 'hospital') return 'hospital';
        if (tags.amenity === 'school') return 'school';
        if (tags.amenity === 'community_centre') return 'community';
        return 'shelter';
      };
      return (data.elements || [])
        .filter(function (el) {
          return el.tags && el.tags.name && el.lat != null && el.lon != null;
        })
        .map(function (el) {
          return {
            id: 'osm-' + el.id,
            name: el.tags.name.trim(),
            kind: kindOf(el.tags),
            position: { lat: el.lat, lng: el.lon },
          };
        })
        .slice(0, SETTINGS.maxShelters);
    });
  }

  function nearestShelters(origin, shelters, n) {
    return shelters
      .slice()
      .sort(function (a, b) {
        return haversineMeters(origin, a.position) - haversineMeters(origin, b.position);
      })
      .slice(0, n);
  }

  function buildAvoidPolygons(origin, hazards) {
    var nearest = hazards
      .filter(function (h) {
        return !pointInPolygon(origin, h.polygon);
      })
      .sort(function (a, b) {
        return haversineMeters(origin, a.center) - haversineMeters(origin, b.center);
      })
      .slice(0, SETTINGS.maxAvoidHazards);
    var coordinates = nearest.map(function (h) {
      return [
        h.polygon.map(function (p) {
          return [p.lng, p.lat];
        }),
      ];
    });
    return { coordinates: coordinates, count: nearest.length };
  }

  function orsRouteTo(origin, shelter, avoid, key) {
    var body = {
      coordinates: [
        [origin.lng, origin.lat],
        [shelter.position.lng, shelter.position.lat],
      ],
    };
    if (avoid.count > 0) {
      body.options = { avoid_polygons: { type: 'MultiPolygon', coordinates: avoid.coordinates } };
    }
    return fetchJson(ENDPOINTS.orsDirections, {
      method: 'POST',
      headers: { Authorization: key, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(function (data) {
      var feature = data.features && data.features[0];
      if (!feature) return null;
      var summary = feature.properties.summary || {};
      return {
        geometry: feature.geometry.coordinates.map(function (pair) {
          return { lat: pair[1], lng: pair[0] };
        }),
        distanceMeters: summary.distance || 0,
        durationSeconds: summary.duration || 0,
        shelterId: shelter.id,
        shelterName: shelter.name,
        avoidedHazards: avoid.count,
      };
    });
  }

  function safeRoute(origin, shelters, hazards) {
    var key = orsKey();
    if (!key) return Promise.reject(new Error('Chave do OpenRouteService ausente (ver env.js).'));
    var avoid = buildAvoidPolygons(origin, hazards);
    var candidates = nearestShelters(origin, shelters, SETTINGS.maxRouteCandidates);

    function tryList(list, avoidArg, index) {
      if (index >= list.length) return Promise.resolve(null);
      return orsRouteTo(origin, list[index], avoidArg, key)
        .catch(function () {
          return null;
        })
        .then(function (route) {
          if (route) return route;
          return tryList(list, avoidArg, index + 1);
        });
    }

    return tryList(candidates, avoid, 0).then(function (route) {
      if (route) return route;
      if (avoid.count > 0) return tryList(candidates, { coordinates: [], count: 0 }, 0);
      return null;
    });
  }

  /* ======================================================================
     5. LOCALSTORAGE REQUEST REPOSITORY
     ====================================================================== */

  var STORAGE_KEY = 'sentinela.requests';

  function repoList() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw).map(function (r) {
        r.createdAt = new Date(r.createdAt);
        return r;
      });
    } catch (err) {
      console.warn('[sentinela] localStorage corrompido — recomeçando vazio.', err);
      return [];
    }
  }

  function repoWrite(requests) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch (err) {
      console.warn('[sentinela] não foi possível persistir os chamados.', err);
    }
  }

  function repoAdd(request) {
    var all = repoList();
    all.unshift(request);
    repoWrite(all);
    return request;
  }

  function repoUpdateStatus(id, status) {
    var all = repoList();
    var found = all.find(function (r) {
      return r.id === id;
    });
    if (!found) throw new Error('Chamado não encontrado: ' + id);
    found.status = status;
    repoWrite(all);
    return found;
  }

  /* ======================================================================
     6. TOASTS
     ====================================================================== */

  function ensureToastHost() {
    var host = byId('toast-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'toast-host';
      host.className = 'toastHost';
      document.body.appendChild(host);
    }
    return host;
  }

  function toast(kind, message) {
    var host = ensureToastHost();
    var el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('data-kind', kind);
    el.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    el.textContent = message;
    host.appendChild(el);
    setTimeout(function () {
      el.style.opacity = '0';
      el.style.transition = 'opacity 300ms';
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 300);
    }, 4200);
  }

  var notifier = {
    success: function (m) {
      toast('success', m);
    },
    error: function (m) {
      toast('error', m);
    },
    warning: function (m) {
      toast('warning', m);
    },
    info: function (m) {
      toast('info', m);
    },
  };

  /* ======================================================================
     7. LEAFLET MAP VIEW (imperative)
     ====================================================================== */

  var MapView = {
    map: null,
    layers: null,
    clickHandler: null,

    create: function (containerId, center, zoom, onClick) {
      var container = byId(containerId);
      if (!container) return;
      this.destroy();
      var map = L.map(container, { zoomControl: true }).setView([center.lat, center.lng], zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);
      this.layers = {
        hazards: L.layerGroup().addTo(map),
        shelters: L.layerGroup().addTo(map),
        route: L.layerGroup().addTo(map),
        origin: L.layerGroup().addTo(map),
      };
      this.clickHandler = onClick || null;
      var self = this;
      map.on('click', function (e) {
        if (self.clickHandler) self.clickHandler({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
      this.map = map;
      setTimeout(function () {
        map.invalidateSize();
      }, 0);
    },

    setView: function (center, zoom) {
      if (this.map) this.map.setView([center.lat, center.lng], zoom);
    },

    renderHazards: function (hazards) {
      if (!this.layers) return;
      this.layers.hazards.clearLayers();
      var group = this.layers.hazards;
      hazards.forEach(function (h) {
        var color = (RISK[h.type] || {}).color || '#888';
        L.polygon(
          h.polygon.map(function (p) {
            return [p.lat, p.lng];
          }),
          { color: color, weight: 1, fillColor: color, fillOpacity: 0.25 },
        )
          .bindTooltip(h.title, { sticky: true })
          .addTo(group);
      });
    },

    renderShelters: function (shelters) {
      if (!this.layers) return;
      this.layers.shelters.clearLayers();
      var group = this.layers.shelters;
      shelters.forEach(function (s) {
        L.marker([s.position.lat, s.position.lng], { icon: dotIcon('#00E5FF', 16, 'rgba(0,229,255,.7)') })
          .bindTooltip(s.name, { direction: 'top' })
          .addTo(group);
      });
    },

    renderOrigin: function (origin) {
      if (!this.layers) return;
      this.layers.origin.clearLayers();
      if (origin) {
        L.marker([origin.lat, origin.lng], { icon: dotIcon('#FFB300', 18, 'rgba(255,179,0,.25)') })
          .bindTooltip('Você está aqui', { direction: 'top' })
          .addTo(this.layers.origin);
      }
    },

    renderRoute: function (route) {
      if (!this.layers || !this.map) return;
      this.layers.route.clearLayers();
      if (route && route.geometry.length > 0) {
        var line = L.polyline(
          route.geometry.map(function (p) {
            return [p.lat, p.lng];
          }),
          { color: ROUTE_COLOR, weight: 5, opacity: 0.9 },
        ).addTo(this.layers.route);
        this.map.fitBounds(line.getBounds(), { padding: [40, 40] });
      }
    },

    destroy: function () {
      if (this.map) {
        this.map.remove();
        this.map = null;
        this.layers = null;
        this.clickHandler = null;
      }
    },
  };

  function dotIcon(color, size, ringColor) {
    var ring = ringColor ? 'box-shadow:0 0 0 6px ' + ringColor : '';
    return L.divIcon({
      className: '',
      html:
        '<span style="display:block;width:' + size + 'px;height:' + size + 'px;border-radius:50%;' +
        'background:' + color + ';border:2px solid #070D1A;' + ring + '"></span>',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

  /* ======================================================================
     8. ACTIONS
     ====================================================================== */

  function searchRegion(query) {
    var trimmed = (query || '').trim();
    if (trimmed.length < 3) {
      notifier.warning('Digite ao menos 3 letras para buscar uma região.');
      return;
    }
    state.searching = true;
    renderRegionResults();
    geocodeSearch(trimmed)
      .then(function (results) {
        state.regionResults = results;
        if (results.length === 0) notifier.info('Nenhuma região encontrada.');
      })
      .catch(function () {
        notifier.error('Falha na busca de região. Verifique sua conexão.');
      })
      .finally(function () {
        state.searching = false;
        renderRegionResults();
      });
  }

  function selectRegion(region) {
    state.region = region;
    state.regionResults = [];
    state.loadingRegionData = true;
    renderRegionResults();
    updateMapOverlay();
    MapView.setView(region.center, REGION_ZOOM);

    Promise.all([
      hazardsNear(region).catch(function () {
        return [];
      }),
      sheltersNear(region).catch(function () {
        state.offline = true;
        return [];
      }),
    ])
      .then(function (results) {
        state.hazards = results[0];
        state.shelters = results[1];
        state.offline = false;
        notifier.info(
          region.name + ': ' + results[0].length + ' evento(s) e ' + results[1].length + ' abrigo(s).',
        );
      })
      .catch(function () {
        state.offline = true;
        notifier.error('Falha ao carregar dados da região.');
      })
      .finally(function () {
        state.loadingRegionData = false;
        refreshMapLayers();
        updateMapOverlay();
        updateTicker();
        updateStatusPill();
      });
  }

  function toggleLayer(type) {
    state.activeTypes[type] = !state.activeTypes[type];
    refreshMapLayers();
    var chip = document.querySelector('[data-layer="' + type + '"]');
    if (chip) chip.setAttribute('data-active', String(state.activeTypes[type]));
    updateTicker();
  }

  function toggleDemo() {
    state.demoMode = !state.demoMode;
    refreshMapLayers();
    var chip = byId('demo-toggle');
    if (chip) {
      chip.setAttribute('data-active', String(state.demoMode));
      chip.setAttribute('aria-checked', String(state.demoMode));
    }
    updateTicker();
  }

  function requestRescue(form) {
    if (state.shelters.length === 0) {
      notifier.error('Nenhum abrigo carregado. Busque uma região primeiro.');
      return;
    }
    var request = {
      id: uuid(),
      citizenName: form.citizenName,
      document: form.document || null,
      situation: form.situation,
      origin: form.origin,
      status: 'pending',
      shelterId: null,
      shelterName: null,
      route: null,
      createdAt: new Date(),
    };
    var submitBtn = byId('rescue-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Calculando rota segura…';
    }

    safeRoute(form.origin, state.shelters, visibleHazards())
      .then(function (route) {
        if (!route) {
          notifier.warning('Sem rota terrestre segura — chamado registrado para resgate aéreo.');
        } else {
          request.shelterId = route.shelterId;
          request.shelterName = route.shelterName;
          request.route = route;
        }
        repoAdd(request);
        state.requests.unshift(request);
        state.citizenRoute = route || null;
        MapView.renderRoute(route);
        if (route) notifier.success('Resgate solicitado — rota segura traçada.');
      })
      .catch(function () {
        notifier.error('Falha ao calcular a rota. Verifique a chave do roteamento (env.js).');
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Pedir resgate';
        }
      });
  }

  function advanceStatus(id) {
    var current = state.requests.find(function (r) {
      return r.id === id;
    });
    if (!current || current.status === 'resolved') return;
    var next = current.status === 'pending' ? 'en_route' : 'resolved';
    try {
      repoUpdateStatus(id, next);
      current.status = next;
      if (next === 'en_route') notifier.info('Equipe despachada pela rota segura.');
      if (next === 'resolved') notifier.success('Cidadão em segurança no abrigo.');
      renderRoute(currentRoute());
    } catch (err) {
      notifier.error('Falha ao atualizar o status do chamado.');
    }
  }

  function loadGlobalAlerts() {
    state.loadingGlobal = true;
    renderRoute('#/alertas');
    hazardsGlobal()
      .then(function (events) {
        state.globalEvents = events;
        state.offline = false;
      })
      .catch(function () {
        state.offline = true;
        notifier.error('Falha ao carregar alertas globais da NASA EONET.');
      })
      .finally(function () {
        state.loadingGlobal = false;
        renderRoute('#/alertas');
      });
  }

  function focusEventOnMap(eventId) {
    var hazard = state.globalEvents.find(function (e) {
      return e.id === eventId;
    });
    if (!hazard) return;
    var span = 0.15;
    state.region = {
      name: hazard.title.split('·')[0].trim().slice(0, 48),
      displayName: hazard.title,
      center: hazard.center,
      boundingBox: [
        hazard.center.lat - span,
        hazard.center.lat + span,
        hazard.center.lng - span,
        hazard.center.lng + span,
      ],
    };
    window.location.hash = '#/central';
    // selectRegion runs after the central view mounts (see mountCentral).
    state.pendingRegionLoad = true;
  }

  /* ======================================================================
     9. VIEWS
     ====================================================================== */

  function layout(inner) {
    return (
      navBar() +
      inner +
      '<footer class="footer">' +
      '<span>Sentinela · Vigilância Orbital · Rotas Seguras</span>' +
      '<span>Dados: NASA EONET · OpenStreetMap · OpenRouteService · ODS 11 &amp; 13</span>' +
      '</footer>'
    );
  }

  var NAV_LINKS = [
    { hash: '#/', label: 'Início' },
    { hash: '#/alertas', label: 'Alertas globais' },
    { hash: '#/central', label: 'Central' },
    { hash: '#/cidadao', label: 'Pedir resgate' },
    { hash: '#/chamados', label: 'Chamados' },
    { hash: '#/sobre', label: 'Sobre' },
  ];

  function navBar() {
    var current = currentRoute();
    var links = NAV_LINKS.map(function (link) {
      var active = link.hash === current ? ' linkActive' : '';
      return '<a class="link' + active + '" href="' + link.hash + '">' + escapeHtml(link.label) + '</a>';
    }).join('');
    var pillOnline = !state.offline;
    return (
      '<header class="nav">' +
      '<a class="brand" href="#/"><span aria-hidden="true">🛰️</span><span class="brandName">SENTINELA</span></a>' +
      '<nav class="links" aria-label="Navegação principal">' + links + '</nav>' +
      '<span class="statusPill" data-online="' + pillOnline + '">' + (pillOnline ? 'AO VIVO' : 'OFFLINE') + '</span>' +
      '</header>'
    );
  }

  function odsBadges() {
    return (
      '<ul class="odsList" aria-label="Objetivos de Desenvolvimento Sustentável">' +
      '<li class="odsBadge" style="background-color:#FD9D24"><span class="odsNumber">ODS 11</span><span class="odsLabel">Cidades e comunidades sustentáveis</span></li>' +
      '<li class="odsBadge" style="background-color:#3F7E44"><span class="odsNumber">ODS 13</span><span class="odsLabel">Ação contra a mudança global do clima</span></li>' +
      '</ul>'
    );
  }

  function homeView() {
    var steps = [
      ['🛰️', 'O satélite enxerga o risco', 'Dados de observação da Terra (NASA EONET) detectam enchentes, queimadas e tempestades em tempo real.'],
      ['🆘', 'O cidadão pede resgate', 'Quem está em perigo marca sua localização e informa a situação em segundos.'],
      ['🧭', 'A rota segura é traçada', 'O sistema calcula um caminho real que contorna as zonas de risco até o abrigo mais próximo.'],
    ];
    var cards = steps
      .map(function (s, i) {
        return (
          '<article class="stepCard"><span class="stepNumber">' + (i + 1) + '</span>' +
          '<span class="stepIcon" aria-hidden="true">' + s[0] + '</span>' +
          '<h3>' + escapeHtml(s[1]) + '</h3><p>' + escapeHtml(s[2]) + '</p></article>'
        );
      })
      .join('');
    return layout(
      '<main class="page">' +
      '<section class="hero">' +
      '<span class="heroKicker"><span aria-hidden="true">📡</span> Economia espacial a serviço da vida</span>' +
      '<h1 class="heroTitle">Do espaço ao chão:<br>rotas seguras quando o desastre chega.</h1>' +
      '<p class="heroLead">A Sentinela transforma dados de satélite de observação da Terra em rotas de fuga reais — tirando pessoas do perigo e apoiando a defesa civil em enchentes, queimadas e deslizamentos.</p>' +
      '<div class="heroActions"><a class="primaryButton" href="#/central">Abrir central de monitoramento</a><a class="secondaryButton" href="#/cidadao">Pedir resgate</a></div>' +
      odsBadges() +
      '</section>' +
      '<section class="steps"><h2 class="sectionTitle">Como funciona</h2><div class="stepGrid">' + cards + '</div></section>' +
      '</main>',
    );
  }

  function regionSearchView() {
    return (
      '<div class="regionSearch">' +
      '<form class="regionForm" id="region-form" role="search">' +
      '<span aria-hidden="true">🔍</span>' +
      '<input class="regionInput" id="region-input" type="text" placeholder="Buscar cidade ou região (ex.: Porto Alegre)" aria-label="Buscar região" value="' +
      (state.region ? escapeHtml(state.region.name) : '') +
      '">' +
      '<button class="regionButton" type="submit">Buscar</button>' +
      '</form>' +
      '<div id="region-results"></div>' +
      '</div>'
    );
  }

  function regionResultsHtml() {
    if (state.searching) return '<ul class="regionResults"><li class="regionResult"><span>Buscando…</span></li></ul>';
    if (state.regionResults.length === 0) return '';
    var items = state.regionResults
      .map(function (r, i) {
        return (
          '<li><button type="button" class="regionResult" data-region-index="' + i + '">' +
          '<strong>' + escapeHtml(r.name) + '</strong><span>' + escapeHtml(r.displayName) + '</span></button></li>'
        );
      })
      .join('');
    return '<ul class="regionResults">' + items + '</ul>';
  }

  function layerTogglesHtml() {
    return (
      '<div class="layerToggles" role="group" aria-label="Camadas de risco">' +
      Object.keys(RISK)
        .map(function (type) {
          var active = state.activeTypes[type];
          return (
            '<button type="button" class="layerChip" data-layer="' + type + '" data-risk="' + type + '" data-active="' + active + '" role="switch" aria-checked="' + active + '">' +
            '<span aria-hidden="true">' + RISK[type].emoji + '</span> ' + escapeHtml(RISK[type].label) + '</button>'
          );
        })
        .join('') +
      '</div>'
    );
  }

  function demoToggleHtml() {
    return (
      '<button type="button" class="demoToggle" id="demo-toggle" role="switch" aria-checked="' + state.demoMode + '" data-active="' + state.demoMode + '">' +
      '<span aria-hidden="true">🧪</span> Cenário de simulação</button>'
    );
  }

  function legendHtml() {
    return (
      '<ul class="legend" aria-label="Legenda do mapa">' +
      Object.keys(RISK)
        .map(function (t) {
          return '<li class="legendItem"><span class="legendSwatch" style="background-color:' + RISK[t].color + '"></span>' + escapeHtml(RISK[t].label) + '</li>';
        })
        .join('') +
      '<li class="legendItem"><span class="legendSwatch" style="background-color:#00E5FF"></span>Rota segura</li>' +
      '<li class="legendItem"><span class="legendDot" style="background-color:#00E5FF"></span>Abrigo</li>' +
      '<li class="legendItem"><span class="legendDot" style="background-color:#FFB300"></span>Você</li>' +
      '</ul>'
    );
  }

  function tickerHtml() {
    var online = !state.offline;
    var freshness = state.hazards[0] ? minutesAgo(state.hazards[0].date) : '—';
    return (
      '<div class="ticker" id="ticker" data-online="' + online + '" role="status">' +
      '<span class="tickerStatus"><span class="tickerDot"></span>' + (online ? 'DADOS AO VIVO' : 'MODO OFFLINE') + '</span>' +
      '<span class="tickerSource" id="ticker-source">NASA EONET · OSM · atualização ' + freshness + '</span>' +
      '</div>'
    );
  }

  function mapWrapHtml(overlayText) {
    var overlay = overlayText ? '<div class="mapOverlay" id="map-overlay">' + escapeHtml(overlayText) + '</div>' : '<div class="mapOverlay" id="map-overlay" style="display:none"></div>';
    return '<div class="mapWrap"><div class="map" id="map"></div>' + overlay + '</div>';
  }

  function requestCardHtml(request, selected) {
    var advanceLabel = request.status === 'pending' ? 'Despachar equipe' : request.status === 'en_route' ? 'Marcar concluído' : '';
    var routeLine = request.route && request.shelterName
      ? '<p class="requestRoute"><span aria-hidden="true">🛡️</span> ' + escapeHtml(request.shelterName) + ' · ' + formatKm(request.route.distanceMeters) + ' · ' + formatMin(request.route.durationSeconds) + '</p>'
      : '<p class="requestRoute" data-warning="true"><span aria-hidden="true">📍</span> Sem rota terrestre — resgate aéreo</p>';
    var advanceBtn = advanceLabel
      ? '<button type="button" class="requestAdvance" data-advance="' + request.id + '">' + advanceLabel + ' →</button>'
      : '';
    return (
      '<article class="requestCard" data-selected="' + (selected ? 'true' : 'false') + '" data-status="' + request.status + '">' +
      '<button type="button" class="requestMain" data-select="' + request.id + '">' +
      '<header class="requestHead"><strong>' + escapeHtml(request.citizenName) + '</strong>' +
      '<span class="statusBadge" data-status="' + request.status + '">' + STATUS[request.status] + '</span></header>' +
      '<p class="requestSituation">' + escapeHtml(SITUATION[request.situation]) + '</p>' + routeLine +
      '</button>' + advanceBtn + '</article>'
    );
  }

  function centralView() {
    var requestsHtml = state.requests.length === 0
      ? '<p class="empty">Nenhum chamado ainda. Eles aparecem aqui em tempo real.</p>'
      : '<ul class="requestList" id="request-list">' +
        state.requests
          .map(function (r) {
            return '<li>' + requestCardHtml(r, r.id === state.selectedRequestId) + '</li>';
          })
          .join('') +
        '</ul>';
    return layout(
      '<main class="splitPage monitorPage">' +
      '<section class="monitorMain">' +
      regionSearchView() + tickerHtml() +
      mapWrapHtml(state.region ? '' : 'Busque uma região para começar a monitorar.') +
      '<div class="toggleRow">' + layerTogglesHtml() + demoToggleHtml() + '</div>' +
      legendHtml() +
      '</section>' +
      '<aside class="monitorSide"><h2 class="sideTitle">Chamados recebidos</h2><div id="requests-host">' + requestsHtml + '</div></aside>' +
      '</main>',
    );
  }

  function citizenView() {
    return layout(
      '<main class="splitPage citizenPage">' +
      '<section class="citizenForm">' +
      '<h1 class="pageTitle">Pedir resgate</h1>' +
      '<p class="pageSubtitle">Busque sua região, toque no mapa para marcar onde você está e peça ajuda. Traçamos a rota segura até o abrigo mais próximo.</p>' +
      regionSearchView() + demoToggleHtml() +
      '<form class="helpForm" id="help-form">' +
      '<label class="field"><span class="fieldLabel">Seu nome</span><input class="input" id="help-name" type="text" placeholder="Como te chamam?"></label>' +
      '<label class="field"><span class="fieldLabel">CPF ou RG (opcional)</span><input class="input" id="help-doc" type="text" inputmode="numeric" placeholder="Ajuda a localizar você nos cadastros"></label>' +
      '<label class="field"><span class="fieldLabel">Situação</span><select class="input" id="help-situation">' +
      Object.keys(SITUATION)
        .map(function (k) {
          return '<option value="' + k + '">' + escapeHtml(SITUATION[k]) + '</option>';
        })
        .join('') +
      '</select></label>' +
      '<p class="originHint" id="origin-hint" data-set="false">Toque no mapa para marcar sua localização.</p>' +
      '<p class="formError" id="help-error" style="display:none"></p>' +
      '<button type="submit" class="primaryButton" id="rescue-submit"><span aria-hidden="true">🆘</span> Pedir resgate</button>' +
      '</form>' +
      '</section>' +
      '<section class="citizenMap">' + mapWrapHtml(state.region ? '' : 'Busque uma região para liberar o mapa.') + '</section>' +
      '</main>',
    );
  }

  function alertsView() {
    var body;
    if (state.loadingGlobal && state.globalEvents.length === 0) {
      body = '<p class="loading"><span class="spin" aria-hidden="true">⟳</span> Carregando eventos da NASA EONET…</p>';
    } else if (state.globalEvents.length === 0) {
      body = '<p class="empty">Nenhum evento aberto retornado agora — verifique sua conexão e tente novamente.</p>';
    } else {
      body =
        '<div class="eventGrid">' +
        state.globalEvents
          .map(function (e) {
            var risk = RISK[e.type] || RISK.flood;
            return (
              '<article class="eventCard" data-risk="' + e.type + '">' +
              '<span class="eventEmoji" aria-hidden="true">' + risk.emoji + '</span>' +
              '<div class="eventBody"><h3 class="eventTitle">' + escapeHtml(e.title) + '</h3>' +
              '<p class="eventMeta">' + escapeHtml(risk.label) + ' · ' + escapeHtml(e.source) + ' · ' + minutesAgo(e.date) + '</p></div>' +
              '<button type="button" class="eventButton" data-focus="' + escapeHtml(e.id) + '"><span aria-hidden="true">📍</span> Ver no mapa</button>' +
              '</article>'
            );
          })
          .join('') +
        '</div>';
    }
    return layout(
      '<main class="page">' +
      '<header class="pageHead"><h1 class="pageTitle"><span aria-hidden="true">🌐</span> Alertas globais</h1>' +
      '<p class="pageSubtitle">Eventos naturais reais detectados agora pela NASA EONET. Escolha um para focar a central de monitoramento naquela região.</p></header>' +
      body +
      '</main>',
    );
  }

  function timelineHtml(status) {
    var currentIndex = STATUS_FLOW.indexOf(status);
    return (
      '<ol class="timeline" aria-label="Status do chamado">' +
      STATUS_FLOW.map(function (step, index) {
        var st = index < currentIndex ? 'done' : index === currentIndex ? 'active' : 'pending';
        return '<li class="timelineStep" data-state="' + st + '"><span class="timelineDot"></span><span>' + STATUS[step] + '</span></li>';
      }).join('') +
      '</ol>'
    );
  }

  function requestsView() {
    if (state.requests.length === 0) {
      return layout(
        '<main class="page"><header class="pageHead"><h1 class="pageTitle">Chamados &amp; status</h1>' +
        '<p class="pageSubtitle">Acompanhe cada pedido de resgate da abertura à conclusão.</p></header>' +
        '<p class="empty">Nenhum chamado ainda. Crie um em <strong>Pedir resgate</strong>.</p></main>',
      );
    }
    var selected = state.requests.find(function (r) {
      return r.id === state.selectedRequestId;
    }) || state.requests[0];
    var list =
      '<ul class="requestList">' +
      state.requests
        .map(function (r) {
          return '<li>' + requestCardHtml(r, r.id === selected.id) + '</li>';
        })
        .join('') +
      '</ul>';
    var detail =
      '<aside class="requestDetail"><h2 class="sideTitle">' + escapeHtml(selected.citizenName) + '</h2>' +
      '<p class="detailLine">' + escapeHtml(SITUATION[selected.situation]) + '</p>' +
      (selected.document ? '<p class="detailLine">Documento: ' + escapeHtml(formatDocument(selected.document)) + '</p>' : '') +
      (selected.shelterName ? '<p class="detailLine">Destino: ' + escapeHtml(selected.shelterName) + '</p>' : '') +
      (selected.route ? '<p class="detailLine">' + formatKm(selected.route.distanceMeters) + ' · ' + formatMin(selected.route.durationSeconds) + ' · ' + selected.route.avoidedHazards + ' zona(s) evitada(s)</p>' : '') +
      timelineHtml(selected.status) + '</aside>';
    return layout(
      '<main class="page"><header class="pageHead"><h1 class="pageTitle">Chamados &amp; status</h1>' +
      '<p class="pageSubtitle">Acompanhe cada pedido de resgate da abertura à conclusão.</p></header>' +
      '<div class="requestsLayout">' + list + detail + '</div></main>',
    );
  }

  function aboutView() {
    var sources = [
      ['NASA EONET', 'https://eonet.gsfc.nasa.gov', 'Eventos naturais reais (fogo, enchente, tempestade) com coordenadas.'],
      ['OpenStreetMap / Nominatim', 'https://nominatim.org', 'Geocodificação de regiões e mapa base.'],
      ['OSM Overpass', 'https://overpass-api.de', 'Hospitais, escolas e abrigos reais por região.'],
      ['OpenRouteService', 'https://openrouteservice.org', 'Rotas em ruas reais que contornam zonas de risco.'],
      ['ESA · Disaster Charter', 'https://disastercharter.org', 'Inspiração: dados de satélite para resposta a desastres.'],
    ];
    var sourceItems = sources
      .map(function (s) {
        return '<li class="sourceItem"><a class="sourceLink" href="' + s[1] + '" target="_blank" rel="noreferrer">' + escapeHtml(s[0]) + '</a><span>' + escapeHtml(s[2]) + '</span></li>';
      })
      .join('');
    return layout(
      '<main class="page">' +
      '<header class="pageHead"><h1 class="pageTitle">Sobre a Sentinela</h1>' +
      '<p class="pageSubtitle">A economia espacial gera dados de observação da Terra capazes de salvar vidas. A Sentinela conecta esses dados ao chão: detecta o risco por satélite e entrega uma rota segura a quem precisa.</p></header>' +
      '<section class="aboutSection"><h2 class="sectionTitle">Como funciona, por dentro</h2>' +
      '<p class="aboutText">Eventos naturais são lidos da NASA EONET e desenhados como zonas de risco no mapa. Abrigos reais vêm do OpenStreetMap. Quando alguém pede resgate, o OpenRouteService calcula um caminho em ruas reais que evita essas zonas, escolhendo o abrigo mais próximo alcançável.</p></section>' +
      '<section class="aboutSection"><h2 class="sectionTitle">Fontes de dados</h2><ul class="sourceList">' + sourceItems + '</ul></section>' +
      '<section class="aboutSection"><h2 class="sectionTitle">Compromisso com os ODS</h2>' + odsBadges() + '</section>' +
      '</main>',
    );
  }

  /* ======================================================================
     Targeted DOM updates (avoid full re-render to keep the map alive)
     ====================================================================== */

  function renderRegionResults() {
    var host = byId('region-results');
    if (host) host.innerHTML = regionResultsHtml();
  }

  function refreshMapLayers() {
    MapView.renderHazards(visibleHazards());
    MapView.renderShelters(state.shelters);
    MapView.renderOrigin(state.citizenOrigin);
  }

  function updateMapOverlay() {
    var overlay = byId('map-overlay');
    if (!overlay) return;
    if (state.loadingRegionData) {
      overlay.style.display = '';
      overlay.textContent = 'Carregando dados de satélite…';
    } else if (!state.region) {
      overlay.style.display = '';
      overlay.textContent = 'Busque uma região para começar a monitorar.';
    } else {
      overlay.style.display = 'none';
    }
  }

  function updateTicker() {
    var ticker = byId('ticker');
    if (!ticker) return;
    ticker.setAttribute('data-online', String(!state.offline));
    var source = byId('ticker-source');
    if (source) {
      var freshness = state.hazards[0] ? minutesAgo(state.hazards[0].date) : '—';
      source.textContent = 'NASA EONET · OSM · atualização ' + freshness;
    }
  }

  function updateStatusPill() {
    var pill = document.querySelector('.statusPill');
    if (pill) {
      pill.setAttribute('data-online', String(!state.offline));
      pill.textContent = state.offline ? 'OFFLINE' : 'AO VIVO';
    }
  }

  /* ======================================================================
     10. ROUTER + BOOTSTRAP
     ====================================================================== */

  function currentRoute() {
    var hash = window.location.hash || '#/';
    return hash.split('?')[0];
  }

  var ROUTES = {
    '#/': { view: homeView, mount: null },
    '#/alertas': { view: alertsView, mount: mountAlerts },
    '#/central': { view: centralView, mount: mountCentral },
    '#/cidadao': { view: citizenView, mount: mountCitizen },
    '#/chamados': { view: requestsView, mount: mountRequests },
    '#/sobre': { view: aboutView, mount: null },
  };

  function renderRoute(hash) {
    var route = ROUTES[hash] || ROUTES['#/'];
    MapView.destroy();
    byId('root').innerHTML = route.view();
    wireRegionSearch();
    if (route.mount) route.mount();
  }

  function wireRegionSearch() {
    var form = byId('region-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      searchRegion(byId('region-input').value);
    });
    var results = byId('region-results');
    if (results) {
      results.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-region-index]');
        if (!btn) return;
        var idx = Number(btn.getAttribute('data-region-index'));
        var region = state.regionResults[idx];
        if (region) selectRegion(region);
      });
    }
  }

  function wireToggles() {
    var toggles = document.querySelectorAll('[data-layer]');
    toggles.forEach(function (chip) {
      chip.addEventListener('click', function () {
        toggleLayer(chip.getAttribute('data-layer'));
      });
    });
    var demo = byId('demo-toggle');
    if (demo) demo.addEventListener('click', toggleDemo);
  }

  function mountCentral() {
    MapView.create('map', state.region ? state.region.center : DEFAULT_CENTER, state.region ? REGION_ZOOM : DEFAULT_ZOOM, null);
    refreshMapLayers();
    wireToggles();
    wireRequestList(byId('requests-host'));
    if (state.pendingRegionLoad && state.region) {
      state.pendingRegionLoad = false;
      selectRegion(state.region);
    }
  }

  function mountCitizen() {
    MapView.create('map', state.region ? state.region.center : DEFAULT_CENTER, state.region ? REGION_ZOOM : DEFAULT_ZOOM, function (point) {
      state.citizenOrigin = point;
      MapView.renderOrigin(point);
      var hint = byId('origin-hint');
      if (hint) {
        hint.setAttribute('data-set', 'true');
        hint.textContent = 'Local marcado: ' + point.lat.toFixed(4) + ', ' + point.lng.toFixed(4);
      }
    });
    refreshMapLayers();
    MapView.renderRoute(state.citizenRoute);
    wireToggles();
    var form = byId('help-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        submitHelpForm();
      });
    }
  }

  function submitHelpForm() {
    var name = (byId('help-name').value || '').trim();
    var errorEl = byId('help-error');
    function showError(msg) {
      errorEl.style.display = '';
      errorEl.textContent = msg;
    }
    if (!name) return showError('Informe seu nome.');
    if (!state.citizenOrigin) return showError('Toque no mapa para marcar onde você está.');
    var rawDoc = (byId('help-doc').value || '').trim();
    var document_ = undefined;
    if (rawDoc) {
      var result = validateDocument(rawDoc);
      if (!result.ok) return showError(result.reason);
      document_ = result.digits;
    }
    errorEl.style.display = 'none';
    requestRescue({
      citizenName: name,
      document: document_,
      situation: byId('help-situation').value,
      origin: state.citizenOrigin,
    });
  }

  function mountAlerts() {
    var grid = document.querySelector('.eventGrid');
    if (grid) {
      grid.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-focus]');
        if (btn) focusEventOnMap(btn.getAttribute('data-focus'));
      });
    }
    if (state.globalEvents.length === 0 && !state.loadingGlobal) loadGlobalAlerts();
  }

  function mountRequests() {
    wireRequestList(document);
  }

  function wireRequestList(scope) {
    if (!scope) return;
    scope.addEventListener('click', function (e) {
      var advanceBtn = e.target.closest('[data-advance]');
      if (advanceBtn) {
        advanceStatus(advanceBtn.getAttribute('data-advance'));
        return;
      }
      var selectBtn = e.target.closest('[data-select]');
      if (selectBtn) {
        state.selectedRequestId = selectBtn.getAttribute('data-select');
        renderRoute(currentRoute());
      }
    });
  }

  function boot() {
    state.requests = repoList();
    if (!window.L) {
      byId('root').innerHTML =
        '<main class="page"><p class="empty">Falha ao carregar o mapa (Leaflet). Verifique os arquivos em vendor/leaflet/.</p></main>';
      return;
    }
    window.addEventListener('hashchange', function () {
      renderRoute(currentRoute());
      window.scrollTo(0, 0);
    });
    if (!window.location.hash) window.location.hash = '#/';
    renderRoute(currentRoute());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
