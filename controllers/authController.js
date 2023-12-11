
import connection from "../utils/database.js";

function getLogin(req, res, next) {

    const { email, password } = req.body;

    if(!email || !password) {
        res.status(200).json({
            success : false,
            message : "failed login"
        });
    }

    else res.status(200).json({
        success : true,
        message : req.body
    });
}

function getUser(req, res, next) {
      // simple query
    connection.execute('SELECT * FROM accounts')
        .then(([data,fields])=>{
            res.status(200).json({
                success : true,
                message : data
            });
        }).catch((error)=>{
            console.log(error);
        });
}

export { getLogin, getUser}