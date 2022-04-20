
export interface OutboxItem {
    published: string;
    contentText: string;
    content: string;
    inReplyTo: string;
    id: string;
    selected: boolean;
    url: string;
}

export interface Contact {
    name: string;
    address: string;
}