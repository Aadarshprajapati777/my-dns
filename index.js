const dgram = require('dgram');
const dnsPacket = require('dns-packet');

const server= dgram.createSocket('udp4');

const db={
    'aadarsh.dev': {
        type: 'A',
        data: '1.2.3.4'
    },
    'blog.aadarsh.dev':{
        type: 'CNAME',
        data: 'hashnode.network'
    }
}
server.on('message', (msg, rinfo)=> {
        const incomingReq= dnsPacket.decode(msg);
        const ipFromDb= db[incomingReq.questions[0].name];

        const ans = dnsPacket.encode({
            id:  incomingReq.id,
            type: 'response',
            flags: dnsPacket.AUTHORITATIVE_ANSWER,
            questions: incomingReq.questions,
            answers: [{
                type: ipFromDb.type,
                class: 'IN',
                name: incomingReq.questions[0].name,
                data: ipFromDb.data
            }]
        })
        
        server.send(ans, rinfo.port, rinfo.address, (err)=> {
            if(err){
                console.log('error in sending response');
            }
        })



})

server.bind( 54, ()=> console.log('server is running on port 54 '))


