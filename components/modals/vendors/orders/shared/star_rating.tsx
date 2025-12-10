interface StarRatingProps {
  rating: number;
  showLabel?: boolean;
}

export const StarRating = ({ rating, showLabel = true }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <span className="text-sm font-normal font-manrope">{rating}</span>
      )}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={star <= Math.floor(rating) ? "#FFB400" : "none"}
            stroke={star <= Math.floor(rating) ? "#FFB400" : "#FFB400"}
            strokeWidth="2"
            className="shrink-0"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        ))}
      </div>
    </div>
  );
};
