import {functionalMerge, normalMerge, toArrayMerge} from '@jeff-js/utils/lib/mergeprops';


export const keyAttrs = ['type', 'slot', 'emitPrefix', 'value', 'name', 'native', 'hidden', 'display', 'inject', 'options', 'emit', 'nativeEmit', 'link', 'prefix', 'suffix', 'update', 'sync', 'optionsTo', 'key', 'preview', 'component', 'cache'];

export const arrayAttrs = ['validate', 'children', 'control'];

export const normalAttrs = ['effect', 'deep'];

export function attrs() {
    return [...keyAttrs, ...normalMerge, ...toArrayMerge, ...functionalMerge, ...arrayAttrs, ...normalAttrs];
}
