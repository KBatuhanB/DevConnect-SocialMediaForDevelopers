import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { deliveryCheckConfig, type DeliveryCheckItem } from "./config";

type DeliveryCheckResult = DeliveryCheckItem & {
  ok: boolean;
  detail: string;
};

function checkItem(item: DeliveryCheckItem): DeliveryCheckResult {
  const absolutePath = resolve(process.cwd(), item.path);

  if (!existsSync(absolutePath)) {
    return {
      ...item,
      ok: false,
      detail: "Bulunamadi"
    };
  }

  const stats = statSync(absolutePath);

  if (!stats.isFile()) {
    return {
      ...item,
      ok: false,
      detail: "Dosya bekleniyordu"
    };
  }

  if (stats.size === 0) {
    return {
      ...item,
      ok: false,
      detail: "Bos dosya"
    };
  }

  return {
    ...item,
    ok: true,
    detail: "Hazir"
  };
}

function main() {
  const results = deliveryCheckConfig.items.map(checkItem);

  // Faz 14'te eksik teslim parcasi tek bakista gorunsun.
  console.table(
    results.map((result) => ({
      path: result.path,
      ok: result.ok,
      detail: result.detail,
      reason: result.reason
    }))
  );

  if (results.every((result) => result.ok)) {
    console.log("Teslim paketi butunluk kontrolu basarili.");
    return;
  }

  process.exitCode = 1;
  throw new Error("Teslim paketi eksik veya tutarsiz.");
}

main();