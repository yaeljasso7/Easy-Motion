
function ResponseMaker() {
  this.notFound = (type, content) => ({
    code: 404,
    msg: 'Not Found',
    data: {
      type,
      content,
    },
  });

  this.noContent = type => ({
    code: 204,
    msg: 'No content',
    data: {
      type,
    },
  });

  this.confict = (type, content) => ({
    code: 409,
    msg: 'Conflict',
    data: {
      type,
      content,
    },
  });

  this.created = (type, content) => ({
    code: 201,
    msg: 'Created',
    data: {
      type,
      content,
    },
  });

  this.ok = (msg, type, content) => ({
    code: 200,
    msg,
    data: {
      type,
      content,
    },
  });

  this.paginated = (page, type, content) => ({
    code: 200,
    data: {
      type,
      content,
    },
    total_count: content.length,
    per_page: parseInt(process.env.PAGE_SIZE, 10),
    page,
  });
}

module.exports = new ResponseMaker();
