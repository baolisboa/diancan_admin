import { ModuleConfig } from "/@/cool";

// 高德开放平台申请 https://lbs.amap.com/api/javascript-api-v2/guide/abc/amap-vue#s9
const key = "6bcafeb9b2d9aa597b248173d49cf649";
const security = "257fe97aa13d02f45561bc3953861283";

// @ts-ignore
window._AMapSecurityConfig = {
	securityJsCode: security
};

export default (): ModuleConfig => {
	return {
		label: "高德地图",
		author: "COOL",

		demo: [
			{
				name: "基础用法",
				component: () => import("./demo/base.vue")
			}
		],

		options: {
			key
		},

		components: [() => import("./components/select.vue"), () => import("./components/info.vue")]
	};
};
