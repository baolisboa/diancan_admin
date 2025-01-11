export declare type PluginName =
	| "AMap.ElasticMarker"
	| "AMap.ToolBar"
	| "AMap.Scale"
	| "AMap.HawkEye"
	| "AMap.ControlBar"
	| "AMap.MapType"
	| "AMap.Geolocation"
	| "AMap.AutoComplete"
	| "AMap.PlaceSearch"
	| "AMap.DistrictSearch"
	| "AMap.LineSearch"
	| "AMap.StationSearch"
	| "AMap.Driving"
	| "AMap.TruckDriving"
	| "AMap.Transfer"
	| "AMap.Walking"
	| "AMap.Riding"
	| "AMap.DragRoute"
	| "AMap.Geocoder"
	| "AMap.CitySearch"
	| "AMap.IndoorMap"
	| "AMap.MouseTool"
	| "AMap.CircleEditor"
	| "AMap.PolygonEditor"
	| "AMap.PolylineEditor"
	| "AMap.RectangleEditor"
	| "AMap.EllipseEditor"
	| "AMap.BezierCurveEditor"
	| "AMap.MarkerCluster"
	| "AMap.RangingTool"
	| "AMap.CloudDataSearch"
	| "AMap.Weather"
	| "AMap.HeatMap";

export declare type LngLat = [number, number];

export declare interface Options {
	plugins: PluginName[];
	[key: string]: any;
}

export declare interface AMap {
	plugin: (name: string, cb: () => void) => void;
	[key: string]: any;
}

export declare type MapEventName =
	| "resize"
	| "complete"
	| "click"
	| "dblclick"
	| "mapmove"
	| "hotspotout"
	| "movestart"
	| "moveend"
	| "zoomchange"
	| "zoomstart"
	| "zoomend"
	| "rotatechange"
	| "rotatestart"
	| "rotateend"
	| "mousemove"
	| "mousewheel"
	| "mouseover"
	| "mouseout"
	| "mouseup"
	| "mousedown"
	| "rightclick"
	| "dragstart"
	| "dragging"
	| "dragend"
	| "touchstart"
	| "touchmove"
	| "touchend";

export declare interface Map {
	on: (name: MapEventName, cb: () => void) => void;
	resize(): void;
	center(center: LngLat, immediately?: boolean, duration?: number): void;
	setCenter(center: LngLat, immediately?: boolean, duration?: number): void;
	zoom(zoom: number, center?: LngLat, immediately?: boolean, duration?: number): void;
	destroy(): void;
	clearMap(): void;
	setCity(name: string): void;
	[key: string]: any;
}

export declare interface MapOptions {
	center?: LngLat;
	zoom?: number;
	zooms?: [number, number];
	rotation?: number;
	pitch?: number;
	viewMode?: "2D" | "3D";
	terrain?: boolean;
	features?: ("bg" | "point" | "road" | "building")[];
	layers?: any[];
	dragEnable?: boolean;
	zoomEnable?: boolean;
	jogEnable?: boolean;
	pitchEnable?: boolean;
	rotateEnable?: boolean;
	animateEnable?: boolean;
	keyboardEnable?: boolean;
	doubleClickZoom?: boolean;
	scrollWheel?: boolean;
	touchZoom?: boolean;
	touchZoomCenter?: boolean;
	showLabel?: boolean;
	defaultCursor?: string;
	isHotspot?: boolean;
	mapStyle?: any;
	wallColor?: string | number[];
	roofColor?: string | number[];
	showBuildingBlock?: boolean;
	showIndoorMap?: boolean;
	skyColor?: string | number[];
	labelRejectMask?: boolean;
	mask?: number[];
	WebGLParams?: any;
	[key: string]: any;
}
