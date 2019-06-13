/**
 * 推广--内容管理
 */
import VueCropper  from 'vue-cropperjs'
import { getGroups } from '@/api/group'
import { getContents, add, edit, changeStatus } from '@/api/extensionContext'
const BASE_API = process.env.VUE_APP_API
export default {
    name: 'extensionContext',
    data() {
        return {
            imgPre: BASE_API + 'Public/images/',
            imgSrc: '',
            loading: false,
            dialogVisible: false,
            message: 'first',
            showHeader: false,
            editVisible: false,
            extensionGroups: [],
            form: {},
            normal: [],
            draft: [],
            recycle: []
        }
    },
    components: {
        VueCropper
    },
    created() {
        this.resetForm()
        this.getExtensionGroups()
        this.getList()
    },
    methods: {
        resetForm() {
            this.form = {
                id: 0,
                content: '',
                type: 1,
                group_id: '',
                group_name: '',
                imgSrc: ''
            }
            this.idx = -1
        },
        handleNormal(index) {
            const item = this.draft.splice(index, 1)
            this.changeStatus(
                item[0], 1,
                () => { this.normal = item.concat(this.normal) },
                () => { this.draft = item.concat(this.draft) }
            )
            
        },
        handleDel(index) {
            const item = this.normal.splice(index, 1)
            this.changeStatus(
                item[0], 2,
                () => { this.recycle = item.concat(this.recycle) },
                () => { this.normal = item.concat(this.normal) }
            )
        },
        handleRestore(index) {
            const item = this.recycle.splice(index, 1)
            this.changeStatus(
                item[0], 1,
                () => { this.normal = item.concat(this.normal) },
                () => { this.recycle = item.concat(this.recycle) }
            )
        },
        handleDraft(index) {
            const item = this.normal.splice(index, 1)
            this.changeStatus(
                item[0], 0,
                () => { this.draft = item.concat(this.draft) },
                () => { this.normal = item.concat(this.normal) }
            )
        },
        handleAdd() {
            this.resetForm()
            this.editVisible = true
        },
        handleEdit(row) {
            this.form = row
            if (this.form.type === 2) {
                this.form.imgSrc = this.imgPre + this.form.content
                this.form.oldImg = this.form.content
            }
            this.editVisible = true
        },
        changeStatus(row, status, success, fail) {
            const data = {
                id: row.id,
                group_id: row.group_id,
                status
            }
            changeStatus(data).then(response => {
                success()
            })
            .catch(error => {
                fail()
            })
        },
        // 保存编辑
        saveEdit() {
            this.loading = true
            if (this.form.id > 0) {
                //编辑
                edit(this.form).then(response => {
                    if (response) {
                        this.form.content = response
                    }
                    this.form.group_name = this.getGroupNameByGroupId(this.form.group_id)
                    let arr
                    switch(this.form.status) {
                        case 0:
                            arr = this.draft
                            break;
                        case 1:
                            arr = this.normal
                            break;
                        case 2:
                            arr = this.recycle
                    }
                    arr.forEach((element, index) => {
                        if( element.id === this.form.id) {
                            arr[index] = this.form
                        }
                    })
                    this.editVisible = false
                    this.loading = false
                })
                .catch(error => {
                    console.log(error)
                    this.loading = false
                })
            } else {
                //添加
                add(this.form).then(response => {
                    this.form.id = response
                    this.form.group_name = this.getGroupNameByGroupId(this.form.group_id)
                    this.draft.push(this.form)
                    this.editVisible = false
                    this.loading = false
                })
                .catch(error => {
                    console.log(error)
                    this.loading = false
                })
            }
        },
        getGroupNameByGroupId(groupId) {
            for( const element of this.extensionGroups) {
                if (element.id === this.form.group_id) {
                    return element.name
                }
            }
        },
        getExtensionGroups() {
            getGroups({pid: 2}).then(response => {
                this.extensionGroups = response
            })
            .catch(error => {
                console.log(error)
            })
        },
        getList() {
            this.loading = true
            getContents().then(response => {
                response.forEach(element => {
                    switch(element.status) {
                        case 0:
                            this.draft.push(element)
                            break;
                        case 1:
                            this.normal.push(element)
                            break;
                        case 2:
                            this.recycle.push(element)
                    }
                });
                this.loading = false
            })
            .catch(error => {
                console.log(error)
                this.loading = false
            })
        },
        setImage(e){
            const file = e.target.files[0];
            if (!file.type.includes('image/')) {
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                this.dialogVisible = true;
                this.form.imgSrc = event.target.result;
                this.imgSrc = this.form.imgSrc
                // this.content = this.imgPre
                this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
            };
            reader.readAsDataURL(file);
        },
        cropImage () {
            this.form.imgSrc = this.$refs.cropper.getCroppedCanvas().toDataURL();
            // this.form.content = this.form.imgSrc
        },
        cancelCrop(){
            this.dialogVisible = false;
            this.form.imgSrc = this.imgSrc
            if (this.form.type === 2) {
                this.form.content = this.imgSrc
            }
        },
        imageuploaded(res) {
            console.log(res)
        },
        handleError(){
            this.$notify.error({
                title: '上传失败',
                message: '图片上传接口上传失败，可更改为自己的服务器接口'
            });
        }
    },
    computed: {
        unreadNum(){
            return this.unread.length;
        }
    }
}