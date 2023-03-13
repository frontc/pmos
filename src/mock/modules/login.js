export function login(){
    return {
        url:"login",
        method: "post",
        response: (opts)=>{
            const name = opts.data.account;
            return {
                code:200,
                msg:"",
                data:{
                    token:"mockToken",
                    name
                },
            };
        }
    };
}