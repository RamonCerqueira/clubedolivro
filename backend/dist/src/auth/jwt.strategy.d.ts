import { Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Cache } from 'cache-manager';
import { Request } from 'express';
declare const JwtStrategy_base: new (...args: [opt: StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private cacheManager;
    constructor(configService: ConfigService, cacheManager: Cache);
    validate(req: Request, payload: any): Promise<{
        id: any;
        email: any;
    }>;
}
export {};
