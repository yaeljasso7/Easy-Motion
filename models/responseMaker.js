
function ResponseMaker() {
  const basic = ({
    status, type, content, msg,
  }) => ({
    status: status || 500,
    msg,
    data: {
      type,
      content,
    },
  });

  const notFound = (type, content) => (
    basic({
      status: 404,
      type,
      content,
      msg: 'Not Found',
    })
  );

  const noContent = type => (
    basic({
      status: 204,
      type,
      msg: 'No content',
    })
  );

  const conflict = (type, content, msg) => (
    basic({
      status: 409,
      type,
      content,
      msg: msg || 'Conflict',
    })
  );

  const created = (type, content, msg) => (
    basic({
      status: 201,
      type,
      content,
      msg: msg || 'Created',
    })
  );

  const ok = (msg, type, content) => (
    basic({
      msg: msg || 'Ok',
      type,
      content,
    })
  );

  const paginated = (page, type, content) => ({
    ...ok(0, type, content),
    total_count: content.length,
    per_page: Number(process.env.PAGE_SIZE),
    page,
  });

  const forbidden = msg => (
    basic({
      status: 403,
      msg: msg || 'Forbidden',
    })
  );

  const unauthorized = msg => (
    basic({
      status: 401,
      msg: msg || 'Unauthenticated',
    })
  );

  return {
    basic,
    notFound,
    noContent,
    conflict,
    created,
    ok,
    paginated,
    forbidden,
    unauthorized,
  };
}

module.exports = ResponseMaker();
