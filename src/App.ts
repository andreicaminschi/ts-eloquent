import {Component, Vue} from 'vue-property-decorator';
import ServiceModel from "@/database/models/ServiceModel";
import AttachmentModel from "@/database/models/AttachmentModel";

@Component
export default class App extends Vue {
    public async mounted() {
        let s = new ServiceModel(5);
        await s.Get();
        await s.Requests.Refresh();
        console.log(s.Requests.Repository.Items);
    }
}