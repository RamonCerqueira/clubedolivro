import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: any): Promise<{
        access_token: string;
    }>;
    register(body: any): Promise<{
        access_token: string;
    }>;
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any): Promise<{
        access_token: string;
    }>;
    facebookAuth(req: any): Promise<void>;
    facebookAuthRedirect(req: any): Promise<{
        access_token: string;
    }>;
    sendMagicLink(email: string): Promise<{
        message: string;
    }>;
    magicLogin(token: string): Promise<{
        access_token: string;
    }>;
    logoutGlobal(req: any): Promise<{
        message: string;
    }>;
}
