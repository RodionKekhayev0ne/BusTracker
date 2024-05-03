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
const locationDB = require('./models/location');
const router = express.Router();

router.use(bodyParser.json());

router.get('/all/children', async (req, res) => {
    ChildDb.find({}).then(data => {
            res.status(201).json({students: data});
    });
});

router.get('/all/parents', async (req, res) => {
    ParentDb.find({}).then(data => {
        res.status(201).json({parents: data});
});
});

router.get('/all/drivers', async (req, res) => {
    DriverDb.find({}).then(data => {
        res.status(201).json({drivers: data});
});
});

router.post('/update/child', async (req, res) => {
    const {child_id, update_data} = req.body;
        
    ChildDb.findById(child_id).then(async data =>{
        if(data){
           
            locationDB.findById(data.home_point).then(async homedata =>{
                if(homedata){
                for (const key in update_data) {
                    if (homedata[key] !== update_data[key]) {
                        homedata[key] = update_data[key];
                    }
                }
                const updatedlocation = await homedata.save(); 
                }
            });
            
            for (const key in update_data) {
           
                if (data[key] !== update_data[key]) {
                    data[key] = update_data[key];
                }
              }
             
            const updatedRecord = await data.save();
            res.status(200).json({ update_success: true, updated_user: updatedRecord});
        }else{
            res.status(404).json({update_success: false, message: 'Child not found' });
        }



    });


});

router.post('/update/driver', async (req, res) => {
    const {driver_id, update_data} = req.body;
        
    DriverDb.findById(driver_id).then(async data =>{
        if(data){
           
            for (const key in update_data) {
                if (data[key] !== update_data[key]) {
                    data[key] = update_data[key];
                }
              }
            const updatedRecord = await data.save();
            res.status(200).json({ update_success: true, updated_user: updatedRecord});
        }else{
            res.status(404).json({update_success: false, message: 'Driver not found' });
        }
    });

});

router.post('/update/parent', async (req, res) => {
    const {parent_id, update_data} = req.body;
        
    ChildDb.findById(parent_id).then(async data =>{
        if(data){
           
            for (const key in update_data) {
                if (data[key] !== update_data[key]) {
                    data[key] = update_data[key];
                }
              }
            const updatedRecord = await data.save();
            res.status(200).json({ update_success: true, updated_user: updatedRecord});
        }else{
            res.status(404).json({update_success: false, message: 'Parent not found' });
        }
    });
});

router.post('/delete/child', async (req, res) => {
    const {child_id, } = req.body;
    ChildDb.findByIdAndDelete(child_id).then(async data => {
        if(data){
            
            res.status(200).json({Deleted: true});
        }
       
    });
});

router.post('/delete/parent', async (req, res) => {
    const {parent_id} = req.body;
    ParentDb.findByIdAndDelete(parent_id).then(async data => {
        if(data){
            res.status(200).json({Deleted: true});
        }
});
});

router.post('/delete/driver', async (req, res) => {
    const {driver_id} = req.body;
    DriverDb.findByIdAndDelete(driver_id).then(async data => {
        if(data){
            res.status(200).json({Deleted: true});
        }
});
});

router.post('/example', async (req, res) => {

});




module.exports = router;