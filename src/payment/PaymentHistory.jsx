import { useQuery } from '@tanstack/react-query';
import { FaMoneyBillWave, FaCreditCard, FaReceipt, FaBox, FaCalendarAlt } from 'react-icons/fa'
import { AuthContext } from '../Provider/AuthContext';
import { use } from 'react';
import AxiosSequre from '../hook/AxiosSequre';

const PaymentHistory = () => {
    const { user } = use(AuthContext);
    const AxiosSecure = AxiosSequre();

    const { data: paymentHistory, isLoading, isError } = useQuery({
        queryKey: ['paymentHistory', user?.email],
        queryFn: async () => {
            const res = await AxiosSecure.get(`/payments/${user.email}`);
            return res.data.data;
        },
        enabled: !!user?.email // Only run query if email exists
    });

    if (isLoading) return <div>Loading payment history...</div>;
    if (isError) return <div>Error loading payment history</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Your Payment History</h2>
            {paymentHistory?.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    {/* Desktop Table (md and up) */}
                    <table className="hidden md:table w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left font-medium text-gray-700 w-[15%]">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-gray-500" />
                                        <span>Date</span>
                                    </div>
                                </th>
                                <th className="py-3 px-4 text-left font-medium text-gray-700 w-[15%]">
                                    <div className="flex items-center gap-2">
                                        <FaMoneyBillWave className="text-gray-500" />
                                        <span>Amount</span>
                                    </div>
                                </th>
                                <th className="py-3 px-4 text-left font-medium text-gray-700 w-[20%]">
                                    <div className="flex items-center gap-2">
                                        <FaCreditCard className="text-gray-500" />
                                        <span>Method</span>
                                    </div>
                                </th>
                                <th className="py-3 px-4 text-left font-medium text-gray-700 w-[30%]">
                                    <div className="flex items-center gap-2">
                                        <FaReceipt className="text-gray-500" />
                                        <span>Transaction ID</span>
                                    </div>
                                </th>
                                <th className="py-3 px-4 text-left font-medium text-gray-700 w-[20%]">
                                    <div className="flex items-center gap-2">
                                        <FaBox className="text-gray-500" />
                                        <span>Parcel Details</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paymentHistory.map(payment => (
                                <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 align-middle">
                                        {new Date(payment.paid_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4 align-middle font-medium">
                                        ${payment.ammount}
                                    </td>
                                    <td className="py-3 px-4 align-middle">
                                        {payment.paymentMethod}
                                    </td>
                                    <td className="py-3 px-4 align-middle font-mono text-sm">
                                        <span className="inline-block truncate max-w-[200px]">
                                            {payment.transactionId}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 align-middle">
                                        {payment.parcelDetails?.parcelType || 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile Cards (sm and down) */}
                    <div className="md:hidden space-y-3 p-3">
                        {paymentHistory.map(payment => (
                            <div key={payment._id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-gray-500 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">Date</p>
                                            <p>{new Date(payment.paid_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMoneyBillWave className="text-gray-500 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">Amount</p>
                                            <p className="font-medium">${payment.ammount}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div className="flex items-center gap-2">
                                        <FaCreditCard className="text-gray-500 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">Method</p>
                                            <p>{payment.paymentMethod}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaBox className="text-gray-500 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">Parcel</p>
                                            <p>{payment.parcelDetails?.parcelType || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <FaReceipt className="text-gray-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500">Transaction ID</p>
                                        <p className="font-mono text-sm break-all">{payment.transactionId}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
                    <p className="text-gray-500">No payment history found</p>
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;