<template>
	<div class="amap-info__inner">
		<div>
			<slot> </slot>

			<el-icon class="map" @click="open">
				<location />
			</el-icon>

			{{ data.province }} - {{ data.city }} -
			{{ data.district }}
		</div>
		<p>
			{{ data.address }}
		</p>
		<p>
			{{ data.houseNum }}
		</p>

		<cl-dialog v-model="visible" :title="data.address" width="1000px">
			<div id="map"></div>
		</cl-dialog>
	</div>
</template>

<script setup lang="ts" name="amap-info">
import { Location } from "@element-plus/icons-vue";
import { computed, ref } from "vue";
import { ElMessage } from "element-plus";
import { useAMap } from "../hooks";
import { nextTick } from "vue";

const props = defineProps({
	item: Object,
	scope: null
});

const { AMap } = useAMap({
	plugins: ["AMap.Geolocation", "AMap.PlaceSearch"]
});

const visible = ref(false);

const data = computed(() => {
	return props.scope || props.item || {};
});

function open() {
	visible.value = true;

	nextTick(() => {
		create();
	});
}

function close() {
	visible.value = false;
}

function create() {
	let lng = 0;
	let lat = 0;

	if (data.value.location) {
		lng = data.value.location[0];
		lat = data.value.location[1];
	} else {
		lng = data.value.lng;
		lat = data.value.lat;
	}

	if (lng && lat) {
		const map = new AMap.value.Map("map", {
			resizeEnable: true,
			zoom: 18,
			center: [lng, lat]
		});

		const marker = new AMap.value.Marker({
			position: new AMap.value.LngLat(lng, lat)
		});

		map.add(marker);
	} else {
		ElMessage.error("该地址无法定位");
		close();
	}
}
</script>

<style lang="scss" scoped>
.amap-info__inner {
	font-size: 12px;

	.map {
		font-size: 16px;
		position: relative;
		top: 3px;
		cursor: pointer;

		&:hover {
			color: var(--el-color-primary);
		}
	}

	p {
		margin: 0;
	}
}

#map {
	height: 500px;
}
</style>
