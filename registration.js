const dbconect = require('./dbconect')
const {dbservice} = require('./dbservice')
const {createAdmin} = require('./dbservice')
const mongoose = require('mongoose');

const AdminDb = require('./models/admin');
const ParentDb = require('./models/parent');
const DriverDb = require('./models/driver');
const ChildDb = require('./models/child');
const LocationDB = require('./models/location');


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Admin } = require('mongodb');


const {use} = require("express/lib/router");
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));



router.post('/register/admin/', async (req, res) => {
    try {

        const { username,phone_number, password} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);


        const token = jwt.sign({ username }, 'your_secret_key');

        adminData = {
            full_name: username,
            password:hashedPassword,
            phone_number:phone_number,
            token: token
        }

        const newAdmin = await AdminDb.create(adminData);


        // Отправляем токен и сообщение об успешной регистрации
        res.status(201).json({ token, message: 'Registration admin successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/register/driver/', async (req, res) => {
    try {
        // Получаем данные из тела запроса
        const { username, password, phone_number} = req.body;

        // Хэшируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем JWT токен
        const token = jwt.sign({ username }, 'your_secret_key');

        driverData = {
            full_name: username,
            phone_number: phone_number,
            password:hashedPassword,
            token: token
        }

        const newDriver = await DriverDb.create(driverData);
        // Отправляем токен и сообщение об успешной регистрации
        res.status(201).json({ token, message: newDriver });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/register/parent/', async (req, res) => {

    let parentData;
    try {
        // Получаем данные из тела запроса
            const {username, password,phone_number, child_id} = req.body;

        // Хэшируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем JWT токен
        const token = jwt.sign({username}, 'your_secret_key');

        YourChild = null;

        parentData = {}

        ChildDb.findOne({id_num: child_id}).then( async childt => {
            if (childt) {
                console.log(childt)
                parentData = {
                    full_name: username,
                    password: hashedPassword,
                    phone_number: phone_number,
                    child: childt,
                    token: token,
                }
            } else {
                console.error('Не удалось получить объект базы данных');
            }
            const newParent = await ParentDb.create(parentData);
        });
            res.status(201).json({token, message: 'Registration parent successful'});
        } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
});


// Роут для регистрации
router.post('/register/child/', async (req, res) => {
    try {
        // Получаем данные из тела запроса
        const { username, password,id_num, address, lg, lt} = req.body;

        // Хэшируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем JWT токен
        const token = jwt.sign({ username }, 'your_secret_key');

        home_data = {
            latitude: lt,
            longitude: lg,
        }
        const home = await LocationDB.create(home_data);
        // let new_home_point= null;
        // home.save()
        //     .then((home) => {
        //         // Получение идентификатора новой записи
        //         new_home_point = home.id;})

        childData = {
            full_name: username,
            password:hashedPassword,
            address: address,
            id_num:id_num,
            home_point: home,
            token: token
        }

        const newChild = await ChildDb.create(childData);
        // Отправляем токен и сообщение об успешной регистрации
        res.status(201).json({ token, message: 'Registration child successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
