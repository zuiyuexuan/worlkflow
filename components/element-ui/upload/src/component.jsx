import getSlot from '@jeff-js/utils/lib/slot';

import './style.css';

function parseFile(file, i) {
    if(file.name) return file;
    return {
        url: file.downloadUrl,
        name: file.fileName,
        uid: i
    };
}

// 增加允许删除属性
const NAME = 'fcUpload';

export default {
    name: NAME,
    props: {
        formCreateInject: {
            type: Object,
            required: true,
        },
        onHandle: {
            type: Function,
            default(file) {
                this.previewImage = file.url;
                this.previewVisible = true;
            }
        },
        uploadType: {
            type: String,
            default: 'file'
        },
        limit: {
            type: Number,
            default: 0
        },
        allowRemove: {
            type: Boolean,
            default: true
        },
        previewMask: undefined,
        modalTitle: String,
        handleIcon: {
            type: [String, Boolean],
            default: () => undefined
        },
        value: [Array, String],
        tip: String,
        allowUpload:{
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            uploadList: [],
            previewVisible: false,
            previewImage: '',
            cacheFiles: [],
        }
    },
    created() {
        if (this.formCreateInject.prop.props.showFileList === undefined) {
            this.formCreateInject.prop.props.showFileList = false;
        }
        this.formCreateInject.prop.props.fileList = this.value ? this.value.map(parseFile): [];
    },
    watch: {
        value(n) {
            if (this.$refs.upload.uploadFiles.every(file => {
                return !file.status || file.status === 'success';
            })) {
                this.$refs.upload.uploadFiles = n.map(parseFile);
                this.uploadList = this.$refs.upload.uploadFiles;
            }
        },
        limit(n, o) {
            if (o === 1 || n === 1) {
                this.update();
            }
        }
    },
    methods: {
        key(unique) {
            return unique;
        },
        isDisabled() {
            return this.formCreateInject.prop.props.disabled === true;
        },
        onRemove(file) {
            if (this.isDisabled()) {
                return;
            }
            this.$refs.upload.handleRemove(file);
        },
        handleClick(file) {
            this.onHandle(file);
        },
        makeItem(file, index) {
            if( this.uploadType === 'image'){
                return <img src={file.url} key={this.key('img' + index)}/>
            }else{
                return <div class='file-item'><a href={file.url} target='_blank'>{file.name}</a></div>       
            }
          
        },
        makeRemoveIcon(file, index) {
            return <i class="el-icon-delete" on-click={() => this.onRemove(file)} key={this.key('ri' + index)}/>;
        },
        makeHandleIcon(file, index) {
            return <i
                class={(this.handleIcon === true || this.handleIcon === undefined) ? 'el-icon-view' : this.handleIcon}
                on-click={() => this.handleClick(file)} key={this.key('hi' + index)}/>;
        },
        makeProgress(file, index) {

            return <el-progress style="width:200px" percentage={file.percentage} status="success" key={this.key('pg' + index)}></el-progress>

        },
        makeIcons(file, index) {
            const icons = [];
            if (this.allowRemove || this.handleIcon !== false) {
                if ((this.uploadType !== 'file' && this.handleIcon !== false) || (this.uploadType === 'file' && this.handleIcon)) {
                    icons.push(this.makeHandleIcon(file, index));
                }
                if (this.allowRemove) {
                    icons.push(this.makeRemoveIcon(file, index));
                }

                return <div class='fc-upload-cover'>{icons}</div>;
            }
        },
        makeFiles() {
            return this.uploadList.map((file, index) => this.$scopedSlots.fileList ? this.$scopedSlots.fileList({
                file,
                index,
                vm: this
            }) : <div key={this.key(index)}
                class='fc-files'><i class="file-prefix-icon el-icon-document"></i>{(file.percentage !== undefined && file.status !== 'success') ? this.makeProgress(file, index) : [this.makeItem(file, index), this.makeIcons(file, index)]}</div>);
        },
        makeUpload() {
            const isShow = (!this.limit || this.limit > this.uploadList.length);
            const allowUpload = isShow && this.allowUpload;
            return <div class={allowUpload ? 'el-upload-button-container' : 'el-upload-button-container is_hidden'}>
                <ElUpload {...this.formCreateInject.prop} ref="upload"
                    style={{display: 'inline-block'}}
                    key={this.key('upload')}>
                    {allowUpload ? <template slot="default">
                        {this.$slots.default || <div class='fc-upload-btn'>
                            <el-button type="primary" size="small"><i class="el-icon-upload el-icon--right"></i>上传</el-button>
                        </div>}
                    </template> : null}{getSlot(this.$slots, ['default'])}
                </ElUpload>
                {this.tip && this.allowUpload ?  <div class="upload__tip">{this.tip}</div> : null}
                   
            </div>
        
        },
        update() {
            let files = this.$refs.upload.uploadFiles.filter((url) => url !== undefined);
            if (this.cacheFiles.length !== files.length) {
                this.cacheFiles = [...files];
                this.$emit('input', this.limit === 1 ? (files[0] || '') : files);
            }
        },
        handleCancel() {
            this.previewVisible = false;
        },
    },
    render() {
        if (this.$refs.upload) {
            if (this.formCreateInject.prop.props.showFileList === undefined) {
                this.formCreateInject.prop.props.showFileList = this.$refs.upload.showFileList;
            }
            this.formCreateInject.prop.props.fileList = this.$refs.upload.fileList;
        }
        return (
            <div
                class='_fc-upload-file test'>{[this.makeUpload(), this.formCreateInject.prop.props.showFileList ? [] : this.makeFiles()]}
                <el-dialog
                    props={{
                        appendToBody: true,
                        modal: this.previewMask,
                        title: this.modalTitle,
                        visible: this.previewVisible
                    }}
                    on-close={this.handleCancel}>
                    <img alt="example" style="width: 100%" src={this.previewImage}/>
                </el-dialog>
            </div>);
    },
    mounted() {
        this.uploadList = this.$refs.upload.uploadFiles;
        this.$watch(() => this.$refs.upload.uploadFiles, (e) => {
            this.update();
        }, {deep: true});
    }
}
