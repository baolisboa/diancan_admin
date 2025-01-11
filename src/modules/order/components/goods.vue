<template>
	<div class="order-goods">
		<div class="list">
			<div class="item" v-for="item in list" :key="item.id">
				<cl-image :src="item.mainPic" :size="60" />

				<div class="det">
					<p class="name">{{ item.title }}</p>
					<p class="spec">{{ item.specText }}</p>
					<p class="flex1"></p>
					<p class="price">
						<span>¥{{ item.price }}</span>
						<span>x{{ item.count }}</span>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="order-goods">
import { values } from "lodash-es";
import { PropType, computed } from "vue";

interface Item {
	goodsList: { goodsInfo: Eps.GoodsInfoEntity }[];
}

const props = defineProps({
	scope: {
		type: Object as PropType<Item>,
		default: () => ({})
	}
});

const list = computed(() => {
	return props.scope.goodsList?.map((e) => {
		const d = e.goodsInfo;
		return {
			...d,
			specText: values(d.spec).join("、"),
			count: d.count || 1
		};
	});
});
</script>

<style lang="scss" scoped>
.order-goods {
	.list {
		display: flex;
		flex-wrap: wrap;
		padding: 0 10px;

		.item {
			display: flex;
			align-items: center;
			position: relative;
			border: 1px solid var(--el-bg-color-page);
			border-radius: 6px;
			padding: 10px;
			height: 80px;
			width: 250px;
			margin-right: 10px;
			font-size: 12px;

			.cl-image {
				margin-right: 10px;
				border-radius: 6px;
				background-color: #f9f9f9;
			}

			.det {
				display: flex;
				flex-direction: column;
				flex: 1;
				height: 100%;
				padding: 2px 0;

				.name {
					overflow: hidden;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
				}

				.spec {
					font-size: 12px;
				}

				.flex1 {
					flex: 1;
				}

				.price {
					display: flex;
					align-items: center;
					justify-content: space-between;

					span {
						&:first-child {
							color: var(--el-color-danger);
						}
					}
				}
			}
		}
	}
}
</style>
