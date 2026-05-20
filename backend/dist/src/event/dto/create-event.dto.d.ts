export declare class CreateEventDto {
    title: string;
    description?: string;
    date: string;
    type: 'ONLINE' | 'PRESENTIAL';
    link?: string;
    address?: string;
    clubId: string;
    participantLimit?: number;
}
