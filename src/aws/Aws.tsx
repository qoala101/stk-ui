import * as Aws from "aws-sdk";

function getPublicUrlFromAws(handler: (public_url?: string) => void) {
  Aws.config.update({
    region: "us-east-1",
    accessKeyId: "AKIAW3MLMEQXHMFPC653",
    secretAccessKey: "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"
  });

  var dynamoDb = new Aws.DynamoDB();
  var getItemParams = {
    Key: {
      "Key": {
        S: "public_url"
      }
    },
    TableName: "stonks"
  };

  dynamoDb.getItem(getItemParams, function (err: Aws.AWSError, data: Aws.DynamoDB.Types.GetItemOutput) {
    if (data.Item) {
      var item = data.Item["Value"];

      if (item.S) {
        handler(item.S);
        return;
      }
    }

    handler();
  });
}

export default getPublicUrlFromAws;