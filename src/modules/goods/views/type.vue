<template>
	<cl-view-group ref="ViewGroup">
		<template #right>
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
					<cl-search-key placeholder="搜索名称" />
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
	</cl-view-group>
</template>

<script lang="tsx" name="goods-type" setup>
import { setFocus, useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { useViewGroup } from "/@/plugins/view";
import { deepTree } from "/@/cool/utils";

const { service } = useCool();
const { ViewGroup } = useViewGroup<Eps.GoodsTypeEntity>({
	service: service.goods.type,
	label: "一级分类",
	title: "二级分类",
	data: {
		size: 1000
	},
	onEdit() {
		return {
			width: "500px",
			props: {
				labelWidth: "60px"
			},
			items: [
				{
					label: "名称",
					prop: "name",
					required: true,
					component: {
						name: "el-input"
					}
				},
				{
					label: "图标",
					prop: "pic",
					component: {
						name: "cl-upload"
					}
				},
				{
					label: "排序",
					prop: "sortNum",
					component: {
						name: "el-input-number"
					}
				}
			]
		};
	},
	onData(list) {
		return deepTree(list);
	},
	onSelect(item) {
		refresh({
			parentId: item.id
		});
	}
});

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: "名称",
			prop: "name",
			component: { name: "el-input", props: { clearable: true } },
			required: true
		},
		{
			label: "排序",
			prop: "sortNum",
			hook: "number",
			component: { name: "el-input-number" }
		},
		{
			label: "图标",
			prop: "pic",
			component: {
				name: "cl-upload"
			}
		},
		{ label: "状态", prop: "status", value: 1, component: { name: "cl-switch" }, flex: false }
	],
	plugins: [setFocus("name")],
	onSubmit(data, { next }) {
		next({
			...data,
			parentId: ViewGroup.value?.selected?.id
		});
	}
});

// cl-table
const Table = useTable({
	columns: [
		{ type: "selection" },
		{ label: "名称", prop: "name", align: "left", minWidth: 200 },
		{
			label: "图标",
			prop: "pic",
			minWidth: 100,
			component: { name: "cl-image", props: { size: 40 } }
		},
		{ label: "排序", prop: "sortNum", minWidth: 100, sortable: "desc" },
		{ label: "状态", prop: "status", minWidth: 100, component: { name: "cl-switch" } },
		{
			label: "创建时间",
			prop: "createTime",
			minWidth: 160
		},
		{
			label: "更新时间",
			prop: "updateTime",
			minWidth: 160
		},
		{
			type: "op"
		}
	]
});

// cl-crud
const Crud = useCrud({
	service: service.goods.type
});

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}
</script>
