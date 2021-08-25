function handleUser(endpoint: String, body: Object) {
  switch (endpoint) {
    case "register":
      handleUserRegistration(body);
  }
  return null;
}

function handleUserRegistration(data: Object) {
  console.log(data);
}

module.exports.handleUser = handleUser;
