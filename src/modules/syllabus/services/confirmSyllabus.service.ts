import { ConfirmSyllabusDto } from "../validations/confirmSyllabus.schema";

class ConfirmSyllabusService {
  async execute(data: ConfirmSyllabusDto) {
    return data;
  }
}

export const confirmSyllabusService =
  new ConfirmSyllabusService();
