const db = require("../models");
const Tutorial = db.tutorials;
const Op = db.sequelize.Op;

// Create and Save a Tutorial
exports.create = (req, res) => {
    // Validate request
    if(!req.body.title) {
        res.status(400).send( {
            message: "Content can not be empty"
        });
        return;
    }

    // Create Tutorial
    const tutorial = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    };

    // Save Tutorial to database
    Tutorial.create(tutorial)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occured while creating the tutorial."
            });
        });
};

// Retrieve all Tutorials from the database
exports.findAll = (req, res) => {
    const title = req.query.title;
    // var condition = title ? { title: { [Op.ilike]: `%${title}%` } } : null;
    var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;

    // find all query
    Tutorial.findAll({ where: condition })
        .then(data => {
            res.status(200).send({
                data,
                status: true,
                message: "Data fetch successfully"
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occured while retrieving the tutorial."
            });
        });
}

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Tutorial.findByPk(id)
        .then(data => {
            if(data) {
                res.status(200).send({
                    data,
                    status: true,
                    message: "Data fetch successfully"
                });
            } else {
                res.status(404).send({
                    message: `Cannot find Tutorial with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Tutorial with id= " + id
            });
        })
}

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Tutorial.update(req.body, {
        where: {id: id}
    })
        .then(num => {
            if(num == 1){
                res.send({
                    message: "Tutorial was updated successfully"
                });
            } else {
                res.send({
                    message: `Cannot update Tutorial with id = ${id}. Maybe Tutorial was not found or req.body is empty`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating tutorial with id = " + id
            });
        });
}

// Delete the tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = res.params.id;

    Tutorial.destroy({
        where: {id}
    })
        .then(num => {
            if(num == 1) {
                res.send({
                    message: "Tutorial was deleted successfully"
                })
            } else {
                res.send({
                    message: `Cannot delete Tutorial with the id = ${id}. Maybe Tutorial was not found or req.body is empty`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Tutorial with the id = " + id
            });
        })
}

// Delete all Tutorials from the database
exports.deleteAll = (req, res) => {
    Tutorial.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} Tutorials were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all tutorials."
        });
      });
};

// FInd all published Tutorials
exports.findAllPublished = (req, res) => {
    Tutorial.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
}