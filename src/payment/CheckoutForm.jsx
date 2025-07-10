import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { use, useState } from 'react';
import { useParams } from 'react-router';
import AxiosSequre from '../hook/AxiosSequre';
import { AuthContext } from '../Provider/AuthContext';
import Swal from 'sweetalert2';


const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { parcelId } = useParams()
    const AxiosSecure = AxiosSequre();
    const { user } = use(AuthContext)


    //console.log(parcelId);
    /////////////////////////////////////////
    const { isPending, isError, data: parcelInfo = {} } = useQuery({
        queryKey: ['parcelkey', parcelId],
        queryFn: async () => {
            const res = await AxiosSecure.get(`/parcels/${parcelId}`);
            return res.data.data;
        },
    })

    // console.log(parcelInfo);

    const ammount = parcelInfo.cost
    const ammountIncents = ammount * 100

    if (isPending) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error: {error.message}</span>
    }
    ///////////////////////////////////////////////////

    const handlesubmit = async (e) => {

        e.preventDefault();
        setLoading(true);
        try {
            // ... payment logic
            if (!stripe || !elements) {
                return;
            }

            const card = elements.getElement(CardElement);
            if (card == null) {
                return;
            }

            //vailded the card
            const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card,
            });

            if (stripeError) {
                console.log('[error]', stripeError);
                setError(stripeError.message);
            } else {
                setError('');
                console.log('[PaymentMethod]', paymentMethod);

                //create payment intent
                const res = await AxiosSecure.post('/create-payment-intent', {
                    ammountIncents,
                    parcelId
                })

                const clientSecret = res.data.clientSecret
                //console.log(clientSecret);

                // confirm payment
                const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardElement),
                        billing_details: {
                            name: user.displayName,
                            email: user.email,
                        },
                    },
                });

                if (result.error) {
                    setError(result.error.message);
                } else {
                    setError('')
                    if (result.paymentIntent.status === 'succeeded') {
                        console.log('Payment succeeded!');
                        console.log(result);
                        // mark parcel paid and save history

                        const paymentData = {
                            parcelId,
                            email: user.email,
                            ammount,
                            paymentMethod: result.paymentIntent.payment_method_types,
                            transactionId: result.paymentIntent.id,

                        }

                        const paymentres = await AxiosSecure.post('/payments', paymentData)
                        if (paymentres.data.insertedId) {
                            console.log('payment successful');
                            Swal.fire({
                                title: "Payed!",
                                text: "Your payment has done.",
                                icon: "success"
                            });
                        }
                    }

                }
            }
        } finally {
            setLoading(false);
        }



    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <form onSubmit={handlesubmit} className="space-y-6">
                <div className="border border-gray-300 rounded-lg p-4">
                    <CardElement
                        className="w-full"
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${!stripe
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                >
                    Pay Now $ {ammount}
                </button>
                {error && <p className='text-red-500'>{error}</p>}
            </form>
        </div>
    );
};

export default CheckoutForm;