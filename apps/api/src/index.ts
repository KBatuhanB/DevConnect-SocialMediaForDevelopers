import "./config/load-env";
import { apiEnv } from "./config/env";
import { createApp } from "./app";

const app = createApp();

app.listen(apiEnv.port, () => {
  // Faz 2'de sadece omurgayi ayaga kaldiriyoruz; detayli loglama sonraki fazda buyuyecek.
  console.log(`API iskeleti ${apiEnv.port} portunda hazir.`);
});