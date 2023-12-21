import React, { useEffect, useState } from "react";
import { Button } from "../Button";

const RatingStars = ({
  ratingValue,
  setRating,
  setTrackingNumber,
}: {
  ratingValue: number;
  setRating?: React.Dispatch<React.SetStateAction<number | undefined>>;
  setTrackingNumber?: () => void;
}) => {
  const numberOfStars = 5;
  const [selectedRating, setSelectedRating] = useState(ratingValue);
  const [currentHoverValue, setCurrentHoverValue] = useState(ratingValue);
  const isDisabled = ratingValue !== 0;

  useEffect(() => {
    setSelectedRating(ratingValue);
  }, [ratingValue]);

  return (
    <div className="flex flex-col gap-2 items-center">
      <div
        className="rating"
        onMouseLeave={() => {
          if (!isDisabled) {
            setCurrentHoverValue(0);
          }
        }}
      >
        <input
          type="radio"
          name="rating"
          className="rating-hidden"
          onChange={() => setSelectedRating(0)}
        />
        {[...Array(numberOfStars)].map((_, idx) => {
          return (
            <input
              key={idx}
              type="radio"
              name="rating"
              className={`mask mask-star-2 bg-primary_orange  ${
                idx + 1 <= currentHoverValue || idx + 1 <= selectedRating
                  ? "opacity-100"
                  : "opacity-20"
              } ${selectedRating !== 0 && !isDisabled && "opacity-100"} ${
                isDisabled && "cursor-default"
              }`}
              value={idx + 1}
              onMouseOver={(e) => {
                if (!isDisabled) {
                  setCurrentHoverValue(
                    Number((e.target as HTMLInputElement).value)
                  );
                }
              }}
              checked={!isDisabled ? selectedRating === idx + 1 : false}
              onChange={() => setSelectedRating(idx + 1)}
              disabled={isDisabled}
            />
          );
        })}
      </div>
      {!isDisabled && (
        <div>
          <Button
            withoutHoverEffect
            onClick={() => {
              if (setRating !== undefined && setTrackingNumber !== undefined) {
                setRating(selectedRating);
                setTrackingNumber();
              }
            }}
          >
            Submit Review
          </Button>
        </div>
      )}
    </div>
  );
};

export default RatingStars;
