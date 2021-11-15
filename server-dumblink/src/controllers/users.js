const { Users } = require("../../models");

exports.getUser = async (req, res) => {
  try {
      
      const dataUser = await Users.findOne({
          where: {
              id: req.user.id
          },
          attributes: {
              exclude: ['createdAt', 'updatedAt', 'password']
          }
      })

      res.send ({
          status: "Success",
          data: dataUser,
      })

  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    await Users.update(req.body, {
      where: {
        id: id,
      },
    });

    const user = await Users.findOne({
      where: {
        id: id,
      },
    });

    res.send({
      status: "Success",
      message: "Update Finished",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await Users.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `Delete User id: ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
