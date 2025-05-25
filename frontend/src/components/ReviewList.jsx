import React from 'react';

const ReviewList = ({ reviews }) => {
  if (!reviews.length) {
    return <p className="text-gray-500">Este cuidador aún no tiene reseñas.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border p-4 rounded shadow-sm">
          <div className="flex items-center justify-between">
            <strong>{review.user.name}</strong>
            <span className="text-yellow-500">
              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
            </span>
          </div>
          <p className="text-gray-700 mt-2">{review.comment}</p>
          <p className="text-sm text-gray-400">{new Date(review.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
