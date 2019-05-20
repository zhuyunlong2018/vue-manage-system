<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="(menu,index) in menus">
                <template v-if="menu.children.length">
                    <el-submenu :index="menu.path?menu.path:index.toString()" :key="menu.id">
                        <template slot="title">
                            <i :class="menu.icon"></i><span slot="title">{{ menu.title }}</span>
                        </template>
                        <template v-for="(subMenu,_index) in menu.children">
                            <el-submenu v-if="subMenu.children.length" :index="subMenu.path?subMenu.path:index.toString()+_index.toString()" :key="subMenu.id">
                                <template slot="title">{{ subMenu.title }}</template>
                                <template v-for="(threeItem,i) in subMenu.children">
                                    <el-menu-item v-if="menuIds.indexOf(threeItem.id)>-1" :key="threeItem.id"  :index="threeItem.path?threeItem.path:index.toString()+_index.toString()+i.toString()">
                                        {{ threeItem.title }}
                                    </el-menu-item>
                                </template>
                            </el-submenu>
                            <el-menu-item v-else-if="menuIds.indexOf(subMenu.id)>-1" :index="subMenu.path?subMenu.path:index.toString()+_index.toString()" :key="subMenu.id">
                                {{ subMenu.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else-if="menuIds.indexOf(menu.id)>-1">
                    <el-menu-item :index="menu.path?menu.path:index.toString()" :key="menu.id">
                        <i :class="menu.icon"></i><span slot="title">{{ menu.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: []
            }
        },
        computed:{
            ...mapGetters(['menus','menuIds']),
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
