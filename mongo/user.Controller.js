const UserModel = require('./user.model');
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs');

module.exports = {createUser,getAllUsers,getUserById,removeUser,updateUser,signIn,login};

    async function createUser(body) {
        try {
            const { name, email, pass } = body;

            const newUser = new UserModel({
                name,
                email,
                pass
            });

            const result = await newUser.save();
            return result;
        } catch (error) {
            console.log('Error creating user:', error);
            throw error;
        }
    }

    async function getAllUsers() {
        try {
            const result = await UserModel.find();
            return result;
        } catch (error) {
            console.log("Error getting all users:", error);
            throw error;
        }
    }

    async function getUserById(id) {
        try {
            const user = await UserModel.findById(id);
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        } catch (error) {
            console.log("Error getting user by id:", error);
            throw error;
        }
    }

    async function removeUser(id) {
        try {
            const result = await UserModel.findByIdAndDelete(id);
            return result;
        } catch (error) {
            console.log("Error deleting user:", error);
            throw error;
        }
    }

    async function updateUser(id, body) {
        try {
            const { fullname, email, password, birthday } = body;

            const user = await UserModel.findById(id);
            if (!user) {
                throw new Error("User not found");
            }

            user.fullname = fullname;
            user.email = email;
            user.password = password;
            user.birthday = birthday;

            const result = await user.save();
            return result;
        } catch (error) {
            console.log('Error updating user:', error);
            throw error;
        }
    }
    
    async function signIn(body) {
        try {
            let { fullname, email, password, role, birthday} = body;
            let user = await UserModel.findOne({ email: email });
            if (user) {
                throw new Error(`User ${email} already exists`);
            }
            const salt = bcryptjs.genSaltSync(10);
            const hash = bcryptjs.hashSync(password, salt);
            user = new UserModel({ fullname, email, password: hash, role: role || 1, birthday });
            const result = await user.save();
            return result;
        } catch (error) {
            throw error;
        }
    }   
    
    async function login(body) {
        try {
            const {email, password} = body
            let user = await UserModel.findOne({email: email})
            if(!user) {
                throw new Error("Email chưa tạo")
            }
            const checkpass = bcryptjs.compareSync(password,user.password)
            if(!checkpass) {
                throw new Error("Sai Mật Khẩu")
            }
            delete user._doc.password
            const token = jwt.sign(
                {_id:user._id, email:user.email, role:user.role}, 
                "duong",
                {expiresIn: "1d"}
            )
            user = {...user._doc,token}
            return user
    
        } catch (error) {
            
        }
    }