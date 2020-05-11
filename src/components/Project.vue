<template>
    <div class="project" title="查看详情">
        <div class="content" >
            <h4> 项目标题 </h4>
            <div >
                <table>
                    <tr  v-for="item in Object.keys(data)" :key="item">
                        <td class="key">
                            <strong>{{item}}:</strong>
                        </td>
                        <td>
                            <span> {{data[item]}} </span>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props : ["data"],
        methods:{
        }
    }
</script>

<style lang="scss" scoped>
    .project{
        text-align: center;
        cursor:pointer;
        .content{
            border: 2px solid;
            border-radius: 10px;
            padding: 10px;
            table{
                tr{
                    .key{
                        width: 50px;
                        text-align: right;
                    }
                }
            }
        }
    }
</style>