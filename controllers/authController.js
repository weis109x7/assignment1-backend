
import connection from "../config/database.js";

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
    connection.query(
        'SELECT * FROM accounts',
        function(err, results, fields) {
        console.log(results); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
        res.status(200).json({
            success : true,
            message : results
        });
        }
    );
}

export { getLogin, getUser}