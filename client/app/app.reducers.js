const mask = (mask = true, action) => {
    switch (action.type){
        case 'maskShow':
            mask = true;
            return mask;
        case 'maskHidden':
            mask = false;
            return mask;
        default:
            return mask;
    }
};

const title = (title = '91拼团', action) => {
    if(action.type=== 'changeTitle'){
        return title = action.payload
    }
    return title;
}

const showBar = (showBar = true, action) => {
    switch(action.type){
        case 'hideBar':
            return false;
        default:
            return showBar;
    }
}

const merchant = (merchant = {}, action) => {
    switch(action.type){
        case 'fetchMerchant':
            return Object.assign({}, merchant, action.payload);
        default: 
            return merchant;
    }
}
export default {mask, merchant, title, showBar}