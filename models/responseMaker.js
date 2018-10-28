
function ResponseMaker() {
  const basic = ({
    status, type, data, msg,
  }) => ({
    status: status || 500,
    msg: `${type}: ${msg}`,
    data,
  });

  const notFound = ({ type, data, msg }) => (
    basic({
      status: 404,
      type,
      data,
      msg: msg || 'Not Found',
    })
  );

  const nodata = ({ type, msg }) => (
    basic({
      status: 204,
      type,
      msg: msg || 'No data',
    })
  );

  const conflict = ({ type, data, msg }) => (
    basic({
      status: 409,
      type,
      data,
      msg: msg || 'Conflict',
    })
  );

  const created = ({ type, data, msg }) => (
    basic({
      status: 201,
      type,
      data,
      msg: msg || 'Created',
    })
  );

  const ok = ({ type, data, msg }) => (
    basic({
      status: 200,
      type,
      data,
      msg: msg || 'Ok',
    })
  );

  const paginated = ({
    page, type, data, msg,
  }) => ({
    ...ok({ type, data, msg }),
    details: {
      total_count: data.length,
      per_page: Number(process.env.PAGE_SIZE),
      page,
    },
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
    nodata,
    conflict,
    created,
    ok,
    paginated,
    forbidden,
    unauthorized,
  };
}

module.exports = ResponseMaker();
