const { Calendar } = require('../models');

// FIXME Falta documentacion en todos los metodos
// FIXME Todos los metodos asincronos a base de datos deberian manejar los errores a traves de un try-catch

class CalendarCtrl{
  constructor(){
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
    this.addRoutine = this.addRoutine.bind(this);
    this.removeRoutine = this.removeRoutine.bind(this);
  }

   async getAll(req, res){

     let data = await Calendar.getCalendars();

     // FIXME El objeto tiene formato de paginado, pero no es real
     const json = {
       data: data,
       total_count: data.length,
       per_page: data.length,
       page: 0,
     };

     if (data.length === 0) {
       res.status(204);
     }

     res.send(json);
  }

  async get(req, res){
      let data = await Calendar.getCalendar(req.params.idCalendar);
      console.log("ctl-get", data);
      if (data.length === 0) {
        res.status(204);
      }

      res.send(data);
  }

  async create(req, res, next){
    try {
      let data = await Calendar.createCalendar(req.body); //req.body {}
      console.log("ctrl-create",data);
      res.status(201).send(data);
    } catch (e) {
      res.status (409).send("Insert error: " + e.duplicated.message);
      next(e);
    }
  }

  async delete(req, res, next){
    const deleted = await Calendar.deleteCalendar(req.params.idCalendar);

      if (deleted) {
        res.status(200); // OK
      } else {
        res.status(404); // Not Found
      }

      res.send();
  }

  async update(req, res, next) {

   const data = await Calendar.getCalendar(req.params.idCalendar);

   if (data.length === 0) {
     res.status(404).send(data); // Not Found
   }

   try{
     const updated = await data.updateCalendar(req.body);
     if (updated) {
       res.status(200); // OK
     } else {
       res.status(409); // Conflict
     }
   }catch(e){
     res.status(409);
     next(e);
   }
   // FIXME ESto deberia regresar un objeto de tipo user idealmente o un objeto con un formato definido para respuestas
   res.send({...data, ...req.body});
 }

 async addRoutine(req, res, next) {
   const { idCalendar } = req.params;
   const { idRoutine, day } = req.body;
   try {
    const data = await Calendar.addRoutine(idCalendar, idRoutine, day);
    res.status(201).send(data);
    } catch (err) {
    next(err);
    }
 }

 async removeRoutine(req, res, next){
  const { idCalendar } = req.params;
  const { idRoutine, day } = req.body;
  let deleted;
  try {
    deleted = await Calendar.removeRoutine(idCalendar, idRoutine, day);
  } catch (error) {
    next(error);
  }

  if (deleted) {
    res.status(200); // OK
  } else {
    res.status(404); // Not Found
  }

  res.send();
}


}
module.exports = new CalendarCtrl();
