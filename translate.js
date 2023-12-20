const { Translate } = require("@google-cloud/translate").v2;
const key = "";
const projectId = "";

const translate = new Translate({ projectId, key });
/**
 * 
 * @param {文本} text 
 * @param {目标国家代号} target 
 * @returns 
 */
module.exports = async function translateTxt(text, target = "en") {
  const [translation] = await translate.translate(text, target);
  return translation.trim();
};
