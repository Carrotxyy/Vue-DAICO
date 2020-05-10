<template>
  <div id="app">
    
    <el-container>
      <!-- 左侧导航栏 -->
      <el-aside width="200px">
        <left-nav />
      </el-aside>
      <el-container>
        <el-header>智能DAICO</el-header>
        <!-- 右侧两个显示区域 -->
        <el-main>
          <el-row :gutter="40">
            <el-col :span="12"><div class="grid-content bg-purple">333</div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple">333</div></el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
    

    <router-view/>
  </div>
</template>

<script>
import leftNav from "./components/LeftNav"
export default {
  components:{
    leftNav
  }
}
</script>

<style lang="scss">
</style>
