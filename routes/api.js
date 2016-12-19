exports.findById = function(req, res) {
  res.json({
    type: true,
    data: "Find by Id " + req.params.id
  });
}

exports.findAll = function(req, res) {
  res.json({
    type: true,
    data: "Find all Ok"
  });
}

exports.addBeer = function(req, res) {
  res.json({
    type: true,
    data: "Add Ok"
  });
}

exports.updateBeer = function(req, res) {
  res.json({
    type: true,
    data: "Update " + req.params.id
  });
}

exports.deleteBeer = function(req, res) {
  res.json({
    type: true,
    data: "Delete " + req.params.id
  });
}