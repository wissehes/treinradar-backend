export type getTrainsResponse = TrainsResponse;

export interface TrainsResponse {
  payload: Payload;
}

export interface Payload {
  treinen: Train[];
}

export interface Train {
  treinNummer: number;
  ritId: string;
  lat: number;
  lng: number;
  snelheid: number;
  richting: number;
  horizontaleNauwkeurigheid: number;
  type: string;
  bron: string;
  materieel?: number[];
}
