import { addDays } from "date-fns";

import { hashService } from "./hash.service";
import { sessionRepository } from "../repositories/session.repository";

class SessionService {
  async create(
    userId: string,
    sessionId: string,
    refreshToken: string
  ) {
    return sessionRepository.create({
      id: sessionId,
      userId,
      refreshToken: hashService.sha256(refreshToken),
      expiresAt: addDays(new Date(), 7),
    });
  }

  async findById(sessionId: string) {
    return sessionRepository.findById(sessionId);
  }

  async updateRefreshToken(
    sessionId: string,
    refreshToken: string
  ) {
    return sessionRepository.updateRefreshToken(
      sessionId,
      hashService.sha256(refreshToken)
    );
  }

  async delete(sessionId: string) {
    return sessionRepository.delete(sessionId);
  }

  compareRefreshToken(
    incomingToken: string,
    storedHash: string
  ) {
    return (
      hashService.sha256(incomingToken) ===
      storedHash
    );
  }
}

export const sessionService =
  new SessionService();