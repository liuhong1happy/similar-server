export default (path = '/', handler, plugings = []) => {
    if(Array.isArray(handler) && handler.length>0) {
         return {
             path,
             children: handler,
             type: 'router',
             plugings
         }
    }
    if(typeof handler === 'function') {
        return {
            path,
            children: [handler],
            type: 'router',
            plugings
        }
    }
    if(typeof handler === 'object' && handler.handle) {
        return {
            path,
            children: [handler],
            type: 'router',
            plugings
        }
    }
    throw new Error('Router必须有handler参数，且参数类型为Route数组或者http request处理函数!');
}