
function ResponseMaker() {
  const notFound = (type, content) => ({
    code: 404,
    msg: 'Not Found',
    data: {
      type,
      content,
    },
  });

  const noContent = type => ({
    code: 204,
    msg: 'No content',
    data: {
      type,
    },
  });

  const conflict = (type, content) => ({
    code: 409,
    msg: 'Conflict',
    data: {
      type,
      content,
    },
  });

  const created = (type, content) => ({
    code: 201,
    msg: 'Created',
    data: {
      type,
      content,
    },
  });

  const ok = (msg, type, content) => ({
    code: 200,
    msg,
    data: {
      type,
      content,
    },
  });

  const paginated = (page, type, content) => ({
    code: 200,
    data: {
      type,
      content,
    },
    total_count: content.length,
    per_page: parseInt(process.env.PAGE_SIZE, 10),
    page,
  });
  
  return {
    notFound,
    noContent,
    conflict,
    created,
    ok,
    paginated,
  };
}

module.exports = ResponseMaker();
