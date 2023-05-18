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
            if(value){
                return value[0];
            }
            return []
        }
    
    }

}
