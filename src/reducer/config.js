const config = (state='ENABLE_MUSIC',action) => {
    switch(action.type){
        case 'CONFIG_SET':
            return action.value;
        default:
            return state;
    }
}

export default config;