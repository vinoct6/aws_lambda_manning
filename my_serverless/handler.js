'use strict';

module.exports.hello = (event, context, callback) => {
  const done = (err, res) => {
    callback(null, {
      statusCode: err ? '400' : '200',
      body: err ? err.message : res,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };

  console.log(event.httpMethod);
  switch(event.httpMethod) {
    case 'GET' : 
        console.log('Get method was called');
        done(null, 'Get method was called');
        break;
    default:
        console.log('Something other than http was called');
        done(new Error(`Unsupported method "$event.httpMethod"`));
  }
};

