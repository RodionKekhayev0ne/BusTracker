const dbconect = require('./dbconect')
const {dbservice} = require('./dbservice')
const {createAdmin} = require('./dbservice')
const mongoose = require('mongoose');
const AdminDb = require('./models/admin');
const ParentDb = require('./models/parent');
const DriverDb = require('./models/driver');
const ChildDb = require('./models/child');
const Transport_listDb = require('./models/transport_list');
const express = require('express');
const {Model} = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const LocationDB = require("./models/location");
const router = express.Router();
const app = express();




router.post('/create/transportlist/', async (req, res) => {

    let transportData
    try {
        const {driver_number, lt, lg} = req.body;
        transportData = {}
        DriverDb.findOne({phone_number: driver_number}).then(async drivert => {
            if (drivert) {
                console.log(drivert)
                location = {
                    latitude: lt,
                    longitude: lg,
                }
                const transportLocation = await LocationDB.create(location);
                transportData = {
                    driver: drivert,
                    children: [],
                    location: transportLocation,
                    is_transporting: false,
                }
            } else {
                console.error('Не удалось получить объект базы данных');
            }
            const newTransportList = await Transport_listDb.create(transportData);
            // console.log(newTransportList)
            // res.status(201).json({transport: newTransportList});
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'});
    }
});



router.post('/transport/setStudent', async (req, res) => {
    const {child_id, list_id} = req.body;
    ChildDb.findOne({id_num: child_id}).then( async childt => {
        if (childt) {
            console.log(childt)
            Transport_listDb.findById(list_id).then( async list => {
                if (list) {
                    list.children.push(childt)
                    updatedlist = await Transport_listDb.updateOne(list)
                    res.status(200).json({update: updatedlist});
                } else {
                    console.error('Не удалось получить объект базы данных');
                }
            });
        } else {
            console.error('Не удалось получить объект базы данных');
        }
    });
});

router.post('/transport/delivered', async (req, res) => {
    const {child_id, list_id} = req.body;
    ChildDb.findOne({id_num: child_id}).then( async childt => {
        if (childt) {
            console.log(childt)
            Transport_listDb.findById(list_id).then( async list => {
                if (list) {
                    const indexToRemove = list.children.indexOf(childt._id);
                    if (indexToRemove !== -1) {
                        list.children.splice(indexToRemove, 1); // Удаление элемента по индексу
                        updatedlist = await Transport_listDb.updateOne(list)
                        res.status(200).json({Student_status: "Student delivered"});
                    } else {
                        console.log('Тег для удаления не найден в списке');

                    }



                } else {
                    console.error('Не удалось получить объект базы данных');
                }
            });
        } else {
            console.error('Не удалось получить объект базы данных');
        }
    });
});

router.post('/transport/start', async (req, res) => {
    const {transport_id} = req.body;
     Transport_listDb.findById(transport_id).then( async list => {
        if (list) {
            list.is_transporting = true;
            updatedlist = await Transport_listDb.updateOne(list)
            res.status(200).json({update: updatedlist});
        } else {
            console.error('Не удалось получить объект базы данных');
        }
    });

});

router.post('/transport/end', async (req, res) => {
    const {transport_id} = req.body;
    Transport_listDb.findById(transport_id).then( async list => {
        if (list) {
            updatedlist = await Transport_listDb.deleteOne(list)
            res.status(200).json({update: updatedlist});
        } else {
            console.error('Не удалось получить объект базы данных');
        }
    });

});

router.post('/transport/movement', async (req, res) => {
    const {location_id, lg, lt} = req.body;
    LocationDB.findById(location_id).then( async location => {
        if (location) {
            location.latitude = lt;
            location.longitude = lg;
            updatedMovement = await LocationDB.updateOne({ _id: location._id }, location)
            res.status(200).json({update: updatedMovement});
        } else {
            console.error('Не удалось получить объект базы данных');
        }
    });

});

router.get('/transport/students', async (req, res) => {
    const {transport_id} = req.body;
    Transport_listDb.findById(transport_id).then( async list => {
        if (list) {
            res.status(200).json({students: list.children});
        } else {
            console.error('Не удалось получить объект базы данных');
        }
    });
});

router.post('/student/home', async (req, res) => {
    const {child_id} = req.body;
    ChildDb.findById(child_id).then( async child => {
        if (child) {
            LocationDB.findById(child.home_point).then( async location => {
                if(location){
                    res.status(200).json({student_location: location});
                }
            })
       
        } else {
            console.error('Не удалось получить объект базы данных');
        }
    });
});



router.post('/auth/parent', async (req, res) => {
    const {number, password} = req.body;

    ParentDb.findOne({phone_number: number}).then( async parent => {
        if(parent){
            bcrypt.compare(password, parent.password,(err, result)=>{
                if(err){
                    res.status(403).json({
                        access:false,
                        cause: "Incorrect values (password or phone_number)"
                       });
                }
                if(result){     


                console.log("success");
                ChildDb.findById(parent.child).then(async child => {
                        Transport_listDb.find({}).then(data =>{
                            data.forEach((list)=>{
                                if (list.children.includes(parent.child)) {
                                    res.status(200).json({
                                        access:true,
                                        parent_data: parent,
                                        child_data: child,
                                        transport_data: list,
                                       });
                                       }else{
                                        res.status(200).json({
                                            access:true,
                                            parent_data: parent,
                                            child_data: child,
                                            transport_data: "No transportation now",
                                           });
                                       }
                                   })
                               });

                              
                
                        });
                }else{
                    res.status(403).json({
                        access:false,
                        cause: "Incorrect values (password or phone_number)"
                       });
                }
                    
             });
            
           
            }else{
                res.status(403).json({
                    access:false,
                    cause: "Parent not foud"
                   });
            } 
    })
        
});

router.post('/auth/admin', async (req, res) => {
    const {number, password} = req.body;
     AdminDb.findOne({phone_number: number}).then( async admin => {
        if(admin){
            bcrypt.compare(password, admin.password,(err, result)=>{
                if(err){
                    res.status(403).json({
                        access:false,
                        cause: "Incorrect values (password or phone_number)"
                       });
                }
                if(result){
                    
                    ChildDb.find({}).then( child =>{
                        DriverDb.find({}).then(driver =>{
                            Transport_listDb.find({}).then(async transport =>{
                                ParentDb.find({}).then(parent => {
                                    res.status(200).json({
                                        access:true,
                                        admin_data: admin,
                                        children_data: child,
                                        parents_data: parent,
                                        drivers_data: driver,
                                        transports_data: transport,
                                       });
                                })
                                
                            })
                        })
                    });
                    

                    
                }else{
                    res.status(403).json({
                        access:false,
                        cause: "Incorrect values (password or phone_number)"
                       });
                }
            }
        )}else{
            res.status(403).json({
                access:false,
                cause: "Admin not found"
               });
        }
    })
});

router.post('/auth/driver', async (req, res) => {
    const {number, password} = req.body;

    DriverDb.findOne({phone_number: number}).then( drivert => {
        if(drivert){
            bcrypt.compare(password, drivert.password,(err, result)=>{
                if(err){
                    res.status(403).json({
                        access:false,
                        cause: "Incorrect values (password or phone_number)"
                       });
                }
                if(result){
                    ChildDb.find({}).then(child =>{
                        
                        Transport_listDb.find({driver : drivert._id}).then(transport =>{
                            res.status(200).json({
                                access:true,
                                driver_data: drivert,
                                children_data: child,
                                transports_data: transport,
                               });
                        })
                    })

                }else{
                    res.status(403).json({
                        access:false,
                        cause: "Incorrect values (password or phone_number)"
                       });
                }
            }
        )}else{
            res.status(403).json({
                access:false,
                cause: "Driver not found"
               });
        }
    })
});



router.post('/example', async (req, res) => {

});


module.exports = router;