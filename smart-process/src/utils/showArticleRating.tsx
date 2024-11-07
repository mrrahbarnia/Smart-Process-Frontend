import { AiFillStar } from "react-icons/ai";

function StarRating({ rating }: {rating: number}) {
    return (
        <div className="flex">
        {Array.from({ length: 5 }, (_, index) => (
            <AiFillStar
            key={index}
            size={20}
            color={index < rating ? '#ffc133' : 'gray'}
            className="mr-1"
            />
        ))}
        </div>
    );
}

export default StarRating;