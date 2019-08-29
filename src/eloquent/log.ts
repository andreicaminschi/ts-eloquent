import Eloquent from "@/eloquent/config";

export function log(...params: any[]) {
    if (!Eloquent.IsDebugMode) return;
    console.log(...params);
}

export function warn(...params: any[]) {
    if (!Eloquent.IsDebugMode) return;
    console.warn(...params);
}

export function group(...params: any[]) {
    if (!Eloquent.IsDebugMode) return;
    console.group(...params);
}

export function group_collapsed(...params: any[]) {
    if (!Eloquent.IsDebugMode) return;
    console.groupCollapsed(...params);
}

export function group_end() {
    if (!Eloquent.IsDebugMode) return;
    console.groupEnd();
}

