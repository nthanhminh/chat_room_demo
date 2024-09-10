export interface CreateNewMessageToPrivateChatDto {
    privateChatId: string;
    sender: string;
    to: string;
    message: string;
}