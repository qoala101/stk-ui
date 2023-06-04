/**
 * STK-UI {@link https://github.com/qoala101/stk_ui}
 * @author Volodymyr Hromakov <4y5t6r@gmail.com>
 * @copyright Copyright (c) 2023, MIT License
 */

import * as Aws from "aws-sdk";

function getPublicUrlFromAws(handler: (public_url?: string) => void) {
  Aws.config.update({
    region: "us-east-1",
    credentials: new Aws.CognitoIdentityCredentials({
      IdentityPoolId: "us-east-1:cc663982-9543-4d54-b7bb-373f2f66750a",
    }),
  });

  let dynamoDb = new Aws.DynamoDB();
  let getItemParams = {
    Key: {
      Key: {
        S: "public_url",
      },
    },
    TableName: "stk",
  };

  dynamoDb.getItem(
    getItemParams,
    function (err: Aws.AWSError, data: Aws.DynamoDB.Types.GetItemOutput) {
      if (data.Item) {
        let item = data.Item["Value"];

        if (item.S) {
          handler(item.S);
          return;
        }
      }

      handler();
    }
  );
}

export default getPublicUrlFromAws;
