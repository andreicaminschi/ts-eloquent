import Factory from "@/eloquent/database/Factory";
import UserModel from "@/database/models/UserModel";
import LocationModel from "@/database/models/LocationModel";
import AttachmentModel from "@/database/models/AttachmentModel";

export default class AttachmentFactory extends Factory<AttachmentModel> {
    Make(data?: Dictionary<any>): AttachmentModel {return new AttachmentModel(data);}

}