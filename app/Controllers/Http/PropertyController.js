'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Property = use('App/Models/Property')

/**
 * Resourceful controller for interacting with properties
 */
class PropertyController {

  async index({ request }) {
    const { latitude, longitude } = request.all();
    const properties = Property.query()
      .with('images')
      .nearBy(latitude, longitude, 10)
      .fetch();


    return properties;
  }

 
  async store({ auth, request, response }) {
    const {id} = auth.user;
    const data = request.only([
      'title',
      'address',
      'latitude',
      'longitude',
      'price'
    ]);

    const property = await Property.create({...data, user_id: id});
    return property;
  }


  async show({ params }) {
    const property = await Property.findOrFail(params.id);

    await property.load('images');

    return property;
  }


  /**
   * Update property details.
   * PUT or PATCH properties/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
  }


  async destroy({ params, auth, response }) {
    const property = await Property.findOrFail(param.id);

    if (property.user_id !== auth.user.id) {
      return response.status(401).send({ error: 'Not authorized!' });
    }
  }
}

module.exports = PropertyController
