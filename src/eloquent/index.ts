import _Vue from "vue";
import {ApiDriver} from "@/eloquent/api/ApiDriver";
import {IApiDriver} from "@/eloquent/api/IApiDriver";

import './extensions/string';
import './extensions/array';
import './extensions/object';
import './extensions/date';
import './log';
import Eloquent from "@/eloquent/config";

declare module 'vue/types/vue' {

    interface Vue {
        $api: IApiDriver;
    }

    interface VueConstructor {
        $api: IApiDriver;
    }
}

export default function EloquentPlugin(Vue: typeof _Vue, options?: any): void {
    Vue.$api = Vue.prototype.$api = new ApiDriver('https://api.serj.ro', '1.0');
    Eloquent.SetDefaultApiDriver(Vue.$api);
    Eloquent.SetDebugMode(true);
}