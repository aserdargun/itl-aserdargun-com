import type { Technology } from "@/lib/domain/types";

const item = (id: string, name: string) => ({ id, name });

export const TECHNOLOGIES: readonly Technology[] = [
  {
    id: "industrial-connectivity",
    name: "Industrial Connectivity",
    description: "Candidate interfaces for industrial data access.",
    items: [
      item("opc-ua", "OPC UA"),
      item("mqtt", "MQTT"),
      item("modbus", "Modbus"),
      item("historian-connectors", "Historian connectors"),
    ],
  },
  {
    id: "twin-semantics",
    name: "Twin Semantics",
    description: "Candidate semantic foundations for twins.",
    items: [
      item("asset-administration-shell", "Asset Administration Shell"),
      item("eclipse-basyx", "Eclipse BaSyx"),
      item("domain-ontologies", "Domain ontologies"),
    ],
  },
  {
    id: "simulation",
    name: "Simulation",
    description: "Candidate simulation and scientific-computing tools.",
    items: [
      item("modelica", "Modelica 3.7"),
      item("openmodelica", "OpenModelica"),
      item("fmi", "FMI 3.0"),
      item("ssp-2", "SSP 2.0"),
      item("fmu", "FMU"),
      item("python-scientific-computing", "Python scientific computing"),
    ],
  },
  {
    id: "data",
    name: "Data",
    description: "Candidate data formats, engines, and stores.",
    items: [
      item("parquet", "Parquet"),
      item("duckdb", "DuckDB"),
      item("polars", "Polars"),
      item("timescaledb", "TimescaleDB"),
      item("influxdb", "InfluxDB"),
      item("minio", "MinIO"),
    ],
  },
  {
    id: "machine-learning",
    name: "Machine Learning",
    description: "Candidate machine-learning libraries.",
    items: [
      item("scikit-learn", "scikit-learn"),
      item("xgboost", "XGBoost"),
      item("lightgbm", "LightGBM"),
      item("pytorch", "PyTorch"),
    ],
  },
  {
    id: "experimentation",
    name: "Experimentation",
    description: "Candidate experiment tracking and optimization tools.",
    items: [item("mlflow", "MLflow"), item("optuna", "Optuna")],
  },
  {
    id: "local-ai",
    name: "Local AI",
    description: "Candidate locally operated AI capabilities.",
    items: [
      item("local-llm-runtimes", "Local LLM runtimes"),
      item("rag", "RAG"),
      item("tool-using-agents", "Tool-using agents"),
    ],
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    description: "Candidate runtime infrastructure.",
    items: [
      item("docker", "Docker"),
      item("kubernetes", "Kubernetes"),
      item("k3s", "k3s"),
    ],
  },
  {
    id: "observability",
    name: "Observability",
    description: "Candidate observability tools.",
    items: [item("prometheus", "Prometheus"), item("grafana", "Grafana")],
  },
];
