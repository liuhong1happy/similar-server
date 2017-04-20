module.exports = (path, handler) => {
    if(Array.isArray(handler) && handler.length>0) {
         return {
             path,
             children: handler,
             type: 'route'
         }
    }
    if(typeof handler === 'function') {
        return {
            path,
            children: [handler],
            type: 'route'
        }
    }
    return {
        type: 'none'
    };
}