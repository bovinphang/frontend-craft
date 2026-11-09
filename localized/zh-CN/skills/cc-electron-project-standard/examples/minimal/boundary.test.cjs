const test=require('node:test');const assert=require('node:assert/strict');
const {createSetTitle,createSetTitleDefective}=require('./boundary.cjs');
function fixture(){const calls=[],frame={url:'app://craft/index.html'};const sender={id:7,mainFrame:frame};return {calls,event:{sender,senderFrame:frame},handle:(process.env.CRAFT_EXAMPLE_DEFECTIVE==='1'?createSetTitleDefective:createSetTitle)({trustedContentsId:7,trustedUrl:frame.url,setTitle:title=>calls.push(title)})};}
test('trusted main frame can set a bounded title',()=>{const f=fixture();assert.deepEqual(f.handle(f.event,{title:'Document'}),{ok:true});assert.deepEqual(f.calls,['Document']);});
test('untrusted sender is rejected before side effects',()=>{const f=fixture();assert.throws(()=>f.handle({...f.event,sender:{...f.event.sender,id:9}},{title:'attack'}));assert.deepEqual(f.calls,[]);});
test('untrusted sender frame origin is rejected',()=>{const f=fixture();assert.throws(()=>f.handle({...f.event,senderFrame:{url:'https://untrusted.invalid/'}},{title:'attack'}));assert.deepEqual(f.calls,[]);});
test('malformed arguments are rejected before side effects',()=>{for(const value of [null,[],{}, {title:3},{title:''},{title:'x'.repeat(81)},{title:'ok',extra:true},{title:'line\nbreak'}]){const f=fixture();assert.throws(()=>f.handle(f.event,value));assert.deepEqual(f.calls,[]);}});
