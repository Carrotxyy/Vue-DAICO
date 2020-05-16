<template>
    <div class="project" title="查看详情">
        <div class="content" >
            <h4> {{data.describe}} </h4>
            <div >
                <table>
                    <tr  v-for="item in Object.keys(trimData)" :key="item">
                        <td class="key">
                            <strong>{{item}}:</strong>
                        </td>
                        <td class="value">
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
        props : ["data","isTrim"],
        methods:{
            delKey(obj,keys){
                keys.map(key=>{
                    delete obj[key]
                })
                return obj
            },
            

        },
        computed: {
            // 修剪data的属性
            trimData(){
                if(!this.isTrim){
                    // 不需要修剪
                    return this.data
                }
                // 深拷贝this.data,如果直接修改this.data会影响到父组件
                const deepCloneData = JSON.parse(JSON.stringify(this.data))
                return this.delKey(deepCloneData,["owner","balance","smybol","tokenTotal","endTime","address"])
            }
        },
    }
</script>

<style lang="scss" scoped>
    .project{
        text-align: center;
        cursor:pointer;
        .content{
            border: 2px solid #83d8ef;
            border-radius: 10px;
            padding: 10px;
            table{
                tr{
                    .key{
                        width: 50px;
                        text-align: right;
                    }
                    .value{
                        text-align: left;
                        span{
                            margin-left: 20px;
                        }
                    }
                }
            }
        }
    }
</style>