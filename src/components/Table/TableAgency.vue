<!-- 机构管理,展开列 [1.2] -->
<template>
  <div id="tableAgency">
    <Row class="expand-row">
      <Col span="6">
        <span class="expand-key">所处地址：</span>
        <span class="expand-value">{{ row.address }}</span>
      </Col>
      <Col span="6">
        <span class="expand-key">邮政编码：</span>
        <span class="expand-value">{{ row.zip }}</span>
      </Col>
      <Col span="6">
        <span class="expand-key">编制人数：</span>
        <span class="expand-value">{{ row.policeNum }}</span>
      </Col>
      <Col span="6">
        <span class="expand-key">在编民警：</span>
        <span class="expand-value">{{ row.police }}</span>
      </Col>
    </Row>
    <Row class="expand-row">
      <Col span="6">
        <span class="expand-key">在编职工：</span>
        <span class="expand-value">{{ row.worker }}</span>
      </Col>
      <Col span="6">
        <span class="expand-key">其他人数：</span>
        <span class="expand-value">{{ row.otherNum }}</span>
      </Col>
      <Col span="6">
        <span class="expand-key">负责人：</span>
        <span class="expand-value">{{ row.head }}</span>
      </Col>
      <Col span="6">
        <span class="expand-key">负责人电话：</span>
        <span class="expand-value">{{ row.headTel }}</span>
      </Col>
    </Row>
    <Row class="expand-row">
      <Col span="6">
        <span class="expand-key">负责人手机：</span>
        <span class="expand-value">{{ row.headPhone }}</span>
      </Col>
      <Col span="6">
        <span class="expand-key">值班电话2：</span>
        <span class="expand-value">{{ row.watchTel2 }}</span>
      </Col>
      <Col span="6">
        <span class="expand-key">值班电话3：</span>
        <span class="expand-value">{{ row.watchTel3 }}</span>
      </Col>
      <Col span="6">
        <span class="expand-key">传真：</span>
        <span class="expand-value">{{ row.fax }}</span>
      </Col>
    </Row>
    
  </div>
</template>

<script>
export default {
  name: 'tableAgency',
  props: {
	row: Object
  }
}
</script>

<style scoped>
.expand-row{
  margin-bottom: 16px;
}
.expand-key{
  font-weight: 700;
}
</style>