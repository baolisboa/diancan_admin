import AMapLoader from "@amap/amap-jsapi-loader";
import { module } from "/@/cool";
import { merge } from "lodash-es";
import { type Ref, shallowRef } from "vue";
import type { AMap, Options, MapOptions, Map, PluginName } from "../types";

// 示例文档：https://lbs.amap.com/demo/list/js-api-v2

export function useAMap(options?: Options) {
	const { options: config } = module.get("amap");

	const AMap = shallowRef() as Ref<AMap>;
	const map = shallowRef<Map>();

	// 初始化加载
	AMapLoader.load(
		merge(
			{
				key: config.key,
				version: "2.0",
				plugins: []
			},
			options
		)
	)
		.then((res) => {
			AMap.value = res;
		})
		.catch((err) => {
			console.error(err);
		});

	// 创建地图
	function createMap(element: string | HTMLDivElement, options?: MapOptions) {
		map.value = new AMap.value.Map(
			element,
			merge(
				{
					resizeEnable: true
				},
				options
			)
		);
	}

	// 使用默认插件
	function usePlugins(...names: PluginName[]) {
		names.forEach((e) => {
			plugins[e]?.();
		});
	}

	// 默认插件的配置
	const plugins = {
		"AMap.Geolocation"() {
			const { plugin, Geolocation, Pixel } = AMap.value;

			plugin("AMap.Geolocation", function () {
				const geolocation = new Geolocation({
					// 是否使用高精度定位，默认：true
					enableHighAccuracy: true,
					// 设置定位超时时间，默认：无穷大
					timeout: 10000,
					// 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
					buttonOffset: new Pixel(10, 20),
					//  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
					zoomToAccuracy: true,
					//  定位按钮的排放位置,  RB表示右下
					buttonPosition: "RB"
				});

				geolocation.getCurrentPosition();
			});
		}
	};

	return {
		AMap,
		map,
		createMap,
		usePlugins
	};
}
