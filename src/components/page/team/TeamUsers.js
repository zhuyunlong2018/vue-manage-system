/**
 * 团队--成员管理
 */
import { getUsers, editTeamUser, addTeamUser } from '@/api/user'
import { getGroups } from '@/api/group'
import { makeChildren, findParents, deepClone } from '@/utils'
export default {
    name: 'TeamUsers',
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
            groupData: [],
            options: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    created() {
        this.getData()
        this.getGroups()
        this.resetForm()
    },
    computed: {
        data() {
            return this.tableData.filter((d) => {
                if (d.name.indexOf(this.select_word) > -1 || d.group_name.indexOf(this.select_word) > -1 ) {
                    return d;
                }
            })
        }
    },
    methods: {
        // 获取数据
        getData() {
            this.loading = true;
            getUsers({forTeam: true}).then(response => {
                this.tableData = response
                this.loading = false
            })
            .catch(error => {
                this.loading = false
            })
        },
        getGroups() {
            this.loading = true
            getGroups({ forTeam: true}).then(response => {
                this.groupData = response
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
                console.log(error)
                this.loading = false
            })
        },
        resetForm() {
            this.form = {
                id: 0,
                name: '',
                password: '',
                group_id: 0,
                group_name: '',
                status: 1,
                selectedOptions: ['0']
            }
            this.idx = -1
        },
        handleAdd() {
            this.resetForm();
            this.editVisible = true;
        },
        handleEdit(index, row) {
            this.idx = index;
            const ids = findParents(this.groupData, row.group_id,)
            this.form = {
                id: row.id,
                name: row.name,
                group_name: row.group_name,
                status: row.status,
                selectedOptions: ids
            }
            this.editVisible = true;
        },
        handleDelete(index, row) {
            this.idx = index;
            this.delVisible = true
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        getGroupNameByGroupId(groupId) {
            for(const element of this.groupData) {
                if (groupId == element.id) {
                    return element.name
                }
            }
        },
        // 保存编辑
        saveEdit() {
            this.loading = true
            this.form.group_id = this.form.selectedOptions[this.form.selectedOptions.length-1]
            if (this.form.id > 0) {
                //编辑
                editTeamUser(this.form).then(response => {
                    this.form.group_name = this.getGroupNameByGroupId(this.form.group_id)
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
                addTeamUser(this.form).then(response => {
                    this.form.id = response
                    this.form.group_name = this.getGroupNameByGroupId(this.form.group_id)
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
        }
    }
}