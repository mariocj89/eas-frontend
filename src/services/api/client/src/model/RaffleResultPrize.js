/**
 * EAS API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 */

import ApiClient from '../ApiClient';

/**
 * The RaffleResultPrize model module.
 * @module model/RaffleResultPrize
 * @version v1
 */
export default class RaffleResultPrize {
  /**
   * Constructs a new <code>RaffleResultPrize</code>.
   * @alias module:model/RaffleResultPrize
   * @class
   */

  constructor() {}

  /**
   * Constructs a <code>RaffleResultPrize</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/RaffleResultPrize} obj Optional instance to populate.
   * @return {module:model/RaffleResultPrize} The populated <code>RaffleResultPrize</code> instance.
   */
  static constructFromObject(data, obj) {
    if (data) {
      obj = obj || new RaffleResultPrize();

      if (data.hasOwnProperty('id')) {
        obj.id = ApiClient.convertToType(data.id, 'String');
      }
      if (data.hasOwnProperty('name')) {
        obj.name = ApiClient.convertToType(data.name, 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} id
   */
  id = undefined;
  /**
   * @member {String} name
   */
  name = undefined;
}
