'use strict'

const Image = use('App/Models/Image');
const Property = use('App/Models/Property');
const Helpers = use('Helpers');

class ImageController {
  async show({response, params}){
    return response.download(Helpers.tmpPath(`uploads/${params.path}`));
  }

  async store({request, params}){
    const property = await Property.findOrFail(params.id);

    const images = request.file('image', {
      types: ['images'],
      size: '2mb'
    });

    await images.moveAll(Helpers.tmpPath('uploads'), file => ({
      name: `$Date.now()-${file.clientName}`
    }));

    if (!images.moveAll()) {
      return images.errors();
    }

    await Promise.all(
      images
        .moveList()
        .map(image => property.images().create({path: image.fileName}))
    );
  }
}

module.exports = ImageController
