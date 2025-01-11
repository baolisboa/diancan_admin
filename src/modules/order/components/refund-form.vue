<template>
	<cl-form ref="Form"></cl-form>
</template>

<script setup lang="ts">
import { useForm } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { ElMessage } from "element-plus";

const emit = defineEmits(["success"]);

const { service } = useCool();

const Form = useForm();

function open(item: Eps.OrderInfoEntity) {
	Form.value?.open({
		title: "发起退款",
		width: "500px",
		props: {
			labelWidth: "80px"
		},
		op: {
			saveButtonText: "提交"
		},
		items: [
			{
				label: "退款状态",
				prop: "action",
				value: 1,
				required: true,
				component: {
					name: "el-radio-group",
					options: [
						{
							label: "同意",
							value: 1
						},
						{
							label: "拒绝",
							value: 0
						}
					]
				}
			},
			{
				label: "拒绝原因",
				prop: "refuseReason",
				required: true,
				hidden({ scope }) {
					return scope.action != 0;
				},
				component: {
					name: "el-input",
					props: {
						type: "textarea",
						rows: 4
					}
				}
			}
		],
		on: {
			submit(data, { done, close }) {
				service.order.info
					.refundHandle({
						...data,
						orderId: item.id,
						amount: item.price
					})
					.then(() => {
						ElMessage.success("操作成功");
						emit("success");
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

defineExpose({
	open
});
</script>
