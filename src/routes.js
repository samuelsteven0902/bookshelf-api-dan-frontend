const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require('./handler.js');

const routes = [
  {
    // Kriteria 3 : API dapat menyimpan buku
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      return reply.view('index');
    },
  },
  {
    // Kriteria 3 : API dapat menyimpan buku
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    // Kriteria 4 : API dapat menampilkan seluruh buku
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    // Kriteria 5 : API dapat menampilkan detail buku
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },
  {
    // Kriteria 6 : API dapat mengubah data buku
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler,
  },
  {
    // Kriteria 7 : API dapat menghapus buku
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
  {
    method: '*',
    path: '/{any*}',
    handler: () => 'Halaman tidak ditemukan',
  },
];

module.exports = routes;