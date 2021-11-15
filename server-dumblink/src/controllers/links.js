const { Links, Brands } = require("../../models");
const {nanoid} = require("nanoid")
const fs = require("fs");

exports.getBrands = async (req, res) => {
  try {
    let data = await Brands.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: Links,
          as: "links",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      order: [["createdAt", "DESC"]],
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return {
        ...item,
        image: process.env.FILE_PATH + item.image,
        links: [...item.links.map((itemLink) => {
          return {
            ...itemLink,
            image: process.env.FILE_PATH + itemLink.image
          }
        })]
      };
    });

    res.send({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getBrand = async (req, res) => {
  try {
    const { uniqueLink } = req.params;

    let data = await Brands.findOne({
      where: {
        uniqueLink,
      },
      include: [
        {
          model: Links,
          as: "links",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (data == null) {
      return res.status(404).send({
        status: "failed",
        message: "Brand Not Found",
      });
    }

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      image: process.env.FILE_PATH + data.image,
      links: [...data.links.map((itemLink) => {
        return {
          ...itemLink,
          image: process.env.FILE_PATH + itemLink.image
        }
      })]
    };

    res.send({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};


exports.addBrand = async (req, res) => {
  try {
    const userId = req.user.id;
    const imageBrand = req.files.imageBrand[0];
    const titleBrand = req.body.title;
    const descBrand = req.body.description

    let imageLink = req.files.imageLink;
    let parseLink = JSON.parse(JSON.stringify(imageLink))
    parseLink.splice(0,1);
    const titleLink = req.body.titleLink;
    const url = req.body.url

    let uniqueLink = nanoid(7);
    const checkBrand = await Brands.findOne({
      where: {
        uniqueLink,
      },
    });
    if (checkBrand) {
      uniqueLink = uniqueLink + nanoid(2);
    }

    const createBrand = await Brands.create({
      title: titleBrand,
      description: descBrand,
      userId: userId,
      uniqueLink,
      image: imageBrand.filename,
      viewCount: 0,
    })

    
    imageLink.map(async (item, index) => {
      await Links.create({
        image: item.filename,
        title: titleLink[index],
        url: url[index],
        brandId: createBrand.id
      })
    })

    return res.send({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const { uniqueLink } = req.params;
    const imageBrand = req?.files?.imageBrand[0];
    const titleBrand = req.body.title;
    const descBrand = req.body.description

    let imageLink = req?.files?.imageLink;
    let parseLink = JSON.parse(JSON.stringify(imageLink))
    parseLink.splice(0,1);
    const titleLink = req.body.titleLink;
    const url = req.body.url

    const createBrand = await Brands.update({
        title: titleBrand,
        description: descBrand,
        image: imageBrand?.filename,
      },
      {
        where: {
          uniqueLink
        }
      }
    )

    const dataBrand = await Brands.findOne({
      where: {
        uniqueLink,
      },
      include: [
        {
          model: Links,
          as: "links",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    })
    
    imageLink.map(async (item, index) => {
      if(dataBrand.links[index].id !== 0) {
        await Links.update({
          image: item?.filename,
          title: titleLink[index],
          url: url[index],
        }, {
          where: {
            id: dataBrand.links[index].id
          }
        })
      } else {
        await Links.create({
          image: item?.filename,
          title: titleLink[index],
          url: url[index],
          brandId: dataBrand.id
        })
      }
    })
    res.send({
      status: "success",
      message: `Update brand with uniqueLink: ${uniqueLink} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brandDB = await Brands.findOne({
      where: {
        id
      }
    })

    if (brandDB == null) {
      return res.status(404).send({
        status: "Failed",
        message: "Brand Not Found"
      })
    }

    // remove links image form server
    const links = await Links.findAll({
      where: {
        brandId: brandDB.id,
      },
    })

    links.map((item) => {
      fs.stat(`./uploads/${item.image}`, function (err, stats) {
        console.log(stats)
        if (err) {
          return console.error(err)
        }
        fs.unlink(`./uploads/${item.image}`, function (err) {
          if (err) return console.log(err);
          console.log("deleted links image successfully")
        })
      })
    })

    // remove brand image from server
    fs.stat(`./uploads/${brandDB.image}`, function (err, stats) {
      console.log(stats)
      
      if (err) {
        return console.error(err);
      }

      fs.unlink(`./uploads/${brandDB.image}`, function (err) {
        if (err) return console.log(err);
        console.log("deleted brand image successfully")
      })

    })

    await Brands.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `Delete link with id: ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};


exports.handleUpload = async (req, res) => {
	try {
		console.log("req-body", req.body);
		console.log("req-file", req.files);
		let imageName = null;
		if (!req.body.image) {
			imageName = req.files.image[0].filename;
		}

		res.send({
			status: "success",
			message: "Success upload Image",
			data: {
				imageName,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({
			status: "error",
			message: "Server Error",
		});
	}
};

exports.countVisit = async (req, res) => {
  try {
    const {id} = req.params;

    let dataBrand = await Brands.findOne({
      where: {
        id,
      }
    })

    await Brands.update(
      {
        viewCount: dataBrand.viewCount + 1
      },
      {
        where: {
          id
        }
      }
    )

    res.send({
      status: "success",
      message: "success update visit link",
      dataBrand
    })

  } catch (err) {
    console.log(err);
		res.status(500).send({
			status: "error",
			message: "Server Error",
		});
  }
}