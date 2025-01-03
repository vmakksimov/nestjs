export class GetUserRequest {
    constructor(public readonly userId: string) {}

    toString(){
        return JSON.stringify(this)
    }
}