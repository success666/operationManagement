<template>
    <div style="overflow: hidden;">
        <el-pagination
                class="pagin"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                layout="total, prev, pager, next, sizes, jumper"
                :total="total">
        </el-pagination>
    </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    props: ['pageNum', 'pageSize', 'total', 'tableData'],
    methods: {
      handleSizeChange(val) {
        this.$emit('current', {currentSize: val});
      },
      handleCurrentChange(val) {
        this.$emit('current', {currentPage: val});
      },
    },
  }
</script>

<style lang="scss" scoped>
    .pagin {
        float: right;
        margin-top: 15px;
    }
</style>
