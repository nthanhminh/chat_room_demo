export interface CreateNewMessageDto {
    sender: string;
    to?: string;
    message: string;
}