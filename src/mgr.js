import React, {Component} from 'react';
import {MessageBox} from './ui/MessageBox';
import RaisedButton from 'material-ui/RaisedButton';
import {fetchJson,postJson} from './vox/fetch';
import {Global} from './global';
import ConfirmButton from './ui/confirm-button';

const styles = {margin:'6px'};
export default {
    open : function(lv,cb){
        postJson('/users/tops',{lv},(json)=>{
            if(json.result==='ok'){
                json.tops.sort((a,b)=>{
                    return a.blocks>b.blocks?1:-1;
                });
                let content = json.tops.map((item,index)=>{
                    return <RaisedButton label={item.blocks} onClick={()=>{
                        postJson('/users/xchg',{lv,blocks:item.blocks},(json2)=>{
                            if(json2.result==='ok'){
                                if(cb)cb();
                            }
                            else
                                MessageBox.show('ok',undefined,json2.result,()=>{});
                        });
                    }} primary={true} style={{width:'64px',margin:'3px'}}></RaisedButton>;
                });
                let deletes = json.tops.map((item,index)=>{
                    return <ConfirmButton label={item.blocks} onClick={()=>{
                        postJson('/users/deltop',{lv,blocks:item.blocks},(json2)=>{
                            if(json2.result==='ok'){
                                if(cb)cb();
                            }
                            else
                                MessageBox.show('ok',undefined,json2.result,()=>{});
                        });
                    }} secondary={true} style={{width:'64px',margin:'3px'}}></ConfirmButton>;
                });                
                MessageBox.show('ok',undefined,<div><div style={styles}>随机加载指定的解法</div>{content}<div style={styles}>删除指定的解法</div>{deletes}</div>,(result)=>{});
            }
        });
    }
};