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
            <el-tabs v-model="message" v-loading.fullscreen="loading" 
            element-loading-text="拼命加载中"
            element-loading-background="rgba(0, 0, 0, 0.3)">
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
import './Context.css'
import Context from './Context'
export default Context
</script>


