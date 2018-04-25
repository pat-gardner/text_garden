//style.js
const style = {
    messageList: {
        border:'1px solid #f1f1f1',
        padding:'0 12px',
        maxHeight:'70vh',
        overflow:'scroll'
    },
    message: {
        backgroundColor:'#fafafa',
        margin:'10px',
        padding:'3px 10px',
        fontSize:'.85rem'
    },
    loginForm: {
        margin:'10px',
        display:'flex',
        flexFlow:'row wrap',
        justifyContent:'space-between'
    },
    loginFormUser: {
        minWidth:'150px',
        margin:'3px',
        padding:'0 10px',
        borderRadius:'3px',
        height:'40px',
        flex:'2'
    },
    loginFormPass: {
        flex:'4',
        minWidth:'400px',
        margin:'3px',
        padding:'0 10px',
        height:'40px',
        borderRadius:'3px'
    },
    shopForm: {
        margin:'10px',
        display:'flex',
        flexFlow:'row wrap',
        justifyContent:'space-between',
        maxWidth: '150px'
    },
    shopFormUser: {
        minWidth:'100px',
        margin:'3px',
        padding:'0 10px',
        borderRadius:'3px',
        height:'40px',
        flex:'2'
    },
    itemList: {
        // border:'1px solid #f1f1f1',
        padding:'0 12px',
        maxHeight:'200px',
        // overflow:'scroll',
        display: 'flex',
        flexDirection: 'column',
        wrap:'nowrap'
    }
}
module.exports = style;
