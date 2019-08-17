import {Component, Vue} from 'vue-property-decorator';
import ServiceModel from "@/database/models/ServiceModel";

@Component
export default class App extends Vue {
    public async mounted() {
        let s = new ServiceModel(5);
        await s.Get();
        s.Location.Model.Name = 'Sibiu2';
        await s.Location.Model.Save();
    }
}