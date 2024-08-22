    const express = require('express');
    const router = express.Router();
    const userController = require('../mongo/user.Controller')
    const multer = require('multer');
    const UserModel = require('../mongo/user.model');





    // Tạo người dùng mới
    router.post('/add', async (req, res) => {
        try {
            const { name, email, pass } = req.body;
            const newUser = await userController.createUser({ name, email, pass });
            return res.status(201).json(newUser);
        } catch (error) {
            console.error('Error adding user: ' + error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Lấy tất cả người dùng
    router.get('/', async (req, res) => {
        try {
            const allUsers = await userController.getAllUsers();
            res.json(allUsers);
        } catch (error) {
            console.error('Error getting all users:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // Lấy người dùng theo ID 
    router.get('/users/:id', async (req, res) => {
        const userId = req.params.id;
        try {
            const user = await userController.getUserById(userId);
            res.json(user);
        } catch (error) {
            console.error('Error getting user by id:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // Xóa người dùng
    router.delete('/users/:id', async (req, res) => {
        const userId = req.params.id;
        try {
            const result = await userController.removeUser(userId);
            res.json(result);
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // Cập nhật người dùng
    router.put('/users/:id', async (req, res) => {
        const userId = req.params.id;
        const userData = req.body;
        try {
            const updatedUser = await userController.updateUser(userId, userData);
            res.json(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    router.post('/register', async (req, res, next) => {
        try {
          const body = req.body 
          const result = await userController.signIn(body)
          if (result) {
            res.status(200).json({ newUser: result, message: "Đã tạo tài khoản thành công",status: "OK" })
          }
          else {
            res.json({ message: "Email đã tồn tại" }) 
          }
        } catch (error) {
          res.status(500).json({ error: error })
          console.log("Lỗi " + error.message);
        }
      
      })


      router.post('/login', async (req, res) => {
        try {
          let body = req.body
          const result = await userController.login(body)
          if (result) {
            return res.status(200).json({result, message: "Đăng nhập thành công", status: "OK"})
          } else {
            res.json({ message: "Email hoặc khẩu không đúng" })   
          }
        } catch (error) {
          console.log(error);
        }
      })

    module.exports = router;
