import toArray from '@jeff-js/utils/lib/toarray';

const name = 'select';

export default {
    name,
    toFormValue(value, ctx) {
       
        if (ctx.prop.props.multiple && !Array.isArray(value)) {
            return toArray(value)
        } else {
            if(Array.isArray(value)){
                return value[0]; 
            }
            return value;
        }
    }

}
