
import { getGroups, edit, add } from '@/api/group'
import { getMenus, getMenuIdsByGroupId } from '@/api/menu'
import { makeChildren, findParents, deepClone } from '@/utils'

export default {
    name: 'Groups',
    data() {
        return {
            tableData: [],
            multipleSelection: [],
            select_word: '',
            loading: false,
            editVisible: false,
            delVisible: false,
            form: {},
            idx: -1,
            options: [{
                value: '0',
                label: '根分组',
            }],
            menus: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    mounted() {
    },
    created() {
        this.getData()
        this.resetForm()
    },
    computed: {
        data() {
            return this.tableData.filter((d) => {
                if (d.name.indexOf(this.select_word) > -1 ) {
                    return d;
                }
            })
        }
    },
    methods: {
        // 获取数据
        getData() {
            this.loading = true
            getGroups().then(response => {
                this.tableData = response
                //将所有的分组整理为按层级数据
                const options = makeChildren(deepClone(response), 0, data => {
                    const newData = {
                        value: data.id,
                        label: data.name
                    }
                    if (data.children instanceof Array && data.children.length > 0) {
                        newData.children = data.children
                    }
                    return newData
                })
                this.options = this.options.concat(options)
                this.loading = false
            })
            .catch(error => {
                this.loading = false
            })
        },
        resetForm() {
            this.form = {
                id: 0,
                name: '',
                pid: 0,
                p_name: '',
                selectedOptions: ['0'],
                menus: []
            }
            if (this.menus.length > 0) {
                this.setChecked()
            }
            this.idx = -1
        },
        handleAdd() {
            this.editVisible = true
            this.getMenus()
            this.resetForm()
        },
        handleEdit(index, row) {
            this.editVisible = true;
            this.getMenus()
            let ids = findParents(this.tableData, row.pid,)
            if (ids.length === 0) {
                ids = ['0']
            }
            this.idx = index;
            this.form = {
                id: row.id,
                name: row.name,
                pid: row.pid,
                p_name: row.p_name,
                selectedOptions: ids
            }
            this.getMenuIdsByGroupId(row.id)
        },
        handleDelete(index, row) {
            this.idx = index;
            this.delVisible = true
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        getGroupNameByGroupId(groupId) {
            for(const element of this.tableData) {
                if (groupId == element.id) {
                    return element.name
                }
            }
        },
        // 保存编辑
        saveEdit() {
            this.loading = true
            this.form.pid = this.form.selectedOptions[this.form.selectedOptions.length-1]
            this.form.menus = this.$refs.tree.getCheckedKeys()
            if (this.form.id > 0) {
                //编辑
                edit(this.form).then(response => {
                    this.form.p_name = this.getGroupNameByGroupId(this.form.pid)
                    this.$set(this.tableData, this.idx, this.form)
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
                    this.form.p_name = this.getGroupNameByGroupId(this.form.pid)
                    this.tableData.push(this.form)
                    this.editVisible = false
                    this.loading = false
                })
                .catch(error => {
                    console.log(error)
                    this.loading = false
                })
            }
        },
        // 确定删除
        deleteRow(){
            this.$message.error('暂不支持删除')
            this.delVisible = false
        },
        getMenus() {
            if (this.menus.length > 0) {
                return;
            }
            this.loading = true
            //获取系统所有菜单列表
            getMenus().then(response => {
                //将所有的菜单整理为按层级数据
                this.menus = makeChildren(response, 0, data => {
                    const newData = {
                        id: data.id,
                        label: data.title
                    }
                    if (data.children instanceof Array && data.children.length > 0) {
                        newData.children = data.children
                    }
                    return newData
                }, 'id', 'father_id')
                this.loading = false
            })
            .catch(error => {
                console.log(error)
                this.loading = false
            })
        },
        setChecked(arr=[]) {
            this.$refs.tree.setCheckedKeys(arr);
        },
        getMenuIdsByGroupId(group_id) {
            getMenuIdsByGroupId({group_id}).then(response => {
                const ids = []
                if (response instanceof Array) {
                    response.forEach(element => {
                        ids.push(element.menu_id)
                    });
                }
                this.setChecked(ids)
            })
        }
        
    }
}