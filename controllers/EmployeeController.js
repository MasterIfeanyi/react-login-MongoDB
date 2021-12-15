const {registerValidation} = require("./validation")
const User = require("../models/User")



//show the list of employees
//fetch from database
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        if(!users) throw Error("No items");
        return res.json({users})
    } catch (err) {
        res.status(400).json({ "msg": err });
    }
}


//save user
const saveUser = async (req, res) => {
    const { error } = registerValidation(req.body);
    let data = { name: req.body.name, email: req.body.email, password: req.body.password };
    
    const newUser = new User(data)
    
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        try {
            const user = await newUser.save();
            if (!user) throw Error("something wrong");
            res.redirect("/")
        } catch (err) {
            return res.status(400).json({"msg" : err})
        }
    }
}


//update a user
const updateUser = async (req, res) => {
    const { error } = registerValidation(req.body);

    let data = { name: req.body.name, email: req.body.email, password: req.body.password }
    const userId = req.body._id;

    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        try {
            const user = await User.findByIdAndUpdate(userId, { $set: data });
            if (!user) throw Error("Something went wrong while updating the post"); 
            res.redirect("/")
        } catch (err) {
            res.status(400).json({ "msg": err });
        }
    }
}

//delete a user
const deleteUser = async (req, res) => {
    const userId = req.params.userId
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) throw Error("No such item");
    } catch (err) {
        res.status(400).json({ "msg": err });
    }
}

module.exports = {getUsers, saveUser, updateUser, deleteUser}