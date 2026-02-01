export interface VehicleCount {
  type: string;
  count: number;
}

export interface LocationData {
  location: string;
  imagePath: string;
  finalImagePath: string;
  initialTreeCount: number;
  finalTreeCount: number;
  solarPanelCount: number;
  vehicles: VehicleCount[];
  percentageEnergyEfficiency: number;
}
