const User = require("../model/user");
require("dotenv").config();
const nodemailer= require("nodemailer");

exports.getUser = async(req,res)=>{
    try {
        const users = await User.find();
        return res.status(200).json({
            sucess:true,
            data:users,
            message:'User Data is fetched'
        });
      } catch (err) {
        return res.status(500).json({
            sucess:false,
            message: err.message,

        });
      }
}

exports.postUser = async(req,res)=>{
    try {
        const user = new User({
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            hobbies: req.body.hobbies
        });
        console.log(user);
        const newUser = await user.save();
        res.status(201).json({
            sucess:true,
            message:"user add suceessfully"
        });
    } catch (err) {
        res.status(500).json({ message: "not be create"});
    }
}
exports.getUpdate=async(req,res)=>{
    try {
        const { id } = req.params;
        const user = await User.findById({_id:id});
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        user.name = req.body.name;
        user.phoneNumber = req.body.phoneNumber;
        user.email = req.body.email;
        user.hobbies = req.body.hobbies;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
}

exports.getDelete =async(req,res)=>{
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
}


exports.sendEmail = async(req,res)=>{
    const { email, subject, text } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER, // Replace with your email
        pass: process.env.MAIL_PASS // Replace with your password
      }
    });
  
    const mailOptions = {
      from: process.env.MAIL_USER, // Replace with your email
      to: email,
      subject: subject,
      text: text
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending email' });
    }
  
}