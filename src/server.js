const Hapi = require('@hapi/hapi');
const routes = require('./routes');
// const handlebar = ;


const init = async () => {
  const server = Hapi.server({
    // Kriteria 1
    port: 8000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
        cors: {
          origin: ['*'],
        },
      },
  });

  await server.register(require('@hapi/vision'));

    server.views({
        engines: {
            html: require('handlebars'),
        },
        relativeTo: __dirname,
        path: './views',
    });

  server.route(routes);

  await server.start((err)=>{
    if (err) {
      throw err;
    }
  });
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();