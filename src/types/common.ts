
export interface ProfileInterface {
    getProfileJSON: () => Promise<void>;
    image: string|null;
    summary: string|null;
}