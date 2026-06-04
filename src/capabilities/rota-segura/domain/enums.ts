/**
 * Risk layers detected from Earth-observation satellite data. Each maps
 * to a real sensing technique: SAR → flood, thermal → fire, InSAR →
 * landslide. Values are stable string keys used as map/CSS identifiers.
 */
export enum RiskType {
  Flood = 'flood',
  Fire = 'fire',
  Landslide = 'landslide',
}

/**
 * Severity of a risk zone. Drives the pathfinding cost: a Critical cell
 * is impassable, lesser severities are passable at a penalty so a route
 * crosses them only when no safer path exists.
 */
export enum RiskSeverity {
  Moderate = 'moderate',
  High = 'high',
  Critical = 'critical',
}

/** Lifecycle of a citizen's rescue request, shown in the status panel. */
export enum RequestStatus {
  Pending = 'pending',
  EnRoute = 'en_route',
  Resolved = 'resolved',
}

/** What the citizen is facing — selected in the help-request form. */
export enum SituationType {
  Trapped = 'trapped',
  Medical = 'medical',
  Evacuate = 'evacuate',
  Stranded = 'stranded',
}
