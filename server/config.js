const config = {
    sqlserver: {
        user:'abc',
        password:'123456',
        server:'192.168.2.83',
        database:'voxel'
    },
    debug:true,
    port:3000,
    public: 'public',
    upload: 'public/',
    ljlxconfig: __dirname+'/lxc-LXGridMain.txt',
    ljlxkey: __dirname+'/lxnodemodules/_.ljlx.com.key',
    ljlxcert: __dirname+'/lxnodemodules/_.ljlx.com.crt'
};

module.exports = config;