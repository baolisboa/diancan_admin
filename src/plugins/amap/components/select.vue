<template>
	<div class="amap-inner" @click="open()">
		<div v-if="text">
			<slot :data="text">
				<p class="pca">{{ text.pca }}</p>
				<p class="address">{{ text.address }}</p>
			</slot>

			<el-icon @click.stop="clear" v-if="!isDisabled">
				<circle-close />
			</el-icon>
		</div>

		<span class="placeholder" v-else>请选择</span>
	</div>

	<cl-dialog width="60%" title="地图位置" v-model="visible" @closed="onClosed">
		<div class="amap-dialog">
			<div id="map"></div>

			<div class="search">
				<cl-distpicker
					v-model="pca"
					type="pc"
					filterable
					placeholder="选择城市"
					:props="{
						value: 'code'
					}"
					@change="onCityChange"
				/>

				<el-select
					:ref="setRefs('input')"
					placeholder="请输入要查找的地址"
					v-model="keyWord"
					:remote-method="onSearch"
					filterable
					remote
					clearable
					@change="onChange"
				>
					<el-option
						v-for="(item, index) in list"
						:key="index"
						:label="item.name"
						:value="item.id"
					/>
				</el-select>
			</div>

			<!-- <el-input type="textarea" :row="3" v-model="data.address" v-if="data"></el-input> -->
		</div>

		<template #footer v-if="!isDisabled">
			<el-button @click="close">取消</el-button>
			<el-button type="primary" @click="confirm">选择</el-button>
		</template>
	</cl-dialog>
</template>

<script setup lang="ts" name="amap-select">
import { debounce, assign } from "lodash-es";
import { computed, nextTick, ref } from "vue";
import { CircleClose } from "@element-plus/icons-vue";
import { useCool } from "/@/cool";
import { ElMessage } from "element-plus";
import { useForm } from "@cool-vue/crud";
import { useAMap } from "../hooks";

const props = defineProps({
	modelValue: null,
	dataKey: String,
	prop: String,
	disabled: Boolean,
	isDisabled: Boolean,
	scope: null
});

const emit = defineEmits(["update:modelValue", "change"]);

const { refs, setRefs } = useCool();
const Form = useForm();
const { map, AMap, createMap, usePlugins } = useAMap({
	plugins: ["AMap.Geolocation", "AMap.PlaceSearch"]
});

// 省市区
const pca = ref([]);

// 是否可见
const visible = ref(false);

// 关键字
const keyWord = ref("");

// poi列表
const list = ref<{ id: string; name: string; [key: string]: any }[]>([]);

// 选中
const data = ref();

// 显示内容
const text = computed(() => {
	let d = data.value || props.scope || props.modelValue;

	if (props.dataKey) {
		d = d[props.dataKey];
	}

	return d?.address
		? {
				address: d.address,
				pca: `${d.province}-${d.city}-${d.district}`
			}
		: null;
});

let placeSearch: any;

// 创建
function create() {
	// 创建地图
	createMap("map");

	// 定位
	usePlugins("AMap.Geolocation");

	// 搜索
	placeSearch = new AMap.value.PlaceSearch({
		map: map.value
	});

	placeSearch.on("markerClick", (e: { id: string; data: any }) => {
		keyWord.value = e.id;
		check(e.data);
	});
}

// 打开
function open() {
	visible.value = true;

	nextTick(() => {
		create();

		setTimeout(() => {
			refs.input.focus();
		}, 300);
	});
}

// 关闭
function close() {
	visible.value = false;
}

// 关闭后
function onClosed() {
	pca.value = [];
	reset();
}

// 重置
function reset() {
	keyWord.value = "";
	list.value = [];
	data.value = null;
}

// 清空数据
function clear() {
	data.value = null;

	if (props.dataKey) {
		emit("update:modelValue", null);
		emit("change", null);
	} else {
		delete props.scope.address;
		delete props.scope.city;
		delete props.scope.district;
		delete props.scope.province;
		delete props.scope.lat;
		delete props.scope.lng;
	}

	Form.value?.validateField(props.prop);
}

// 监听搜索
const onSearch = debounce((val: string) => {
	if (val) {
		placeSearch.clear();
		placeSearch.search(val, (status: string, e: any) => {
			if (e.poiList) {
				list.value = e.poiList.pois;
			}
		});
	}
}, 300);

// 监听选择
function onChange(id: string) {
	const item = list.value.find((e) => e.id == id);

	if (item) {
		const { lng, lat } = item.location;
		map.value?.setCenter([lng, lat]);
		check(item);
	}
}

// 监听城市选择
function onCityChange([_, code]: string[] = []) {
	placeSearch?.setCity(code || null);
	reset();
}

// 选择
function check(item: any) {
	if (item) {
		data.value = {
			address: item.name + " " + item.address,
			city: item.cityname,
			district: item.adname,
			province: item.pname,
			lat: item.location.lat,
			lng: item.location.lng
		};
	}
}

// 确认
function confirm() {
	if (!data.value) {
		return ElMessage.warning("请先在地图上选择");
	}

	if (props.dataKey) {
		emit("update:modelValue", data.value);
		emit("change", data.value);
	} else {
		assign(props.scope, data.value);
	}

	close();
	Form.value?.validateField(props.prop);
}
</script>

<style lang="scss" scoped>
.amap-inner {
	display: flex;
	align-items: center;
	border-radius: 5px;
	border: 1px solid var(--el-border-color);
	padding: 5px 10px;
	font-size: 14px;
	cursor: pointer;
	position: relative;
	line-height: normal;

	&:hover {
		border-color: var(--el-border-color-hover);
	}

	.address {
		color: #999;
		font-size: 12px;
		margin-top: 2px;
	}

	.placeholder {
		color: var(--el-text-color-placeholder);
	}

	.el-icon {
		position: absolute;
		top: calc(50% - 7px);
		right: 10px;
		color: var(--el-text-color-placeholder);
	}
}

.amap-dialog {
	position: relative;

	#map {
		height: 60vh;
	}

	.search {
		position: absolute;
		left: 10px;
		top: 10px;

		:deep(.el-cascader) {
			width: 160px;
		}

		.el-select {
			width: 300px;
			margin-left: 10px;
		}
	}
}
</style>
