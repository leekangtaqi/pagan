let provider = null;
let stateToOptsMap = {}; // key: state, val: (tag , fn)

export const connect = (mapStateToOpts, mapDispatchToOpts) => {
    return tag => {
        let pv = provider || recurFindProvider(tag);
        if(mapStateToOpts){
            let opts = mapStateToOpts(pv.opts.store.getState(), tag.opts);
            let partStateList = filterPartState(mapStateToOpts);
            Object.keys(opts).map((opt, index) => {
                let partState = partStateList[index];
                !stateToOptsMap[partState] && (stateToOptsMap[partState] = []);
                stateToOptsMap[partState].push({prop: opt, tag, mapStateToOpts: mapStateToOpts.toString()});
            });
            Object.assign(tag.opts, opts);
        }
        if(mapDispatchToOpts){
            let opts = mapDispatchToOpts(pv.opts.store.dispatch, tag.opts);
            Object.assign(tag.opts, opts);
        }
    }
};

export const provide = store =>{
    var oldState = store.getState();
    return entry => {
        provider = entry;
        store.subscribe(() => {
            let currState = store.getState();
            let callback = null;
            Object.keys(currState).map(s => {
                if((oldState[s] !== currState[s]) && stateToOptsMap[s]) {
                    callback = v => {
                        let opts = (new Function('return func = ' + v.mapStateToOpts))()(currState, v.tag.opts);
                        let mutableOpts = Object.keys(opts)
                            .filter(opt => v.tag.opts[opt] !== opts[opt]);
                        if(mutableOpts && mutableOpts.length){
                            Object.assign(v.tag.opts, opts);
                            v.tag.update();
                        }
                    };
                    stateToOptsMap[s].forEach(callback);
                }
            });
            oldState = currState;
        })
    }
};

const recurFindProvider = tag => {
    if(!tag.parent) return tag;
    return recurFindProvider(tag.parent);
};

const filterPartState = fn => 
    fn.toString()
        .split('\n')
        .map(s => s.trim().match(/(state\.)(.*?)(?=\,|\.|$)/ig))
        .filter(s => s)
        .reduce((acc, curr)=>{ 
            curr=[curr[0].replace('state.', '')];
            return acc.concat(curr)}, []);
