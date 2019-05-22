<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 推广内容</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="add" class="handle-del mr10" @click="handleAdd">添加草稿内容</el-button>
            </div>
            <el-tabs v-model="message">
                <el-tab-pane :label="`当前推广内容(${normal.length})`" name="first">
                    <el-table :data="normal" :show-header="false" style="width: 100%">
                        <el-table-column prop="group_name" width="150"></el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title" @click="handleEdit(scope.row)">
                                    <span v-if="scope.row.type===1">{{scope.row.content}}</span>
                                    <img class="show-image" v-if="scope.row.type===2" :src="imgPre +scope.row.content" alt="">
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="update_time" width="180"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button type="danger" size="small" @click="handleDel(scope.$index)">归入弃用栏</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleDraft(scope.$index)">归入草稿栏</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="`草稿内容(${draft.length})`" name="second">
                    <template v-if="message === 'second'">
                        <el-table :data="draft" :show-header="false" style="width: 100%">
                            <el-table-column prop="group_name" width="150"></el-table-column>
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title" @click="handleEdit(scope.row)">
                                        <span class="message-title" @click="handleEdit(scope.row)">
                                            <span v-if="scope.row.type===1">{{scope.row.content}}</span>
                                            <img class="show-image" v-if="scope.row.type===2" :src="imgPre +scope.row.content" alt="">
                                        </span>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="update_time" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button @click="handleNormal(scope.$index)">启用</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`已弃用内容(${recycle.length})`" name="third">
                    <template v-if="message === 'third'">
                        <el-table :data="recycle" :show-header="false" style="width: 100%">
                            <el-table-column prop="group_name" width="150"></el-table-column>
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title" @click="handleEdit(scope.row)">
                                        <span class="message-title" @click="handleEdit(scope.row)">
                                            <span v-if="scope.row.type===1">{{scope.row.content}}</span>
                                            <img class="show-image" v-if="scope.row.type===2" :src="imgPre + scope.row.content" alt="">
                                        </span>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="update_time" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button @click="handleRestore(scope.$index)">还原</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="添加/编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="所属分组">
                    <el-select v-model="form.group_id" placeholder="请选择">
                        <el-option v-for="group in extensionGroups"  :key="group.id" :label="group.name" :value="group.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio-group v-model="form.type">
                        <el-radio :label="1">文本</el-radio>
                        <el-radio :label="2">图片</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="内容">
                    <el-input v-show='form.type===1' type="textarea" rows="5" v-model="form.content"></el-input>

                    <div v-show="form.type===2" class="crop-demo">
                        <img v-show="form.imgSrc" :src="form.imgSrc" class="pre-img">
                        <div class="crop-demo-btn">选择图片
                            <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                        </div>
                    </div>
                </el-form-item>
            
                <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
                    <vue-cropper ref='cropper' :src="form.imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="cancelCrop">取 消</el-button>
                        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                    </span>
                </el-dialog>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import VueCropper  from 'vue-cropperjs';
    import { getGroups } from '@/api/group'
    import { getContents, add, edit, changeStatus } from '@/api/extensionContext'

    export default {
        name: 'tabs',
        data() {
            return {
                imgPre: 'http://192.168.136.129/Public/images/',
                imgSrc: '',
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
                    })
                    .catch(error => {
                        console.log(error)
                    })
                } else {
                    //添加
                    add(this.form).then(response => {
                        this.form.id = response
                        this.form.group_name = this.getGroupNameByGroupId(this.form.group_id)
                        this.draft.push(this.form)
                        this.editVisible = false
                    })
                    .catch(error => {
                        console.log(error)
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
                })
                .catch(error => {
                    console.log(error)
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

</script>

<style>
.message-title{
    cursor: pointer;
}
.handle-row{
    margin-top: 30px;
}
 .content-title{
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}
.pre-img{   
    width: 100px;
    height: 100px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 5px;
}
.crop-demo{
    display: flex;
    align-items: flex-end;
}
.crop-demo-btn{
    position: relative;
    width: 100px;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    margin-left: 30px;
    background-color: #409eff;
    color: #fff;
    font-size: 14px;
    border-radius: 4px;
    box-sizing: border-box;
}
.crop-input{
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}
.show-image {
    height: 180px;
}

</style>

