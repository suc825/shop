const base = {
    get() {
                return {
            url : "/",
            name: "ShopOnline",
            // 退出到首页链接
            indexUrl: 'http://localhost'
        };
            },
    getProjectName(){
        return {
            projectName: "网上商城购物系统"
        }
    }
}
export default base
