
const { Calendary } = require('../models');

class CalendaryCtrl{
  constructor(){
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
  }

   async getAll(req, res){

     let data = await Calendary.getCalendarys();

     const json = {
       data: data,
       total_count: data.length,
       per_page: data.length,
       page: 0,
     };

     // In case Calendary was not found
     if (data.length === 0) {
       res.status(204);
     }

     res.send(json);
  }

  async get(req, res){
      let data = await Calendary.getCalendary(req.params.idCalendary);
      console.log("ctl-get", data);
      if (data.length === 0) {
        res.status(204);
      }

      res.send(data);
  }

  async create(req, res, next){
    console.log("llegue aqui");
    try {
      let data = await Calendary.createCalendary(req.body); //req.body {}
      console.log("ctrl-create",data);
      res.status(201).send(data);
    } catch (e) {
      //db error
      console.log("eee:" ,e);
      res.status (409).send("Error al insertar: " + e.duplicated.message);
      next(e);
    }
  }

  async delete(req, res, next){
    const deleted = await Calendary.deleteCalendary(req.params.idCalendary);

      if (deleted) {
        res.status(200); // OK
      } else {
        res.status(404); // Not Found
      }

      res.send();
  }

  async update(req, res, next) {

   const data = await Calendary.getCalendary(req.params.idCalendary);

   if (data.length === 0) {
     res.status(404).send(data); // Not Found
   }

   try{
     const updated = await data.updateCalendary(req.body);
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
module.exports = new CalendaryCtrl();
