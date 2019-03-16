var React = require('react');
var _ = require('lodash-compat');
import { Router, Route, IndexRoute, Redirect, IndexRedirect, createRoutes } from 'react-router';
import { isEmptyString } from '../../util/data';

const NODE = "node";
const FOLDER = "folder";
const MODEL = {
    "idField": "code",
    "showField": "label",
    "typeField": "type",
    "childrenField": "children"
};


/**
 * 查找folder下第一个是type是node的子节点返回
 */
function findRedirectNode(folder) {
    let node = null, list = folder[MODEL.childrenField];
    if (list && list.length > 0) {
        for (var i = 0; i < list.length; i++) {
            if (list[i][MODEL.typeField] == NODE) {
                node = list[i];
                break;
            } else if (list[i][MODEL.typeField] == FOLDER) {
                node = findRedirectNode(list[i]);
                if (node) {
                    break;
                }
            }
        }
    }
    return node;
}
/**
 * parse一个节点装载到routes中
 * @param node 需要解析的一个菜单model
 * @param routesMap menu与Component配置的映射
 * @param paths 所有绑定到Component的path的集合
 * @param customRoutes 自定义的routes的集合
 * @return 返回一个对象
 * {
 *          code:"console",
 *          path:"/console",
 *          redirect:"/post-review",
 *          children:[
 *              {
 *                  code:"post-review",
 *                  path:"/post-review",
 *                  component:Component
 *              },
 *              {
 *                  code:"post-list",
 *                  path:"/post-list",
 *                  component:Component,
 *                  custom:[
 *                      path:"/post-list/:id"
 *                  ]
 *              }
 *          ]
 *      }
 */
function fillRoute(node, routesMap, paths, customRoutes) {
    let route, customList = routesMap.custom || [];
    if (node[MODEL.typeField] == NODE) {
        //生成node
        route = {
            [MODEL.idField]: node[MODEL.idField],
            path: "/" + node[MODEL.idField],
            component: routesMap[node[MODEL.idField]],
        };
        //填充path
        paths.push({ path: route.path, [MODEL.idField]: route[MODEL.idField] });
        //填充自定义
        _.forEach(customList, function (child) {
            if (child[MODEL.idField] == route[MODEL.idField]) {
                customRoutes.push({
                    [MODEL.idField]: child[MODEL.idField],
                    path: child.path.substring(0, 1) != "/" ? ("/" + child.path) : child.path,
                    component: child.component
                });
                paths.push({
                    path: child.path.substring(0, 1) != "/" ? ("/" + child.path) : child.path,
                    [MODEL.idField]: route[MODEL.idField]
                })
            }
        });
    } else if (node[MODEL.typeField] == FOLDER) {
        //生成route 包含redirect 默认重定向到第一个是node的下级子节点
        let redirectNode = findRedirectNode(node);
        if (redirectNode) {
            route = {
                [MODEL.idField]: node[MODEL.idField],
                path: "/" + node[MODEL.idField],
                redirect: "/" + redirectNode[MODEL.idField]
            };
            if (routesMap[node[MODEL.idField]]) {
                route.component = routesMap[node[MODEL.idField]]
            }
            //遍历子节点填充
            let children = node[MODEL.childrenField], childRoute;
            children && _.forEach(children, function (childNode) {
                if (childNode[MODEL.typeField] == NODE || childNode[MODEL.typeField] == FOLDER) {
                    childRoute = fillRoute(childNode, routesMap, paths, customRoutes);
                    if (!route[MODEL.childrenField]) {
                        route[MODEL.childrenField] = [];
                    }
                    route[MODEL.childrenField].push(childRoute);
                }
            });
        } else {
            route = {
                [MODEL.idField]: node[MODEL.idField],
                path: "/" + node[MODEL.idField]
            };
            if (routesMap[node[[MODEL.idField]]]) {
                route.component = routesMap[node[MODEL.idField]]
            }
        }
    }
    return route;
}

/**
 * parse一个重定向节点装载到routes中
 * @param routesMap menu与Component配置的映射
 * @param paths 所有绑定到Component的path的集合
 * @param redirectRoutes 重定向 routes 的集合
 */
