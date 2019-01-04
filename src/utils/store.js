const store={
    local:{
        //获取localStorage 的数据
        get :function (name) {
            return localStorage.getItem(name)
        },
        //储存数据到获取localStorage
        set :function (name, val) {
            localStorage.setItem(name, JSON.stringify(val))
        },
        remove:function(key){
            localStorage.removeItem(key);
        }
    },
    sesstion:{
        //储存数据到sesstionStorage
        set: function (key, val) {
            if (val === undefined) {
                return store.session.remove(key);
            }
            store.session.storage.setItem(key, store.serialize(val));
            return val;
        },
        //获取sesstionStorage数据
        get: function (key, defaultVal) {
            var val = store.deserialize(store.session.storage.getItem(key));
            return (val === undefined ? defaultVal : val);
        },
        //清除数据
        remove: function (key) {
            store.session.storage.removeItem(key);
        },
        clear: function () {
            store.session.storage.clear();
        },
    }
}
    export default  store