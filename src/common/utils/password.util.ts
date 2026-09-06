import { Injectable } from "@nestjs/common";

@Injectable()
export class CompareHash {
  static compare(
    password: string,
    hash: string
  ): Promise<boolean> {
    return Promise.resolve(false);
  }
}