function fillRedirectRoute(routesMap, paths, redirectRoutes) {
    let redirectList = routesMap.redirect || [];
    _.forEach(redirectList, function (child) {
        const from = child.from.startsWith('/') ? child.from : `/${child.from}`;
        const to = child.to.startsWith('/') ? child.to : `/${child.to}`;
        redirectRoutes.push({
            [MODEL.idField]: from,
            path: from,
            redirect: to,
        });
        paths.push({
            [MODEL.idField]: from,
            path: from,
            redirect: to,
        })
    });
}

/**
 * 递归生成route
 */
function renderRoute(route, rootRoutes, pathMap) {
    let _route = {};
    if (route[MODEL.childrenField] && route[MODEL.childrenField].length > 0) {
        if (route.redirect) {
            _route = { [MODEL.idField]: route[MODEL.idField], path: parsePath(route.path, pathMap), childRoutes: [] };
            if (route.component) {
                if (isResumeComponent(route.component)) {
                    _route.getComponent = toComponent(route.component);
                } else {
                    _route.component = route.component;
                }
            }
            rootRoutes.push(createRoutes(<Redirect from={parsePath(route.path, pathMap)}
                to={parsePath(route.redirect, pathMap)} />)[0]);
            _.forEach(route[MODEL.childrenField], function (childRoute) {
                _route.childRoutes.push(renderRoute(childRoute, rootRoutes, pathMap));
            });
            return _route;
        } else {
            _route = {
                [MODEL.idField]: route[MODEL.idField],
                path: parsePath(route.path, pathMap),
                childRoutes: []
            };
            if (route.component) {
                if (isResumeComponent(route.component)) {
                    _route.getComponent = toComponent(route.component);
                } else {
                    _route.component = route.component;
                }
            }
            _.forEach(route[MODEL.childrenField], function (childRoute) {
                _route.childRoutes.push(renderRoute(childRoute, rootRoutes, pathMap));
            });
            return _route;
        }
    } else {
        if (route.redirect) {
            if (route.component) {
                _route = { [MODEL.idField]: route[MODEL.idField], path: parsePath(route.path, pathMap) };
                if (isResumeComponent(route.component)) {
                    _route.getComponent = toComponent(route.component);
                } else {
                    _route.component = route.component;
                }
            } else {
                _route = { [MODEL.idField]: route[MODEL.idField], path: parsePath(route.path, pathMap) };
            }
            _route.childRoutes = [];
            rootRoutes.push(createRoutes(<Redirect from={parsePath(route.path, pathMap)}
                to={parsePath(route.redirect, pathMap)} />)[0]);
        }
        _route = { [MODEL.idField]: route[MODEL.idField], path: parsePath(route.path, pathMap) };
        if (route.component) {
            if (isResumeComponent(route.component)) {
                _route.getComponent = toComponent(route.component);
            } else {
                _route.component = route.component;
            }
        }
        return _route;
    }
}
/**
 * 转换为需要的component
 */
function toComponent(component) {
    return (state, callback) => {
        //TODO 需要加进度条
        component().then(x => {
            callback(null, x);
        });
    };
}
/**
 * 是否是异步加载的component
 */
function isResumeComponent(component) {
    //如果有prototype 并且有render方法 则表示是react对象
    if (component && component.prototype && component.prototype.render) {
        return false;
    }
    return true;
}
/**
 * 查找某个 idField 对应的配置
 * @param idField
 * @param menu
 * @return 返回一个对象
 * {
 *  node: {} 节点
 *  top: true|false 是否是顶层节点
 * }
 */
function findNode(idField, menu) {
    if (idField && menu && menu.length > 0) {
        let result, top;
        let find = (folder, isTop) => {
            (folder || []).forEach(node => {
                if (node[MODEL.idField] === idField) {
                    result = node;
                    top = isTop;
                    return;
                } else if (node[MODEL.typeField] === FOLDER) {
                    find(node[MODEL.childrenField]);
                }
            });
        };
        find(menu, true);
        return { node: result, top };
    }
}

/**
 * 从pathMap中parse path
 */
function parsePath(path, pathMap) {
    let _path = path, _subpath = '';
    if (path.indexOf('/') == 0) {
        let source = path.substring(1, path.length);
        let index = source.indexOf('/');
        if (index === -1) {
            path = source;
        } else {
            path = source.substring(0, index);
            _subpath = source.substring(index, source.length);
        }
    }

    if (pathMap && !isEmptyString(pathMap[path])) {
        _path = pathMap[path];
    } else {
        _path = path;
    }
    if (_path.substring(0, 1) != "/") {
        _path = "/" + _path;
    }
    return _path + _subpath;
}
/**
 * 判断是否 url 与 route 的 path 相符
 * 通配符的规则如下。
 * :paramName 匹配URL的一个部分，直到遇到下一个/、?、#为止。这个路径参数可以通过this.props.params.paramName取出。
 * () 表示URL的这个部分是可选的。
 * * 匹配任意字符，直到模式里面的下一个字符为止。匹配方式是非贪婪模式。
 * ** 匹配任意字符，直到下一个/、?、#为止。匹配方式是贪婪模式。
 */
