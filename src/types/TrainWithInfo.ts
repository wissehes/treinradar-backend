import type { TrainInformation } from "./NS/getTrainInfoResponse";
import type { Train } from "./NS/getTrainsResponse";

export type TrainWithInfo = Train & { info?: TrainInformation };
