<template>
	<cl-form ref="Form">
		<template #slot-specs>
			<div class="specs">
				<vue-draggable
					:animation="300"
					tag="div"
					ghost-class="Ghost"
					item-key="index"
					v-model="list"
				>
					<template #item="{ element: row, index }">
						<div class="row">
							<el-input
								:ref="setRefs(`label-${index}`)"
								class="label"
								v-model="row.label"
								placeholder="规格名称"
							/>

							<div class="options">
								<div
									class="item"
									v-for="(item, index2) in row.options"
									:key="index2"
									@click="edit(item, row)"
								>
									{{ item.label }}

									<span v-if="item.price">{{ item.price }}</span>

									<el-icon
										class="del"
										@click.stop="
											() => {
												row.options.splice(index2, 1);
											}
										"
									>
										<close-bold />
									</el-icon>
								</div>

								<div class="item" @click="edit(null, row)">
									<el-icon>
										<plus />
									</el-icon>
								</div>
							</div>

							<el-icon class="del" @click="remove(index)">
								<close-bold />
							</el-icon>
						</div>
					</template>
				</vue-draggable>

				<div class="op">
					<el-button type="info" @click="def">默认</el-button>
					<el-button type="success" @click="add">添加</el-button>
				</div>
			</div>
		</template>
	</cl-form>

	<cl-form ref="EditForm" />
</template>

<script lang="ts" setup name="goods-spec">
import { useForm } from "@cool-vue/crud";
import { ref, nextTick } from "vue";
import { useCool } from "/@/cool";
import { assign, cloneDeep, isEmpty } from "lodash-es";
import { Plus, CloseBold } from "@element-plus/icons-vue";
import VueDraggable from "vuedraggable";
import { ElMessage } from "element-plus";
import { DefaultSpecs } from "../dict";

interface Item {
	label: string;
	price: number;
}

interface Row {
	label: string;
	options: Item[];
}

const { service, refs, setRefs } = useCool();
const Form = useForm();
const EditForm = useForm();

const list = ref<Row[]>([]);

// 刷新
async function refresh(id: number) {
	const info = await service.goods.info.info({ id });
	list.value = info.specs || [];
}

// 打开
async function open(info: Eps.GoodsInfoEntity) {
	await refresh(info.id!);

	Form.value?.open({
		title: "编辑规格",
		form: {},
		width: "60%",
		items: [
			{
				prop: "specs",
				component: {
					name: "slot-specs"
				}
			}
		],
		on: {
			submit(_, { close, done }) {
				const item = list.value.find((e) => !e.label || isEmpty(e.options));

				if (item) {
					ElMessage.error("请填写完整");
					done();
					return;
				}

				service.goods.info
					.update({
						id: info.id,
						specs: list.value
					})
					.then(() => {
						close();
					})
					.catch((err) => {
						ElMessage.error(err.message);
						done();
					});
			}
		}
	});
}

// 编辑
function edit(item: Item | null, row: Row) {
	EditForm.value?.open({
		title: item ? "编辑" : "添加",
		width: "400px",
		form: {
			...item
		},
		props: {
			labelPosition: "top"
		},
		dialog: {
			controls: ["close"]
		},
		items: [
			{
				prop: "label",
				label: "名称",
				required: true,
				component: {
					name: "el-input"
				}
			},
			{
				prop: "price",
				label: "价格",
				required: true,
				value: 0,
				component: {
					name: "el-input-number",
					props: {
						min: 0,
						max: 1000
					}
				}
			}
		],
		on: {
			submit(data, { close }) {
				if (item) {
					assign(item, data);
				} else {
					row.options.push(data);
				}

				close();
			}
		}
	});
}

function def() {
	list.value = cloneDeep(DefaultSpecs);
}

// 添加
function add() {
	list.value.push({
		label: "",
		options: []
	});

	nextTick(() => {
		refs[`label-${list.value.length - 1}`].focus();
	});
}

// 移除
function remove(index: number) {
	list.value.splice(index, 1);
}

defineExpose({
	open
});
</script>

<style lang="scss" scoped>
.specs {
	.Ghost {
		border-color: var(--el-color-primary) !important;
	}

	.row {
		border: 1px solid var(--el-border-color);
		border-radius: var(--el-border-radius-base);
		padding: 10px;
		margin-bottom: 10px;
		position: relative;
		cursor: move;

		.del {
			position: absolute;
			right: 10px;
			top: 10px;
			cursor: pointer;
			color: var(--el-text-color-disabled);

			&:hover {
				color: var(--el-color-danger);
			}
		}

		.label {
			width: 185px;
		}

		.options {
			display: flex;
			flex-wrap: wrap;

			.item {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 32px;
				border: 1px solid var(--el-border-color);
				padding: 0 40px 0 10px;
				border-radius: var(--el-border-radius-base);
				margin: 10px 10px 0 0;
				cursor: pointer;
				box-sizing: border-box;
				line-height: 1;
				position: relative;

				span {
					&::before {
						content: "￥";
						font-size: 12px;
						margin-left: 5px;
					}
				}

				.del {
					top: auto;
					right: 8px;
				}

				&:hover {
					border-color: var(--el-color-primary);
				}

				&:last-child {
					background-color: #f7f7f7;
					border: 0;
					padding: 0 15px;

					&:hover {
						background-color: #eee;
					}
				}
			}
		}
	}
}
</style>
