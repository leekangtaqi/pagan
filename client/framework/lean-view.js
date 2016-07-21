const rendererCreator = (router) => {
    let renderer = {
        enter: (tag, from, callback)=> {
            if(!tag){
                return;
            }
            tag.trigger('enter', from);
            tag.show = true;
            tag.hidden = false;
            tag.update();
        },

        leaveUpstream: tag => {
            if(!tag || !tag.parent || !tag.parent.tags){
                return;
            }
            Object.keys(tag.parent.tags)
            .map(k => tag.parent.tags[k])
            .filter(t => t != tag)
            .forEach(t=>{
                if(t && t.show){
                    renderer.leaveDownstream(t, tag)
                }
            });
            return renderer.leaveUpstream(tag.parent);
        },

        leaveDownstream: (tag, parent) => {
            if(!tag){
                return;
            }
            renderer.leave(tag, parent);
            if(tag.tags && Object.keys(tag.tags).length){
                Object.keys(tag.tags).forEach(tagName=>{
                    let t = tag.tags[tagName];
                    if(t && t.show && !t.cache){
                        renderer.leave(t, tag);
                        return renderer.leaveDownstream(t, tag)
                    }
                })
            }
        },

        leave: (tag, to, callback) => {
            if(!tag){
                return;
            }
            tag.trigger('leave', to);
            if(tag.hasOwnProperty('show')){
                tag.show = false;
                tag.hidden = true;
                tag.update();
            }
        },

        init: (tag)=> {
            tag.hidden = true;
            tag.show = false;
        }
    };
    router.on('history-resolve', (source, target, ctx, hints, next)=>{
        let sourceTag = source && source.tag || null;
        let targetTag = target && target.tag || null;
        renderer.enter(targetTag, sourceTag);
        renderer.leaveUpstream(targetTag)
        next();
    });
    return　renderer;
};

export default rendererCreator;

