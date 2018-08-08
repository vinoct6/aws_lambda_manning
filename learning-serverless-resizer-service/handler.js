'use strict';

const AWS = require('aws-sdk');
const resizer = require('./resize')
const stepfunctions = new AWS.StepFunctions();

module.exports.resizer = (event, context, callback) => {
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  console.log(event);

  const bucket = event.bucketName;
  const key = event.objectKey;
  console.log(`A file name ${key} was added in the ${bucket}`);
  callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });

  resizer(bucket, key)
    .then(() => {
      console.log('The Thumbnail is created');
      callback(null, { message: 'Thumbnail was created' });
    }).catch(error => {
      console.log(error);
      callback(error);
    })
};

module.exports.saveImageMetadata = (event, context, callback) => {
  console.log(event);

  const bucket = event.bucketName;
  const key = event.objectKey;
  console.log(`A file name ${key} was added in the ${bucket}`);
  console.log("TODO saveImageMetadata ************************************")
};

module.exports.executeStepFunction = (event, context, callback) => {
  const stateMachineName = 'ImageProcessingMachine'; // The name of the step function we defined in the serverless.yml

  console.log('Fetching the list of available workflows');

  stepfunctions
    .listStateMachines({})
    .promise()
    .then(listStateMachines => {
      console.log('Searching for the step function');

      for (var i = 0; i < listStateMachines.stateMachines.length; i++) {
        const item = listStateMachines.stateMachines[i];

        if (item.name.indexOf(stateMachineName) >= 0) {
          console.log('Found the step function');

          // The event data contains the information of the s3 bucket and the key of the object
          const eventData = event.Records[0];

          var params = {
            stateMachineArn: item.stateMachineArn,
            input: JSON.stringify({ objectKey: eventData.s3.object.key, bucketName: eventData.s3.bucket.name })
          };

          console.log('Start execution');
          stepfunctions.startExecution(params).promise().then(() => {
            return context.succeed('OK');
          });
        }
      }
    })
    .catch(error => {
      return context.fail(error);
    });
};
