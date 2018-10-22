//controladores blog
const { Blog } = require('../models');

/**
 *
 * @class Class of controller Blog
 * - Contain the getAll, get, create, delete, update functions
 */
class BlogCtrl {
  constructor(){
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
  }

  /**
  * @async
  * Async function to get all blogs from database using the Blog Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

   async getAll(req, res){

     let data = await Blog.getBlogs();

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

  /**
  * @async
  * Async function to get a specific blog from database using the Blog Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

  async get(req, res){
      let data = await Blog.getBlog(req.params.idBlog);
      if (data.length === 0) {
        res.status(204);
      }

      res.send(data);
  }

  /**
  * @async
  * Async function to create a blog from database using the Blog Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

  async create(req, res, next){
    try {
      let data = await Blog.createBlog(req.body); //req.body {}
      console.log("ctrl-create",data);
      res.status(201).send(data);
    } catch (e) {
      console.log("eee:" ,e);

      res.status (409).send("Insert error: " + e.duplicated.message);
      next(e);
    }
  }

  /**
  * @async
  * Async function to delete a specific blog from database using the Blog Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */

  async delete(req, res, next){
    const deleted = await Blog.deleteBlog(req.params.idBlog);

      if (deleted) {
        res.status(200); // OK
      } else {
        res.status(404); // Not Found
      }

      res.send();
  }

  /**
  * @async
  * Async function to iptate a specific blog from database using the Blog Model
  * @param  {Request Object}     req   Request to the function, includes information in params
  * @param  {Response Object}    res   Response than will give the function
  * @param  {Next Object}        next  In case of get error
  * @return {Promise}                  Promise to return the data results
  */
  async update(req, res, next) {

   const data = await Blog.getBlog(req.params.idBlog);

   if (data.length === 0) {
     res.status(404).send(data); // Not Found
   }

   try{
     const updated = await data.updateBlog(req.body);
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
   res.send( {...data, ...req.body} );

 }

}
module.exports = new BlogCtrl();
