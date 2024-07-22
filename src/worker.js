let page

process.on('message', msg => {
    switch(msg.event) {
        case 'test':
            testProxy(msg.data)
            break;
        case 'page':
            page = msg.data
            break;
    }
})