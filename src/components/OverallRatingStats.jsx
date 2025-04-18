import React, { useMemo } from "react";
import { Card } from "primereact/card";
import { FaStar } from "react-icons/fa";

const OverallRatingStats = ({ reviews }) => {
  const { overallRating, totalReviews, ratingDistribution } = useMemo(() => {
    const total = reviews.length;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const distribution = [0, 0, 0, 0, 0]; 

    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++;
      }
    });

    return {
      overallRating: total > 0 ? sum / total : 0,
      totalReviews: total,
      ratingDistribution: distribution,
    };
  }, [reviews]);

  const stars = [5, 4, 3, 2, 1];

  return (
    <Card className="p-6 shadow-lg rounded-lg w-full">
      {/* Overall Rating */}
      <div className="text-center mb-6">
        <h2 className="text-5xl font-bold text-yellow-500 flex items-center justify-center gap-2">
          {overallRating.toFixed(1)} <FaStar />
        </h2>
        <p className="text-gray-500 text-sm">{totalReviews} customer reviews</p>
      </div>

      {/* Ratings Distribution */}
      <div className="space-y-3">
        {stars.map((star) => {
          const count = ratingDistribution[star - 1] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-3">
              <span className="w-10 text-sm font-medium text-gray-600">{star} ★</span>
              <progress
                className="progress progress-warning flex-1"
                value={percentage}
                max="100"
              ></progress>
              <span className="text-sm text-gray-500">{count}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default OverallRatingStats;
