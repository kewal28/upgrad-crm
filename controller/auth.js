const becript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

//Login
exports.signin = async (req, res) => {
    //Check userid is valid
    const user = await userModel.findOne({userId: req.body.userId});
    console.log(user);
    if(user == null) {
        return res.status(400).send({
            message : "User not found!!"
        });
    }

    if(user.userStatus != "APPROVED") {
        return res.status(400).send({
            message : "User is not approved yet. Please try again in some time."
        });
    }

    const isPasswordMatch = becript.compareSync(req.body.password, user.password);
    if(!isPasswordMatch){
        return res.status(400).send({
            message : "Please provide a valid password."
        })
    }

    const token = jwt.sign({id: user.userId}, "SECRECT CODE", {
        expiresIn: 600
    });

    //Create Response
    const loginResp = {
        name : user.name,
        userId : user.userId,
        email : user.email,
        userType : user.userType,
        userStatus : user.userStatus,
        accessToken: token
    }
    res.status(201).send(loginResp);

}

//Signup
exports.signup = async (req, res)  => {
    console.log(req.body);
    //User Object
    const userObj = {
        name: req.body.name,
        userId: req.body.userId,
        email: req.body.email,
        userType: req.body.userType,
        password: becript.hashSync(req.body.password, 8),
        userStatus: req.body.userStatus
    }

    //Insert into DB
    const userCreated = await userModel.create(userObj);
    
    //Create Response
    const signupResp = {
        name : userCreated.name,
        userId : userCreated.userId,
        email : userCreated.email,
        userType : userCreated.userType,
        userStatus : userCreated.userStatus,
        createdAt : userCreated.createdAt,
        updatedAt : userCreated.updatedAt
    }
    res.status(201).send(signupResp);
}