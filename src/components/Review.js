/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import ReactStars from 'react-stars';
import { reviewsRef, db } from '../firebase/firebase';
import { addDoc, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { TailSpin, ThreeDots } from 'react-loader-spinner';
import swal from 'sweetalert';
import { Appstate } from '../App';
import { useNavigate } from 'react-router-dom';

const Review = ({ id, prevRating, rated }) => {
    const useAppstate = useContext(Appstate);
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [reviewLoading, setReviewsLoading] = useState(false);
    const [thoughts, setThoughts] = useState('');
    const [data, setData] = useState([]);
    const [addNew, addnew] = useState(0);

    const sendReview = async () => {
        setLoading(true);
        try {
            if (useAppstate.login) {
                await addDoc(reviewsRef, {
                    movieid: id,
                    name: useAppstate.userName,
                    rating: rating,
                    thought: thoughts,
                    timestamp: new Date().getTime(),
                })
                const ref = doc(db, "movies", id);
                await updateDoc(ref, {
                    rating: prevRating + rating,
                    rated: rated + 1
                })

                setRating(0);
                setThoughts('');
                addnew(addNew + 1);

                swal({
                    title: "Review Sent",
                    icon: 'success',
                    buttons: false,
                    timer: 3000

                })
            } else {
                navigate('/login');
            }
        } catch (error) {
            swal({
                title: error.message,
                icon: 'error',
                buttons: false,
                timer: 3000

            })

        }
        setLoading(false);
    }

    useEffect(() => {
        async function getData() {
            setReviewsLoading(true);
            setData([]);
            try {

                let quer = query(reviewsRef, where('movieid', '==', id));
                const querySnapshot = await getDocs(quer);
                querySnapshot.forEach((doc) => {
                    setData((prev) => [...prev, doc.data()]);
                })
            } catch (error) {
                console.log(error.message);
            }
            setReviewsLoading(false);
        }
        getData();
    }, [addNew])

    return (
        <div className='mt-4 border-t-2 border-gray-700 w-full'>
            <ReactStars
                size={30}
                half={true}
                edit={true}
                value={rating}
                onChange={(e) => setRating(e)}
            />
            <input
                placeholder='Share your thoughts..'
                className='w-full p-2 outline-none header'
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
            />
            <button onClick={sendReview} className='w-full p-2 flex justify-center bg-green-500 mt-2'>
                {loading ? <TailSpin height={15} color='white' /> : 'Share'}
            </button>
            {
                reviewLoading ?
                    <div className='mt-6 flex justify-center'><ThreeDots height={15} color='white' /></div>
                    :
                    <div className='mt-4'>
                        {/* <h1 className='text-bold bg-black'>Reviews</h1> */}
                        {data.map((e, i) => {
                            return (
                                <div className='p-2 w-full mt-2 border-b header bg-opacity-50' key={i}>
                                    <div className='flex items-center'>
                                        <p className='text-blue-500'>{e.name}</p>
                                        <p className='ml-2 text-xs'>({new Date(e.timestamp).toLocaleString()})</p>
                                    </div>
                                    <ReactStars
                                        size={15}
                                        half={true}
                                        edit={false}
                                        value={e.rating}
                                    />
                                    <p>{e.thought}</p>
                                </div>
                            )
                        })}
                    </div>
            }
        </div>
    )
}

export default Review