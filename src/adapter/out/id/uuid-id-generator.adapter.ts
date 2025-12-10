import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { IdGeneratorPort } from '../../../application/port/out/id-generator.port';

@Injectable()
export class UuidIdGeneratorAdapter implements IdGeneratorPort {
  newSessionId(): string {
    return randomUUID();
  }
}
