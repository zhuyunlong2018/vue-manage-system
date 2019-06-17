/**
 * 团队--代理成员管理
 */
import { getAgentUsers, editAgentUser, addAgentUser } from '@/api/user'
import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'AgentUsers',
    data() {
        return {
            tableData: [],
            select_word: '',
            loading: false,
            editVisible: false,
            delVisible: false,
            form: {},
            idx: -1,
            options: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    created() {
        this.getData()
        this.resetForm()
    },
    computed: {
        ...mapGetters(['userInfo']),
        data() {
            return this.tableData.filter((d) => {
                if (d.name.indexOf(this.select_word) > -1 || d.p_name.indexOf(this.select_word) > -1 ) {
                    return d;
                }
            })
        }
    },
    methods: {
        // 获取数据
        getData() {
            this.loading = true;
            getAgentUsers({forTeam: true}).then(response => {
                this.tableData = response
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
                password: '',
                status: 1,
            }
            this.idx = -1
        },
        handleAdd() {
            this.resetForm();
            this.editVisible = true;
        },
        handleEdit(index, row) {
            this.idx = index;
            this.form = {
                id: row.id,
                name: row.name,
                status: row.status,
            }
            this.editVisible = true;
        },
        handleDelete(index, row) {
            this.idx = index;
            this.delVisible = true
        },
        // 保存编辑
        saveEdit() {
            this.loading = true
            if (this.form.id > 0) {
                //编辑
                editAgentUser(this.form).then(response => {
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
                addAgentUser(this.form).then(response => {
                    this.form.id = response
                    this.form.p_name = this.userInfo.name
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