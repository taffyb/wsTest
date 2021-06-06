const AWS = require('aws-sdk');

let send = undefined;
function init(event) {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  });
  send = async (connectionId, data) => {
    console.log(`connectionId: ${connectionId}\ndata:${JSON.stringify(data,null,2)}`);
    await apigwManagementApi.postToConnection({ ConnectionId: connectionId, Data: JSON.stringify(data)}).promise();
  }
}

exports.handler = async(event) => {
    console.log(`Event:${JSON.stringify(event,null,2)}`);
    var bodyString = event.body;
    var bodyObject = JSON.parse(bodyString);
    const connectionId = event.requestContext.connectionId;

    if(bodyObject.message){
        bodyObject.message = "Echo: "+ bodyObject.message.toUpperCase();
        init(event);
        send(connectionId, bodyObject.message);    
    }
    // the return value is ignored when this function is invoked from WebSocket gateway
    return {statusCode:200,body:"Invitation Sent"};
}