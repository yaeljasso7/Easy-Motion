
function ResponseMaker() {
  const notFound = (type, content) => ({
    status: 404,
    msg: 'Not Found',
    data: {
      type,
      content,
    },
  });

  const noContent = type => ({
    status: 204,
    msg: 'No content',
    data: {
      type,
    },
  });

  const conflict = (type, content) => ({
    status: 409,
    msg: 'Conflict',
    data: {
      type,
      content,
    },
  });

  const created = (type, content) => ({
    status: 201,
    msg: 'Created',
    data: {
      type,
      content,
    },
  });

  const ok = (msg, type, content) => ({
    status: 200,
    msg,
    data: {
      type,
      content,
    },
  });

  const paginated = (page, type, content) => ({
    status: 200,
    data: {
      type,
      content,
    },
    total_count: content.length,
    per_page: parseInt(process.env.PAGE_SIZE, 10),
    page,
  });

  const forbidden = msg => ({
    status: 403,
    msg,
  });

  return {
    notFound,
    noContent,
    conflict,
    created,
    ok,
    paginated,
    forbidden,
  };
}

module.exports = ResponseMaker();
