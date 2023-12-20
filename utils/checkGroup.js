import connection from "./database.js";

//input params userId=string GroupName=array of string,[string,string]
export default async function checkGroup(userId, GroupName) {
    //get user data from database
    const [data, fields] = await connection.execute(`SELECT userGroup FROM accounts WHERE userId="${userId}";`);

    if (data.length == 0) {
        return false;
    }

    //get current user groups
    const userGroup = data[0]["userGroup"].split(",");
    //get intersection of user group and allowed group to see if user is authorized
    const authorizedGroup = GroupName.filter((value) => userGroup.includes(value));

    //if len>0 means user is authorized
    if (authorizedGroup.length > 0) {
        return true;
    }

    return false;
}
