'use strict';

const resizer = require('./resize')

module.exports.resizer = (event, context, callback) => {
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  console.log(event.Records[0].s3);

  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  console.log(`A file name ${key} was added in the ${bucket}`);
  callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });

  resizer(bucket, key)
    .then(() => {
      console.log('The Thumbnail is created');
      callback(null, {message : 'Thumbnail was created'});
    }).catch(error => {
      console.log(error);
      callback(error);
    })
};
