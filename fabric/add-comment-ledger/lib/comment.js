const stringify = require("json-stringify-deterministic");
const sortKeysRecursive = require("sort-keys-recursive");
const { Contract } = require("fabric-contract-api");

class AddComment extends Contract {
  async CreateComment(ctx, id, author, comment, createdAt) {
    const newComment = {
      ID: id,
      Author: author,
      Comment: comment,
      CreatedAt: createdAt,
    };
    await ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(newComment)))
    );
    return JSON.stringify(newComment);
  }

  async GetAllComments(ctx) {
    const allResults = [];
    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();

    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      let record;

      try {
        record = JSON.parse(strValue);
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push(record);
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }
}

module.exports = AddComment;
