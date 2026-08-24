export interface MethodFamily {
  readonly id: string;
  readonly name: string;
  readonly candidates: readonly string[];
  readonly evidenceQuestion: string;
}

export interface SensorOrCommunicationFault {
  readonly id: string;
  readonly name: string;
}

export const METHOD_FAMILIES: readonly MethodFamily[] = [
  {
    id: "statistical",
    name: "Statistical",
    candidates: ["PCA", "SPC", "Regression"],
    evidenceQuestion:
      "Is a transparent baseline sufficient, stable, and easy to maintain?",
  },
  {
    id: "classical-ml",
    name: "Classical ML",
    candidates: [
      "Random Forest",
      "XGBoost",
      "LightGBM",
      "Isolation Forest",
      "One-Class SVM",
    ],
    evidenceQuestion:
      "Do engineered features separate the target under unseen regimes?",
  },
  {
    id: "deep-learning",
    name: "Deep Learning",
    candidates: ["Autoencoder", "LSTM", "TCN", "Transformer"],
    evidenceQuestion:
      "Does representation capacity earn its data, compute, and explanation cost?",
  },
  {
    id: "physics-hybrid",
    name: "Physics Hybrid",
    candidates: ["Residual Model", "Gray-box Model", "Physics-Informed Model"],
    evidenceQuestion:
      "Can physical structure improve extrapolation and failure interpretation?",
  },
  {
    id: "optimization",
    name: "Optimization",
    candidates: ["Bayesian Optimization", "MPC", "Reinforcement Learning"],
    evidenceQuestion:
      "Is the problem genuinely optimization, and is any action authority safely separated?",
  },
] as const;

export const ALGORITHM_SUITABILITY_FACTORS = [
  "asset",
  "operating regime",
  "failure mode",
  "data",
  "constraints",
  "evaluation design",
] as const;

export const SENSOR_AND_COMMUNICATION_FAULTS: readonly SensorOrCommunicationFault[] =
  [
    { id: "sensor-bias", name: "bias" },
    { id: "sensor-drift", name: "drift" },
    { id: "sensor-dropout", name: "dropout" },
    { id: "communication-loss", name: "communication loss" },
  ] as const;
