//style.js
const style = {
    commentBox: {
        width:'80vw',
        margin:'0 auto',
        fontFamily:'Helvetica, sans-serif'
    },
    title: {
        textAlign:'center',
        textTransform:'uppercase'
    },
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
    commentFormPost: {
        minWidth:'75px',
        flex:'1',
        height:'40px',
        margin:'5px 3px',
        fontSize:'1rem',
        backgroundColor:'#A3CDFD',
        borderRadius:'3px',
        color:'#fff',
        textTransform:'uppercase',
        letterSpacing:'.055rem',
        border:'none'
    },
    updateLink: {
        textDecoration:'none',
        paddingRight:'15px',
        fontSize:'.7rem'
    },
    deleteLink: {
        textDecoration:'none',
        paddingRight:'15px',
        fontSize:'.7rem',
        color:'red'
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
