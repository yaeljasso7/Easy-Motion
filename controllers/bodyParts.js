const { BodyPart } = require('../models');

class BodyPartsCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
  }

  async getAll(req, res) {
    const data = await BodyPart.getAll();
    const json = {
      data,
      total_count: data.length,
      per_page: data.length,
      page: 0,
    };
    if (data.length === 0) {
      res.status(204);
    }
    res.send(json);
  }

  async get(req, res) {
    const data = await BodyPart.get(req.params.bodyPartId);
    const json = {
      data,
    };
    if (data.length === 0) {
      res.status(404);
    }
    res.send(json);
  }

  async create(req, res, next) {
    try {
      const data = await BodyPart.create(req.body);
      res.status(201).send(data);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next){
    const deleted = await BodyPart.delete(req.params.bodyPartId);

      if (deleted) {
        res.status(200); // OK
      } else {
        res.status(404); // Not Found
      }

      res.send();
  }

  async update(req, res, next) {

   const data = await BodyPart.get(req.params.bodyPartId);

   if (data.length === 0) {
     res.status(404).send(data); // Not Found
   }

   try{
     const updated = await data.update(req.body);
     if (updated) {
       res.status(200); // OK
     } else {
       res.status(409); // Conflict
     }
   }catch(e){
     res.status(409);
     next(e);
   }

   res.send( Object.assign(data, req.body) );
 }
}

module.exports = new BodyPartsCtrl();
