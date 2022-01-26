import { PartialType } from '@nestjs/mapped-types';
import { JWTPayload } from './jwt-payload.dto';

export class AuthDataPayload extends PartialType(JWTPayload) {
    email:string;
}
