import { Injectable } from '@nestjs/common';

import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {

    public async hashPassword(password: string) {
        const salt = await bcrypt.genSalt()
        return bcrypt.hash(password, salt);
    }

    public comparePassword(password: string, hashedPassword: string) {
        return bcrypt.compare(password, hashedPassword);
    }

   
}
