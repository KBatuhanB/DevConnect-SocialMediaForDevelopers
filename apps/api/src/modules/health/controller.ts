import type { Request, Response } from "express";
import { sendSuccess } from "../../core/http/response";
import type { HealthPayload } from "./types";

type HealthService = {
  getStatus: () => HealthPayload;
};

export function createHealthController(service: HealthService) {
  return (_request: Request, response: Response) => {
    // Faz 5'te basari sozlesmesi ortak helper uzerinden tek tipe indirildi.
    const payload = service.getStatus();

    sendSuccess(response, payload);
  };
}