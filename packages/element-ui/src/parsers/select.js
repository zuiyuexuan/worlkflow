import toArray from '@jeff-js/utils/lib/toarray';

const name = 'select';

export default {
    name,
    toFormValue(value, ctx) {

        if(ctx.prop.props.multiple){
            if(!Array.isArray(value)){
                return toArray(value)
            }
            return value;
        }else{
            return value[0];   
        }
    
    }

}
