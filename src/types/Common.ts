
export interface OutboxItem {
    published: string;
    contentText: string;
    content: string;
    inReplyTo: string;
    id: string;
    selected: boolean;
}