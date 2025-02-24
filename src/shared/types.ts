export interface BaseResponse<T> {
    readonly data: T;
    readonly message?: string;
    readonly success: boolean;
}