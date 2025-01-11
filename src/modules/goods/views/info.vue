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

					<cl-filter label="状态">
						<cl-select :options="options.status" prop="status" :width="140" />
					</cl-filter>

					<cl-flex1 />
					<!-- 关键字搜索 -->
					<cl-search-key placeholder="搜索标题" />
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

				<!-- 商品规格 -->
				<goods-spec :ref="setRefs('goodsSpec')" />
			</cl-crud>
		</template>
	</cl-view-group>
</template>

<script lang="ts" name="goods-info" setup>
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { router, useCool } from "/@/cool";
import { reactive } from "vue";
import { useViewGroup } from "/@/plugins/view";
import { useDict } from "/$/dict";
import GoodsSpec from "../components/spec.vue";

const { service, refs, setRefs } = useCool();
const { dict } = useDict();
const { ViewGroup } = useViewGroup<Eps.GoodsTypeEntity>({
	service: service.goods.type,
	label: "分类",
	title: "商品列表",
	data: {
		size: 1000,
		order: "sortNum",
		sort: "desc"
	},
	onEdit() {
		return {
			width: "500px",
			props: {
				labelWidth: "60px"
			},
			items: [
				{
					label: "标题",
					prop: "name",
					required: true,
					component: {
						name: "el-input"
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
	onSelect(item) {
		refresh({
			typeId: item.id
		});
	}
});

// 选项
const options = reactive({
	status: [
		{
			label: "已上架",
			value: 1
		},
		{
			label: "已下架",
			value: 0
		}
	]
});

// cl-upsert
const Upsert = useUpsert({
	dialog: {
		width: "1000px"
	},
	items: [
		{
			label: "标题",
			prop: "title",
			component: { name: "el-input", props: { clearable: true } },
			required: true
		},
		{
			label: "描述",
			prop: "desc",
			component: { name: "el-input", props: { clearable: true, type: "textarea", rows: 3 } }
		},
		{
			label: "标签",
			prop: "tags",
			value: [],
			component: {
				name: "el-select",
				options: dict.get("goodsRecommendTags"),
				props: { clearable: true, multiple: true, allowCreate: true, filterable: true }
			}
		},
		{
			label: "封面图",
			prop: "mainPic",
			component: { name: "cl-upload" },
			required: true
		},
		{
			label: "价格",
			prop: "price",
			hook: "number",
			span: 12,
			component: {
				name: "el-input-number",
				props: {
					min: 0.01,
					max: 1000000
				}
			},
			required: true
		},
		{
			label: "排序",
			prop: "sortNum",
			hook: "number",
			span: 12,
			component: { name: "el-input-number" }
		},
		{
			label: "状态",
			prop: "status",
			flex: false,
			value: 1,
			component: { name: "cl-switch" },
			required: true
		}
	],
	onSubmit(data, { next }) {
		next({
			...data,
			typeId: ViewGroup.value?.selected?.id
		});
	}
});

// cl-table
const Table = useTable({
	columns: [
		{ type: "selection" },
		{ label: "标题", prop: "title", minWidth: 240 },
		{
			label: "封面图",
			prop: "mainPic",
			minWidth: 100,
			component: { name: "cl-image", props: { size: 50 } }
		},
		{ label: "价格", prop: "price", minWidth: 100, sortable: "custom" },
		{ label: "已售", prop: "sold", minWidth: 100, sortable: "custom" },
		{ label: "状态", prop: "status", minWidth: 100, component: { name: "cl-switch" } },
		{ label: "排序", prop: "sortNum", minWidth: 100, sortable: "desc" },
		{ label: "创建时间", prop: "createTime", minWidth: 160, sortable: "custom" },
		{
			label: "更新时间",
			prop: "updateTime",
			minWidth: 160,
			sortable: "custom"
		},
		{
			type: "op",
			width: 300,
			buttons({ scope }) {
				return [
					"edit",
					"delete",
					{
						label: "规格",
						onClick() {
							refs.goodsSpec.open(scope.row);
						}
					},
					{
						label: "评论",
						onClick() {
							router.push({
								path: "/goods/comment",
								query: {
									id: scope.row.id,
									title: scope.row.title
								}
							});
						}
					}
				];
			}
		}
	]
});

// cl-crud
const Crud = useCrud({
	service: service.goods.info
});

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}
</script>