// <Route path="/hello/:name">         // matches /hello/michael and /hello/ryan
// <Route path="/hello(/:name)">       // matches /hello, /hello/michael, and /hello/ryan
// <Route path="/files/*.*">           // matches /files/hello.jpg and /files/hello.html
// <Route path="/**/*.jpg">            // matches /files/hello.jpg and /files/path/to/file.jpg
function isMatchRoute(pathname, path) {
    var regexp = path.replace(/\(([^\)]+)\)/g, '($1)?')
        .replace(/:[^\/\?#\(\)]+/g, '[^/?#()]+')
        .replace(/\*\*/g, '.+').replace(/\*([^*])/g, '[^$1]+$1');
    return (new RegExp(`^${regexp}$`, 'g')).test(pathname.replace(/(#|\?).*/, ''));
}

/**
 * 页面的主要内容
 * 接收四个参数
 * props.topRoutes 顶级路由与组件的映射
 * props.routes  层级菜单路由与组件的映射
 * props.menu    菜单树
 * props.history 路由的history对象
 * props.noFoundComponent 路由没有时的错误页面
 */
var Page = React.createClass({

    getDefaultProps: function () {
        return {
            showDefaultPath: true
        }
    },
    getInitialState() {
        if ('pathMap' in this.props) {
            console.warn('pathMap 属性将被废弃, 请使用 getPathMap');
        }
        let { app: App, menuModel } = this.props;
        Object.assign(MODEL, menuModel);
        this.content = (rootProps) => {
            let props = {};
            props.selected = this.selected;
            props.pathMap = this.pathMap;
            return <App menu={this.menu} {...props} {...rootProps} menuModel={MODEL} />;
        };
        return {};
    },
    /**
     * @return
     * {
     *  topRoutes:[{path:"/home",component:Component}],
     *  routes:[
     *      {
     *          code:"console",
     *          path:"/console",
     *          redirect:"/post-review",
     *          children:[
     *              {
     *                  code:"post-review",
     *                  path:"/post-review",
     *                  component:Component
     *              },
     *              {
     *                  code:"post-list",
     *                  path:"/post-list",
     *                  component:Component,
     *                  custom:[
     *                      path:"/post-list/:id"
     *                  ]
     *              }
     *          ]
     *      }
     *  ],
     *  paths:[{"path":"/post-list","selected":"post-list"},{"path:"/post-list/:id","selected":"post-list"}]
     * }
     */
    createRouter(_menu, routesMap, _topRoutes, nextState) {
        let router = {
            routes: [],
            paths: []
        }, hasInitPath = false;
        _topRoutes && _.forEach(_topRoutes, function (topRoute) {
            //是不是以/开头的
            let path = topRoute['path'];
            if (path == "/") {
                hasInitPath = true;
            }
        });
        let initRedirectNode, isTopPath = false;
        if (!hasInitPath) {
            let { getEntryNode } = this.props;
            if (getEntryNode && _.isFunction(getEntryNode)) {
                getEntryNode(nextState.location, _menu, (idField) => {
                    // add by liukaimei 170922, 判断返回的节点是否有效, 是否是顶层的节点
                    let { node = {}, top } = findNode(idField, _menu) || {};
                    if (node[MODEL.typeField] === NODE) {
                        initRedirectNode = node;
                        isTopPath = top;
                    } else if (node[MODEL.typeField] === FOLDER) {
                        initRedirectNode = findRedirectNode(node);
                    }
                });
            }
            if (!initRedirectNode) {
                for (var i = 0; i < _menu.length; i++) {
                    if (_menu[i][MODEL.typeField] === NODE) {
                        initRedirectNode = _menu[i];
                        isTopPath = true;
                        break;
                    } else if (_menu[i][MODEL.typeField] === FOLDER) {
                        initRedirectNode = findRedirectNode(_menu[i]);
                        if (initRedirectNode) break;
                    }
                }
            }
            if (initRedirectNode) {
                if (this.props.showDefaultPath && isTopPath) {
                    router.indexRoute = {
                        path: "/",
                        component: routesMap[initRedirectNode[MODEL.idField]],
                        [MODEL.idField]: initRedirectNode[MODEL.idField]
                    }
                } else {
                    let pathMap = this.getPathMap();
                    router.indexRoute = {
                        path: "/",
                        redirect: pathMap[initRedirectNode[MODEL.idField]] || '/' + initRedirectNode[MODEL.idField],
                        component: routesMap[initRedirectNode[MODEL.idField]]
                    };
                }
            }
        }
        var self = this, customRoutes = [], redirectRoutes = [];
        _menu && _.forEach(_menu, function (node) {
            if (!(self.props.showDefaultPath && router.indexRoute && (router.indexRoute[MODEL.idField] == node[MODEL.idField]))) {
                if (node[MODEL.typeField] == NODE || node[MODEL.typeField] == FOLDER) {
                    router.routes.push(fillRoute(node, routesMap, router.paths, customRoutes));
                }
            }
        });
        fillRedirectRoute(routesMap, router.paths, redirectRoutes);
        _.forEach(customRoutes, function (customRoute) {
            router.routes.push(customRoute);
        });
        _.forEach(redirectRoutes, function (redirectRoute) {
            router.routes.push(redirectRoute);
        });
        return router;
    },

    // 根据数据渲染Router树
    render: function () {
        let routes = {
            getChildRoutes: this.getChildRoutes
        };
        return (
            <Router history={this.props.history}>
                {routes}
            </Router>
        );
    },
    /**
     * 获得当前路由匹配到对应选中的menu code
     */
    getSelected(location) {
        let paths = location.pathname.split("/"), selected = "", pathMap = this.getPathMap();
        // add by liukaimei 171027, 有可能是 props.pathMap 直接传入的, 需要优先处理相等的, 其次对于 custom 定义的使用父code
        selected = (Object.keys(pathMap) || []).find(prop => location.pathname === pathMap[prop]);
        if (!selected) { // 父节点被 pathMap 了
            (Object.keys(pathMap) || []).forEach(prop => {
                if (location.pathname.startsWith(pathMap[prop]) && (!selected || selected.length < prop.length)) {
                    selected = prop;
                }
            });
        }
        if (selected) {
            return selected;
        }
        const index = this.router.routes.findIndex(v => isMatchRoute(location.pathname, v.path));
        if (index !== -1) { // add by liukaimei 180903, 如果是 custom 设置，应选中正确的父节点。
            return this.router.routes[index][MODEL.idField];
        }

        if (paths.length > 1) { // 没有经过 pathMap 配置
            selected = paths[1];
        }
        if (this.props.showDefaultPath) {
            if (location.pathname === "/" || location.pathname === "") {
                if (this.indexRoute && this.indexRoute[MODEL.idField]) {
                    selected = this.indexRoute[MODEL.idField];
                }
            }
        }
        return selected;
    },
    getPathMap() {
        let { showDefaultPath, getPathMap } = this.props;
        let pathMap = {};
        if (getPathMap && _.isFunction(getPathMap)) {
            // add by liukaimei 170922, 遍历每个node型节点, 如果返回为string, 则设置添加映射关系
            let find = (menu) => {
                (menu || []).forEach(node => {
                    if (node[MODEL.typeField] === NODE) {
                        getPathMap(node, this.menu, (res) => {
                            if (res && typeof (res) === 'string') {
                                pathMap[node[MODEL.idField]] = res.startsWith('/') ? res : '/' + res;
                            }
                        });
                    } else if (node[MODEL.typeField] === FOLDER) {
                        find(node[MODEL.childrenField]);
                    }
                });
            };
            find(this.menu);
        } else if ('pathMap' in this.props) {
            for (let [prop, value] of Object.entries(this.props.pathMap)) {
                pathMap[prop.startsWith('/') ? prop.slice(1) : prop] = value.startsWith('/') ? value : '/' + value;
            }
        }
        this.pathMap = _.clone(pathMap);
        if (showDefaultPath) {
            if (this.indexRoute && this.indexRoute[MODEL.idField]) {
                this.pathMap[this.indexRoute[MODEL.idField]] = "/";
            }
        }
        return pathMap;
    },
    getComponent(nextState, cb) {
        //获取menu 获取selected
        this.props.fetchMenu(nextState.location, (menu) => {
            this.menu = menu;
            this.selected = this.getSelected(nextState.location);
            cb(null, this.content);
        });
    },
    getChildRoutes(nextState, cb) {
        let { topRoutes } = this.props, routes = [];
        //FIXME 区分component或getComponent 用于处理异步加载
        topRoutes && _.forEach(topRoutes, (topRoute) => {
            let path = topRoute['path'], _route;
            if (path == "/") {
                _route = { path: "/", indexRoute: {} };
                if (topRoute.component) {
                    if (isResumeComponent(topRoute.component)) {
                        _route.indexRoute.getComponent = toComponent(topRoute.component);
                    } else {
                        _route.indexRoute.component = topRoute.component;
                    }
                }
                routes.push(_route);
            } else {
                if (path.substring(0, 1) != "/") {
                    path = "/" + path;
                }
                _route = { path: path };
                if (topRoute.component) {
                    if (isResumeComponent(topRoute.component)) {
                        _route.getComponent = toComponent(topRoute.component);
                    } else {
                        _route.component = topRoute.component;
                    }
                }
                routes.push(_route);
            }
        });
        //构建App 根route
        //routes.push(createRoutes(<Route path="" getComponent={this.getComponent} getChildRoutes={this.getAppChildRoutes}/>)[0]);
        this.props.fetchMenu(nextState.location, (menu) => {
            if (menu == this.menu) {
                routes.push(this.rootRoute);
            } else {
                this.menu = menu;
                let router = this.createRouter(menu, this.props.routes, this.props.topRoutes, nextState);
                this.router = router;
                this.rootRoute = {
                    getComponent: this.getComponent,
                    getChildRoutes: this.getAppChildRoutes
                };
                if (router.indexRoute) {
                    this.indexRoute = router.indexRoute;
                    if (router.indexRoute.redirect) {
                        routes.push(createRoutes(<Redirect from="/" to={router.indexRoute.redirect} />)[0]);
                    } else {
                        this.rootRoute.path = "/";
                        if (router.indexRoute.component) {
                            if (isResumeComponent(router.indexRoute.component)) {
                                this.rootRoute.indexRoute = { getComponent: toComponent(router.indexRoute.component) };
                            } else {
                                this.rootRoute.indexRoute = { component: router.indexRoute.component };
                            }
                        }
                    }
                }
                routes.push(this.rootRoute);

            }
            cb(null, routes);
        });

    },
    getAppChildRoutes(nextState, cb) {
        let routes = [], rootRoutes = [], pathMap = this.getPathMap(), _route;
        _.forEach(this.router.routes, (route) => {
            if (route.path == "/" && route.redirect) {
                if (route.component) {
                    _route = { [MODEL.idField]: route[MODEL.idField], path: parsePath(route.path, pathMap) };
                    if (route.component) {
                        if (isResumeComponent(route.component)) {
                            _route.getComponent = toComponent(route.component);
                        } else {
                            _route.component = route.component;
                        }
                    }
                    routes.push(_route);
                    routes.push(createRoutes(<Redirect form={parsePath(route.path, pathMap)}
                        to={parsePath(route.redirect, pathMap)} />)[0])
                } else {
                    routes.push({ [MODEL.idField]: route[MODEL.idField], path: parsePath(route.path, pathMap) });
                    routes.push(createRoutes(<Redirect form={parsePath(route.path, pathMap)}
                        to={parsePath(route.redirect, pathMap)} />)[0]);
                }
            } else {
                routes.push(renderRoute(route, rootRoutes, pathMap));
            }
        });
        _.forEach(routes, function (route) {
            rootRoutes.push(route);
        });
        if (this.props.noPermissionComponent) {
            for (let k of Object.keys(this.props.routes)) {
                if (k !== 'custom') {
                    rootRoutes.push({
                        path: '/' + k,
                        component: this.props.noPermissionComponent,
                    });
                }
            }
            if (this.props.routes.custom != null) {
                for (let r of this.props.routes.custom) {
                    rootRoutes.push({
                        path: r.path,
                        component: this.props.noPermissionComponent,
                    });
                }
            }
        }
        if (this.props.noFoundComponent) {
            rootRoutes.push({ path: "*", component: this.props.noFoundComponent });
        }
        cb(null, rootRoutes);
    }
});
export default Page;
