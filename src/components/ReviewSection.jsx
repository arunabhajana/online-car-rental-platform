import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { FaStar } from "react-icons/fa";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import OverallRatingStats from "./OverallRatingStats";

const itemsPerPage = 3;

const ReviewSection = ({ carId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [hasBooked, setHasBooked] = useState(false);

  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchBookingStatus = async () => {
      if (!currentUser || !carId) return;

      try {
        const bookingsQuery = query(
          collection(db, "bookings"),
          where("userId", "==", currentUser.uid),
          where("vehicle.id", "==", carId)
        );
        const bookingsSnap = await getDocs(bookingsQuery);
        setHasBooked(!bookingsSnap.empty);
      } catch (error) {
        console.error("Error checking booking status:", error);
      }
    };

    fetchBookingStatus();
  }, [carId, currentUser]);

  const fetchReviews = async () => {
    if (!carId) return;

    try {
      const reviewsQuery = query(collection(db, "reviews"), where("carId", "==", carId));
      const reviewsSnap = await getDocs(reviewsQuery);
      const fetchedReviews = reviewsSnap.docs.map((doc) => doc.data());
      setReviews(fetchedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [carId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasBooked) {
      alert("You must book the car before leaving a review.");
      return;
    }

    const reviewData = {
      carId,
      userId: currentUser.uid,
      username: currentUser.displayName || "Anonymous",
      rating,
      comment: review,
    };

    try {
      await addDoc(collection(db, "reviews"), reviewData);
      setRating(0);
      setReview("");
      alert("Review submitted successfully.");
      fetchReviews(); 
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedReviews = reviews.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  return (
    <div className="w-full px-4 py-10 bg-base-100">
      <div className="w-full space-y-10">
        <div className="flex gap-10 flex-col lg:flex-row">
          {hasBooked && (
            <Card className="w-full lg:w-1/2 p-6 shadow-lg rounded-xl mb-8">
              <h2 className="text-2xl font-bold mb-6">Leave a Rating</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, index) => {
                    const currentRating = index + 1;
                    return (
                      <button
                        type="button"
                        key={index}
                        onClick={() => setRating(currentRating)}
                        onMouseEnter={() => setHover(currentRating)}
                        onMouseLeave={() => setHover(0)}
                        className="focus:outline-none"
                      >
                        <FaStar
                          size={28}
                          className={`transition-colors ${
                            currentRating <= (hover || rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <textarea
                  className="textarea textarea-bordered w-full h-32 resize-none text-base"
                  placeholder="Write your review here..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  required
                ></textarea>
                <div className="text-right">
                  <button className="btn btn-primary" type="submit">
                    Submit Review
                  </button>
                </div>
              </form>
            </Card>
          )}

          <Card className="w-full lg:w-1/2 p-6 shadow-lg rounded-xl mb-8">
            <h2 className="text-2xl font-bold mb-6">Overall Rating</h2>
            <OverallRatingStats reviews={reviews} />
          </Card>
        </div>

        <Card className="w-full p-6 shadow-lg rounded-xl">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-6">
            {displayedReviews.length === 0 ? (
              <p>No reviews found for this car.</p>
            ) : (
              displayedReviews.map((rev, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-100 rounded-xl shadow-sm"
                >
                  <div className="avatar">
                    <div className="w-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${rev.username}`}
                        alt={rev.username}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-lg font-semibold">{rev.username}</h4>
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={16}
                          className={`${
                            i < rev.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm">{rev.comment}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <div className="join">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`join-item btn ${
                    currentPage === i + 1 ? "btn-primary" : "btn-outline"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReviewSection;
