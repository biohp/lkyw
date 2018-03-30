<template>
  <div id="tableBayonet">
    <Row class="expand-row">
        <Col span="8">
            <span class="expand-key">布设范围：</span>
            <span class="expand-value">{{ row.range }}</span>
        </Col>
        <Col span="8">
            <span class="expand-key">所属辖区：</span>
            <span class="expand-value">{{ row.area }}</span>
        </Col>
        <Col span="8">
            <span class="expand-key">卡口作用：</span>
            <span class="expand-value">{{ row.effect }}</span>
        </Col>
    </Row>
    <Row class="expand-row">
        <Col span="8">
            <span class="expand-key">所属道路：</span>
            <span class="expand-value">{{ row.road }}</span>
        </Col>
        <Col span="8">
            <span class="expand-key">交接地市：</span>
            <span class="expand-value">{{ row.city }}</span>
        </Col>
        <Col span="8">
            <span class="expand-key">设备编号：</span>
            <span class="expand-value">{{ row.deviceID }}</span>
        </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'tableBayonet',
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