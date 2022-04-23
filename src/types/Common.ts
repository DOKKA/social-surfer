
export interface OutboxItem {
    published: string;
    contentText: string;
    content: string;
    inReplyTo: string;
    id: string;
    selected: boolean;
    url: string;
    attachment: Attachment[];
}

export interface Contact {
    name: string;
    address: string;
}


export interface Attachment {
    mediaType: string
    name: string
    type: string
    url: string
  }
  