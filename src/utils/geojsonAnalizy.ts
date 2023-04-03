export enum GEOMETRY_TYPE {
    Point = "Point", //点坐标是按照x,y顺序的
    MultiPoint = "MultiPoint", //多点的坐标是位置数组
    LineString = "LineString", //两个或者多个position的数组
    MultiLineString = "MultiLineString", //线坐标数组的数组
    Polygon = "Polygon", // 封闭环形坐标的数组
    MultiPolygon = "MultiPolygon", // 面坐标数组
}
interface feature {
    type: string;
    geometry: {
        type: string;
        coordinates: number[];
    };
    properties: {
        [k: string]: any;
    };
}
interface geojson {
    type: string;
    features: feature[];
}
enum GEO_TYPE {}
export default {};
