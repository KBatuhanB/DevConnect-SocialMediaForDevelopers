import { resolve } from "node:path";
import { config } from "dotenv";

// API hem src altindan hem dist altindan calisabildigi icin yolu dosya konumundan kuruyoruz.
config({
  path: resolve(__dirname, "../../.env.local"),
  override: true
});

config({
  path: resolve(__dirname, "../../.env"),
  override: false
});