import toLine from '@jeff-js/utils/lib/toline';
import is from '@jeff-js/utils/lib/type';
import toString from '@jeff-js/utils/lib/tostring';
import extend from '@jeff-js/utils/lib/extend';
import Vue from 'vue';

function parseProp(prop) {
    if (is.String(prop))
        return {domProps: {innerHTML: prop}};
    return prop;
}

export function CreateNodeFactory() {

    const aliasMap = {};

    function CreateNode(vm) {
        vm && this.setVm(vm);
    }

    extend(CreateNode.prototype, {
        setVm(vm) {
            this.vm = vm;
            this.$h = vm.$createElement;
        },
        make(tag, data, children) {
            if (Vue.config.isReservedTag(tag) && data.nativeOn) delete data.nativeOn;
            return this.makeComponent(tag, data, children);
        },
        makeComponent(type, data, children) {
            let Node = this.$h(type, parseProp(data), children || []);
            Node.context = this.vm;
            return Node;
        },
        aliasMap
    });

    extend(CreateNode, {
        aliasMap,
        alias(alias, name) {
            aliasMap[alias] = name;
        },
        use(nodes) {
            Object.keys(nodes).forEach((k) => {
                const line = toLine(k);
                const lower = toString(k).toLocaleLowerCase();
                const v = nodes[k];
                [k, line, lower].forEach(n => {
                    CreateNode.alias(k, v);
                    CreateNode.prototype[n] = function (data, children) {
                        return this.make(v, data, children);
                    };
                });
            });
        }
    })

    return CreateNode;
}
