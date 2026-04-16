import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getNotifications(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        type: string;
        read: boolean;
    }[]>;
    markAsRead(id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        type: string;
        read: boolean;
    }>;
}
