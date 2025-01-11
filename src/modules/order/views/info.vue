<template>
	<cl-view-group ref="ViewGroup">
		<template #right>
			<cl-crud ref="Crud">
				<cl-row>
					<!-- 刷新按钮 -->
					<cl-refresh-btn />

					<cl-filter label="支付方式">
						<cl-select :options="options.payType" prop="payType" :width="120" />
					</cl-filter>

					<cl-filter label="订单类型">
						<cl-select :options="options.type" prop="type" :width="120" />
					</cl-filter>

					<cl-filter label="订单状态">
						<cl-select :options="options.status" prop="status" :width="120" />
					</cl-filter>

					<cl-filter label="创建时间">
						<cl-date-picker type="datetimerange" />
					</cl-filter>

					<cl-flex1 />
					<!-- 关键字搜索 -->
					<cl-search-key placeholder="搜索订单号、用户昵称" />
				</cl-row>

				<cl-row>
					<!-- 数据表格 -->
					<cl-table ref="Table" show-summary :summary-method="onSummaryMethod" />
				</cl-row>

				<cl-row>
					<cl-flex1 />
					<!-- 分页控件 -->
					<cl-pagination />
				</cl-row>
			</cl-crud>
		</template>
	</cl-view-group>
</template>

<script lang="ts" name="order-info" setup>
import { useCrud, useTable } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { reactive, ref } from "vue";
import { OrderStatus, PayType, OrderType } from "../dict";
import OrderUserItem from "../components/user-item.vue";
import OrderPayItem from "../components/pay-item.vue";
import OrderRemarkItem from "../components/remark-item.vue";
import OrderInfoItem from "../components/info-item.vue";
import OrderDiscountItem from "../components/discount-item.vue";
import OrderGoods from "../components/goods.vue";
import DeliveryItem from "../components/delivery-item.vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { useViewGroup } from "/@/plugins/view";

const { service } = useCool();
const { ViewGroup } = useViewGroup({
	label: "门店列表",
	title: "订单列表",
	service: service.shop.info,
	enableAdd: false,
	enableContextMenu: false,
	onSelect(item) {
		refresh({
			shopId: item.id,
			page: 1
		});
	}
});

// 选项
const options = reactive({
	payType: PayType,
	status: OrderStatus,
	type: OrderType
});

// 合计数据
const subData = ref({
	totalCount: 0,
	totalPrice: 0
});

// cl-table
const Table = useTable<Eps.OrderInfoEntity>({
	contextMenu: ["delete"],
	columns: [
		{
			type: "expand",
			label: "商品",
			width: 60,
			component: {
				vm: OrderGoods
			}
		},
		{
			label: "订单信息",
			prop: "orderNum",
			minWidth: 160,
			component: {
				vm: OrderInfoItem
			}
		},
		{
			label: "用户信息",
			prop: "user",
			minWidth: 120,
			component: {
				vm: OrderUserItem
			}
		},
		{
			label: "金额（元）",
			prop: "price",
			minWidth: 120,
			sortable: "custom"
		},
		{
			label: "优惠说明",
			prop: "discount",
			minWidth: 160,
			component: {
				vm: OrderDiscountItem
			}
		},
		{
			label: "付款信息",
			prop: "pay",
			minWidth: 120,
			component: {
				vm: OrderPayItem
			}
		},
		{
			label: "配送信息",
			prop: "delivery",
			minWidth: 200,
			component: {
				vm: DeliveryItem
			}
		},
		{
			label: "备注",
			prop: "remark",
			minWidth: 200,
			component: {
				vm: OrderRemarkItem
			}
		},
		{
			label: "创建时间",
			prop: "createTime",
			minWidth: 160,
			sortable: "desc"
		},
		{
			label: "类型",
			prop: "type",
			dict: options.type,
			minWidth: 100,
			fixed: "right"
		},
		{
			label: "状态",
			prop: "status",
			dict: options.status,
			minWidth: 100,
			fixed: "right"
		},
		{
			type: "op",
			width: 100,
			buttons({ scope }) {
				return [
					{
						label: "出餐",
						hidden: scope.row.status != 1,
						onClick() {
							ElMessageBox.confirm("确定出餐吗？", "提示", {
								type: "warning"
							})
								.then(() => {
									service.order.info
										.update({
											id: scope.row.id,
											status: 2
										})
										.then(() => {
											ElMessage.success("出餐成功");
											refresh();
										})
										.catch((err) => {
											ElMessage.error(err.message);
										});
								})
								.catch(() => null);
						}
					},
					{
						label: "确认送达",
						hidden: scope.row.status != 2,
						onClick() {
							ElMessageBox.confirm("确定送达吗？", "提示", {
								type: "warning"
							})
								.then(() => {
									service.order.info
										.update({
											id: scope.row.id,
											status: 4
										})
										.then(() => {
											ElMessage.success("确定成功");
											refresh();
										})
										.catch((err) => {
											ElMessage.error(err.message);
										});
								})
								.catch(() => null);
						}
					}
				];
			}
		}
	]
});

// cl-crud
const Crud = useCrud({
	service: service.order.info,
	async onRefresh(params, { next }) {
		const res = await next(params);

		// 设置合计数据
		subData.value = res.subData;
	}
});

function refresh(params?: any) {
	Crud.value?.refresh(params);
}

function onSummaryMethod() {
	return ["合计", "", "", subData.value.totalPrice + " 元"];
}
</script>
