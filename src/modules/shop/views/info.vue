<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />

			<cl-flex1 />
			<!-- 关键字搜索 -->
			<cl-search-key placeholder="搜索店铺名称、联系人" />
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" name="shop-info" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";

const { service } = useCool();

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: "店铺名称",
			prop: "name",
			component: { name: "el-input", props: { clearable: true } },
			required: true
		},
		{
			label: "联系人",
			prop: "contact",
			component: { name: "el-input", props: { clearable: true } },
			required: true,
			span: 12
		},
		{
			label: "手机号码",
			prop: "phone",
			component: { name: "el-input", props: { clearable: true } },
			required: true,
			span: 12
		},
		{
			label: "营业时间",
			prop: "businessHours",
			hook: {
				bind(data, { form }) {
					return [form.startBusinessHours || "10:00", form.endBusinessHours || "22:00"];
				},
				submit(data, { form }) {
					const [start, end] = data || [];
					form.startBusinessHours = start;
					form.endBusinessHours = end;
				}
			},
			component: {
				name: "el-time-picker",
				props: {
					isRange: true,
					defaultValue: [new Date(2000, 1, 1, 10, 0), new Date(2000, 1, 1, 22, 0)],
					format: "HH:mm",
					valueFormat: "HH:mm"
				}
			},
			required: true
		},
		{
			label: "店铺地址",
			prop: "address",
			component: { name: "amap-select" },
			required: true
		},
		{
			label: "状态",
			prop: "status",
			flex: false,
			component: { name: "cl-switch" },
			required: true
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: "selection" },
		{ label: "店铺名称", prop: "name", minWidth: 150 },
		{ label: "联系人", prop: "contact", minWidth: 120 },
		{ label: "手机号码", prop: "phone", minWidth: 120 },
		{
			label: "营业时间",
			prop: "businessHours",
			minWidth: 140,
			formatter(row) {
				return `${row.startBusinessHours} - ${row.endBusinessHours}`;
			}
		},

		{
			label: "店铺地址",
			prop: "address",
			minWidth: 200,
			component: {
				name: "amap-info"
			}
		},
		{ label: "状态", prop: "status", minWidth: 100, component: { name: "cl-switch" } },
		{
			label: "创建时间",
			prop: "createTime",
			minWidth: 170,
			sortable: "desc",
			component: { name: "cl-date-text" }
		},
		{
			label: "更新时间",
			prop: "updateTime",
			minWidth: 170,
			sortable: "custom",
			component: { name: "cl-date-text" }
		},
		{ type: "op", buttons: ["edit", "delete"] }
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: service.shop.info
	},
	(app) => {
		app.refresh();
	}
);

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}
</script>
