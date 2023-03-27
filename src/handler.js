// const {nanoid} = require('nanoid');
const {customAlphabet} = require('nanoid');
const books = require('./books.js');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

// Kriteria 3 : Client tidak melampirkan properti namepada request body
  if (!name) {
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
    return response;
  }
// Kriteria 3 : Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
  if (readPage > pageCount) {
    const response = h.response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
    return response;
  }

  const nanoid = customAlphabet('1234567890abcdef', 10);
  const id = nanoid();
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      })
      .code(201);
    return response;
  }

  const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    })
    .code(500);
  return response;
};

// Kriteria 4 : API dapat menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  if (!name && !reading && !finished) {
    const response = h.response({
        status: 'success',
        data: {
          books: books.map((b) => ({
            id: b.id,
            name: b.name,
            year: b.year,
            author: b.author,
            summary: b.summary,
            publisher: b.publisher,
          })),
        },
      })
      .code(200);
      console.log(response);
    return response;
  }

  // fitur query parameters

  if (name) {
    const filteredBooksName = books.filter((b) => {
      const nameRegex = new RegExp(name, 'gi'); // "gi" untuk melakukan pencarian yang tidak sensitif huruf besar-kecil
      return nameRegex.test(b.name);
    });

    const response = h.response({
        status: 'success',
        data: {
          books: filteredBooksName.map((b) => ({
            id: b.id,
            name: b.name,
            publisher: b.publisher,
          })),
        },
      })
      .code(200);

    return response;
  }

  if (reading) {
    const filteredBooksReading = books.filter(
      (book) => Number(book.reading) === Number(reading),
    );

    const response = h
      .response({
        status: 'success',
        data: {
          books: filteredBooksReading.map((b) => ({
            id: b.id,
            name: b.name,
            publisher: b.publisher,
          })),
        },
      })
      .code(200);

    return response;
  }

  const filteredBooksFinished = books.filter(
    (book) => Number(book.finished) === Number(finished),
  );

  const response = h.response({
      status: 'success',
      data: {
        books: filteredBooksFinished.map((b) => ({
          id: b.id,
          name: b.name,
          publisher: b.publisher,
        })),
      },
    })
    .code(200);

  return response;
};

// Kriteria 5 : API dapat menampilkan detail buku
const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const book = books.filter((b) => b.id === bookId)[0]; // find book by id

  if (book) {
    const response = h
      .response({
        status: 'success',
        data: {
          book,
        },
      })
      .code(200);
    return response;
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    .code(404);
  return response;
};

// Kriteria 6 : API dapat mengubah data buku
const editBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
    return response;
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((b) => b.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      })
      .code(200);
    return response;
  }

  const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    .code(404);
  return response;
};

// Kriteria 7 : API dapat menghapus buku
const deleteBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const index = books.findIndex((b) => b.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      })
      .code(200);
    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    .code(404);
  return response;
  }
};

// const home = (request, h) => {
//   return (
//     <div>
//     <div>Test</div>
//     </div>
//   )
// }

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};