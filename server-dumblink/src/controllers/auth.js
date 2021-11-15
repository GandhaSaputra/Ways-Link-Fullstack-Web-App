const { Users } = require('../../models');

const Joi = require('joi');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {

    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(6).email().required(),
        password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);

    if(error){
        return res.status(400).send({
            status: 'error',
            message: error.details[0].message,
        });
    }

    try {
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const userExist = await Users.findOne({
          where: {
            email: req.body.email,
          },
        });

        if (userExist) {
          return res.status(400).send({
            status: "failed",
            message: "email already used",
          });
        }

        const newUser = await Users.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        const dataToken = {
            id: newUser.id
        }

        const token = jwt.sign(dataToken, process.env.SECRET_KEY)

        // const newTransaction = await transaction.create({
        //   idUser: newUser.id,
        //   transferProof: "-",
        //   remainingActive: 0,
        //   userStatus: "Not Active",
        //   paymentStatus: "-"
        // })

        // const newProfile = await profile.create({
        //   idUser: newUser.id,
        //   phone: "-",
        //   gender: "-",
        //   address: "-",
        //   userPhoto: "dummy.jpg"
        // })

        // const newUserBook

        res.status(200).send({
            status: 'success',
            data: {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              token
            }
        });
        
    } catch (error) {
        console.log(error);
        res.send({
            status: 'failed',
            message: 'Server Error',
        });
    }
}

exports.login = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().min(6).email().required(),
        password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).send({
            stasus: 'error',
            message: error.details[0].message,
        });
    }
    
    try {
        let userExist = await Users.findOne({
            where: {
                email: req.body.email,
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        });

        if(!userExist) {
          return res.status(400).send({
            stasus: 'failed login',
            message: 'Email and Password not match',
          });
        }

        // if (req.body.email != userExist.email){
        //   return res.status(400).send({
        //     stasus: 'failed login',
        //     message: 'Email Not Exist',
        //   });
        // }

        const isValid = await bcrypt.compare(req.body.password, userExist.password)

        if (!isValid) {
            return res.status(400).send({
                stasus: 'failed login',
                message: 'Email and Password not match',
            });
        }

        const dataToken = {
            id: userExist.id
        }

        const token = jwt.sign(dataToken, process.env.SECRET_KEY)

        // userExist = JSON.parse(JSON.stringify(userExist));

        // const bookCover = process.env.FILE_PATH + userExist.user.userBookLists[0].bookFile

        // userExist = {
        //   ...userExist,
        //     profile: {
        //         ...userExist.profile,
        //         userPhoto: process.env.FILE_PATH + userExist.profile.userPhoto,
        //       },
        // };

        res.send({
            status: 'success',
            message: `Welcome to Dumb Link ${userExist.name}`,
            data: {
              ...userExist.dataValues,
              token
            }
        });
        
    } catch (error) {
        console.log(error);
        res.send({
            status: 'failed',
            message: 'Server Error',
        });
    }
}

exports.checkAuth = async (req, res) => {
    try {
      const id = req.user.id;
  
      let dataUser = await Users.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      });
  
      if (!dataUser) {
        return res.status(404).send({
          status: "failed",
        });
      }

  
      res.send({
        status: "success...",
        data: {
          user: dataUser,
        },
      });
    } catch (error) {
      console.log(error);
      res.status({
        status: "failed",
        message: "Server Error",
      });
    }
};