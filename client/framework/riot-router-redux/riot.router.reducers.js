let initialRouteData = {
    $prev_state: '/',
    $prev_location: '/',
    $state: '/',
    $location: '/',
    $protocol: 'http://',
    $host: location.host,
    data: {},
    stack: []
};
const route = (route= initialRouteData, action) => {
    switch (action.type) {
        case '$route':
            return Object.assign({}, route, {
                $prev_state: route.$state,
                $prev_location: route.$location,
                $state: action.payload.route.$state,
                $location: action.payload.route.$location,
                $protocol: action.payload.route.$protocol || route.$protocol,
                $host: route.$host,
                data: action.payload.route.ctx,
                stack: [...route.stack, route.$state]
            });
        case '$query':
            return Object.assign({}, route, {
                $prev_state: route.$state,
                $prev_location: route.$location,
                $state: route.$state,
                $location: route.$location,
                $protocol: route.$protocol,
                $host: route.$host,
                data: Object.assign({},
                    {
                        request: {
                            body: route.data.request.body,
                            params: route.data.request.params,
                            query: action.payload,
                        }
                    }
                ),
                stack: [...route.stack]
            })
        case '$routeBusy':
            return Object.assign({}, route, {busy: true});
        case '$routeUnBusy':
            return Object.assign({}, route, {busy: false});
        default:
            return route;
    }
};
export default {route}