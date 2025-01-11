<template>
	<div class="delivery-item">
		<template v-if="scope.type == 0">
			<p class="t2">
				联系电话：<span>{{ scope.phone || "无" }}</span>
			</p>
			<p class="t">取餐号</p>
			<p class="n">{{ scope.takeNum }}</p>
		</template>

		<template v-else>
			<p class="t2">
				配送地址：<span>{{ scope.address?.address }}{{ scope.address?.detail }}</span>
			</p>
			<p class="t2">
				联系人：<span>{{ scope.address?.contact }}</span>
			</p>
			<p class="t2">
				联系电话：<span>{{ scope.phone || scope.address?.phone }}</span>
			</p>
		</template>
	</div>
</template>

<script setup lang="ts" name="delivery-item">
import { type PropType } from "vue";

const props = defineProps({
	scope: {
		type: Object as PropType<Eps.OrderInfoEntity>,
		default: () => ({})
	}
});
</script>

<style lang="scss" scoped>
.delivery-item {
	.el-tag {
		margin-bottom: 10px;
	}

	.t {
		font-size: 12px;
		color: var(--el-color-info);
	}

	.t2 {
		font-size: 12px;
		text-align: left;
		color: var(--el-color-info);

		span {
			color: var(--el-text-color-primary);
			font-weight: bold;
		}
	}

	.n {
		font-size: 20px;
		margin: 0 0 5px 0;
		font-weight: bold;
		letter-spacing: 1px;
	}
}
</style>
