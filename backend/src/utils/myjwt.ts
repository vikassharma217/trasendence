


import jwt, { SignOptions, VerifyOptions, JwtPayload } from 'jsonwebtoken';

export class MyJwt {
    private secret: string;
    private expiresIn?: string | number;

    constructor(options: { secret: string; expiresIn?: string | number }) {
        this.secret = options.secret;
        this.expiresIn = options.expiresIn;
    }

    sign(payload: object, options?: SignOptions): string {
        const signOptions: SignOptions = {
            ...options,
            expiresIn: options?.expiresIn || (this.expiresIn as SignOptions['expiresIn']),
        };
        return jwt.sign(payload, this.secret, signOptions);
    }

    verify<T extends JwtPayload>(token: string, options?: VerifyOptions): T {
        return jwt.verify(token, this.secret, options) as T;
    }

    decode<T extends JwtPayload>(token: string): T | null {
        return jwt.decode(token) as T | null;
    }
}