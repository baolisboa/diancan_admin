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
			<cl-search-key placeholder="搜索关键字" />
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

<script lang="ts" name="user-vip" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";

const { service } = useCool();

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: "会员名称",
			prop: "name",
			component: { name: "el-input", props: { clearable: true } },
			required: true
		},
		{
			label: "会员等级",
			prop: "level",
			hook: "number",
			value: 1,
			component: { name: "el-input-number" },
			required: true
		},
		{
			label: "积分门槛",
			prop: "score",
			hook: "number",
			component: { name: "el-input-number" },
			required: true
		},
		{
			label: "会员权益",
			prop: "desc",
			component: { name: "el-input", props: { type: "textarea", rows: 8 } },
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
		{ label: "会员名称", prop: "name", minWidth: 150 },
		{ label: "会员等级", prop: "level", minWidth: 120, sortable: "desc" },
		{ label: "积分门槛", prop: "score", minWidth: 120 },
		{ label: "会员权益", prop: "desc", showOverflowTooltip: true, minWidth: 200 },
		{ label: "状态", prop: "status", minWidth: 100, component: { name: "cl-switch" } },
		{
			label: "创建时间",
			prop: "createTime",
			minWidth: 170,
			sortable: "custom",
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
		service: service.user.vip
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
