/**
 * Example component demonstrating how to use the API service layer with React Query
 * This file is for reference only and should not be imported in production code
 */

import { useState } from 'react';
import { useBooks, useCreateBook, useDeleteBook } from '../hooks/useBooks';
import { getErrorMessage } from '../utils/errorHandler';
import { useLanguage } from '../contexts/LanguageContext';

export function BookListExample() {
  const { language } = useLanguage();
  const [page, setPage] = useState(1);
  
  // Fetch books with pagination
  const { data, isLoading, error } = useBooks({ page, limit: 10 });
  
  // Mutations
  const createBook = useCreateBook();
  const deleteBook = useDeleteBook();

  const handleDelete = async (bookId: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook.mutateAsync(bookId);
        alert('Book deleted successfully!');
      } catch (err) {
        const message = getErrorMessage(err, language);
        alert(`Error: ${message}`);
      }
    }
  };

  if (isLoading) {
    return <div>Loading books...</div>;
  }

  if (error) {
    return <div>Error: {getErrorMessage(error, language)}</div>;
  }

  const books = data?.data?.books || [];
  const pagination = data?.data?.pagination;

  return (
    <div>
      <h1>Books</h1>
      
      {/* Book List */}
      <div>
        {books.map((book: any) => (
          <div key={book._id}>
            <h3>{language === 'ar' ? book.titleAr : book.title}</h3>
            <p>{language === 'ar' ? book.authorAr : book.author}</p>
            <button onClick={() => handleDelete(book._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div>
          <button 
            onClick={() => setPage(page - 1)} 
            disabled={page === 1}
          >
            Previous
          </button>
          <span>Page {pagination.page} of {pagination.pages}</span>
          <button 
            onClick={() => setPage(page + 1)} 
            disabled={page === pagination.pages}
          >
            Next
          </button>
        </div>
      )}

      {/* Upload Status */}
      {createBook.isPending && <div>Uploading...</div>}
      {deleteBook.isPending && <div>Deleting...</div>}
    </div>
  );
}
