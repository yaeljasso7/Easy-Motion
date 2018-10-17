//controladores categoryBlog
const { categoryBlog } = require('../models');

// FIXME Falta documentacion en todos los metodos
// FIXME Todos los metodos asincronos a base de datos deberian manejar los errores a traves de un try-catch

class categoryBlogCtrl{
  constructor(){
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
  }

   async getAll(req, res){

     let data = await categoryBlog.getcategoryBlogs();

     // FIXME El objeto tiene formato de paginado, pero no es real
     const json = {
       data: data,
       total_count: data.length,
       per_page: data.length,
       page: 0,
     };

     // In case categoryBlog was not found
     if (data.length === 0) {
       res.status(204);
     }

     res.send(json);
  }

  async get(req, res){
      let data = await categoryBlog.getcategoryBlog(req.params.idcategoryBlog);
      if (data.length === 0) {
        res.status(204);
      }

      res.send(data);
  }

  async create(req, res, next){
    try {
      let data = await categoryBlog.createcategoryBlog(req.body); //req.body {}
      res.status(201).send(data);
    } catch (e) {
      res.status (409).send("Insert error: " + e.duplicated.message);
      next(e);
    }
  }

  async delete(req, res, next){
    const deleted = await categoryBlog.deletecategoryBlog(req.params.idcategoryBlog);

      if (deleted) {
        res.status(200); // OK
      } else {
        res.status(404); // Not Found
      }

      res.send();
  }

  async update(req, res, next) {

   const data = await categoryBlog.getcategoryBlog(req.params.idcategoryBlog);

   if (data.length === 0) {
     res.status(404).send(data); // Not Found
   }

   try{
     const updated = await data.updatecategoryBlog(req.body);
     if (updated) {
       res.status(200); // OK
     } else {
       res.status(409); // Conflict
     }
   }catch(e){
     res.status(409);
     next(e);
   }

  // FIXME ESto deberia regresar un objeto de tipo del recurso idealmente o un objeto con un formato definido para respuestas
   res.send( Object.assign(data, req.body) ); // FIXME en lugar de usar assign puede hacer spread { ...data, ...req.body }
 }



}
module.exports = new categoryBlogCtrl();
