import Model from "../../eloquent/database/Model";
import AttachmentFactory from "@/database/factories/AttachmentFactory";
import AttachmentRepository from "@/database/repositories/AttachmentRepository";

export default class AttachmentModel extends Model {
    public GetModelName(): string { return "attachment"; }
    public GetFactory(): AttachmentFactory { return new AttachmentFactory();}
    public GetRepository(): AttachmentRepository { return new AttachmentRepository(new AttachmentFactory); }

    public Id: number = 0;
    public Name: string = '';

    constructor(data?: Dictionary<any> | number) {
        super(data);
        if (data) this.Load(data);
    }
}