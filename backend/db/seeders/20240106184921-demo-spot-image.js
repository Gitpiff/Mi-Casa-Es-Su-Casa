'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const demoSpotImages = [
  {
    spotId: 1,
    url: "https://assets-global.website-files.com/5dcc7f8c449e597ed83356b8/5faae1191b673c881b077e1f_ogaa-min.png",
    preview: true
  },
  {
    spotId: 1,
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2372&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    preview: true
  },
  {
    spotId: 1,
    url:  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2369&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    preview: true
  },
  {
    spotId: 1,
    url:  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=2274&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    preview: true
  },
  {
    spotId: 1,
    url:  "https://assets-global.website-files.com/5dcc7f8c449e597be23356e0/657b5c1f9f39325154e5c2ff_Looking%20Towards%202024%20and%20Beyond%20Blog%20Hero%20image.webp",
    preview: true
  },
  {
    spotId: 2,
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/XcelEnergyCenteroverview.jpg/640px-XcelEnergyCenteroverview.jpg",
    preview: true
  },
  {
    spotId: 2,
    url: "https://i0.wp.com/zonecoverage.com/wp-content/uploads/2020/11/2008-RNC-1-scaled.jpg?fit=800%2C532&ssl=1",
    preview: true
  },
  {
    spotId: 2,
    url: "https://saint-paul-2022.s3.amazonaws.com/imager/files_idss_com/C17/39b802cd-7736-4070-8cef-8d11a2296177/bba07aec-087e-46db-840d-c303ab4412d3_2a23813dca470163f0b2610639f888f1.jpg",
    preview: true
  },
  {
    spotId: 2,
    url: "https://www.rateyourseats.com/shared/Xcel-Energy-Center-Section-230-Row-6-on-9-30-2017f2.jpg",
    preview: true
  },
  {
    spotId: 2,
    url: "https://meyersound.com/wp-content/uploads/2022/11/7_xcel_energy_center.jpg",
    preview: true
  },
  {
    spotId: 3,
    url: "https://img.asmedia.epimg.net/resizer/1itgyxiU9AqVyy1qAK982UIQLyc=/644x362/filters:focal(559x357:569x367)/cloudfront-eu-central-1.images.arcpublishing.com/diarioas/SS37JYT2SBAN7I5FBEZS76JWXA.jpg",
    preview: true
  },
  {
    spotId: 3,
    url: "https://www.eleconomista.com.mx/__export/1686116861725/sites/eleconomista/img/2023/06/06/estadio_azteca_propiedades.jpg_554688468.jpg",
    preview: true
  },
  {
    spotId: 3,
    url: "https://images.squarespace-cdn.com/content/v1/592a3ccad2b857159c817d9a/1634072814176-1FVB83JZHMX9EH25QNQ2/20211012_Estadio_Azteca.jpg",
    preview: true
  },
  {
    spotId: 3,
    url: "https://dnclcgcvl4f14.cloudfront.net/siila-cm/prd/1280w/7996-1687546713335.jpg",
    preview: true
  },
  {
    spotId: 4,
    url: "https://lh3.googleusercontent.com/proxy/wyTnF3nGRRFG-3lBdVP2Bs0MA0MDijzDKd5iORfPjcxQ79-do32W0Cs-n8E_-Ex0Vy_oXTzBE7KSKbIccEr3B8JazWSKLf2iOOL7GXIsh8g8GhLGtAXjv6YKjs0mrf9zu5U",
    preview: true
  },
  {
    spotId: 4,
    url: "https://facts.net/wp-content/uploads/2023/09/15-mind-blowing-facts-about-la-bombonera-1694686977.jpg",
    preview: true
  },
  {
    spotId: 4,
    url: "https://media.cntraveler.com/photos/5afde3ce33b017425b111138/16:9/w_2560%2Cc_limit/La-Bombonera_GettyImages-493750714.jpg",
    preview: true
  },
  {
    spotId: 4,
    url: "https://landingpadba.com/wp-content/uploads/2009/01/La-Bombonera-stadium-upper-view-620x536.jpg",
    preview: true
  },
  {
    spotId: 4,
    url: "https://calciodeal.com/wp-content/uploads/2023/08/bombonera-boca-junior-stadio-scaled.jpg",
    preview: true
  },
  {
    spotId: 5,
    url: "https://estaticos.esmadrid.com/cdn/farfuture/0L2A52DEz0trwTeGDOi3C_ujRwdBZi8MosGiy1EdrUc/mtime:1695198032/sites/default/files/styles/content_type_full/public/recursosturisticos/infoturistica/reforma_santiagobernabeu.jpg?itok=QCYWDqel",
    preview: true
  },
  {
    spotId: 5,
    url: "https://media.cntraveler.com/photos/5e66a338b93f0800081a6f28/16:9/w_2560,c_limit/santiago-bernabe%CC%81u-stadium-madrid-2020-GettyImages-1194733745.jpg",
    preview: true
  },
  {
    spotId: 5,
    url: "https://images.adsttc.com/media/images/6526/e5c2/64e5/0c5f/47f3/0877/newsletter/l35-architects-sobre-la-remodelacion-del-estadio-santiago-bernabeu-de-madrid-a-pocos-meses-de-finalizar_16.jpg?1697048007",
    preview: true
  },
  {
    spotId: 5,
    url: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Estadio_Santiago_Bernab%C3%A9u_%282016%29.jpg",
    preview: true
  },
  {
    spotId: 5,
    url: "https://www.spain.info/.content/imagenes/cabeceras-grandes/madrid/estadio-bernabeu-vista-aerea-c-turismo-madrid.jpg",
    preview: true
  }
]

options.tableName = 'SpotImages';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert(options, demoSpotImages);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.op;
    return queryInterface.bulkDelete(options, {
      [Op.or]: demoSpotImages
    }, {});
  }
};
