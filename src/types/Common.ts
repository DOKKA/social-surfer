
export interface OutboxItem {
    published: Date;
    contentText: string;
    content: string;
    inReplyTo: string;
    id: string;
}