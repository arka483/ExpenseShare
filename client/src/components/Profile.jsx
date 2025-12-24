import { useState, useEffect } from 'react';
import { getGroups, getGroupBalance } from '../services/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Check, X, LogOut, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [myGroups, setMyGroups] = useState([]);
    const [settlements, setSettlements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmingSettle, setConfirmingSettle] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            window.location.href = '/login';
        }
    }, []);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const { data: groups } = await getGroups(user._id);
                setMyGroups(groups);

                let allSettlements = [];
                const balancePromises = groups.map(group =>
                    getGroupBalance(group._id).then(res => ({
                        groupName: group.name,
                        groupId: group._id,
                        debts: res.data
                    }))
                );

                const groupBalances = await Promise.all(balancePromises);

                groupBalances.forEach(item => {
                    item.debts.forEach(debt => {
                        if (debt.from.name === user.name || debt.to.name === user.name) {
                            allSettlements.push({
                                ...debt,
                                groupName: item.groupName,
                                groupId: item.groupId,
                                type: debt.from.name === user.name ? 'I_OWE' : 'OWED_TO_ME'
                            });
                        }
                    });
                });

                setSettlements(allSettlements);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile data", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [user, loading]);

    const handleSettle = async (s) => {
        try {
            const { settleDebt } = await import('../services/api');
            await settleDebt({
                payer: s.from.id,
                receiver: s.to.id,
                amount: s.amount,
                group: s.groupId
            });
            toast.success('Settled successfully!');
            setConfirmingSettle(null);
            setLoading(true);
        } catch (error) {
            toast.error('Error: ' + error.message);
        }
    };

    if (!user) return null;

    const totalIOwe = settlements
        .filter(s => s.type === 'I_OWE')
        .reduce((sum, s) => sum + s.amount, 0);

    const totalOwedToMe = settlements
        .filter(s => s.type === 'OWED_TO_ME')
        .reduce((sum, s) => sum + s.amount, 0);

    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-8 pb-20"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-3xl shadow-xl text-white flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">My Dashboard</p>
                    <h1 className="text-3xl md:text-4xl font-bold">{user.name}</h1>
                    <p className="text-slate-400">{user.email}</p>
                </div>
                <button
                    onClick={() => {
                        localStorage.removeItem('currentUser');
                        window.location.href = '/login';
                    }}
                    className="relative z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-sm font-bold"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </button>
                {/* Decorative circle */}
                <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-100 rounded-xl">
                            <ArrowUpRight className="w-6 h-6 text-red-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-400">TOTAL PAYABLE</span>
                    </div>
                    <p className="text-4xl font-black text-slate-900 tracking-tight">{formatCurrency(totalIOwe)}</p>
                    <p className="text-slate-500 mt-2 text-sm">Amount you owe to others</p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-100 rounded-xl">
                            <ArrowDownLeft className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-400">TOTAL RECEIVABLE</span>
                    </div>
                    <p className="text-4xl font-black text-slate-900 tracking-tight">{formatCurrency(totalOwedToMe)}</p>
                    <p className="text-slate-500 mt-2 text-sm">Amount others owe you</p>
                </motion.div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Groups Column */}
                <div className="lg:col-span-1">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-indigo-500" /> My Groups
                    </h2>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        {myGroups.length > 0 ? (
                            <ul className="divide-y divide-slate-100">
                                {myGroups.map(group => (
                                    <li
                                        key={group._id}
                                        className="p-4 hover:bg-slate-50 cursor-pointer transition-colors flex justify-between items-center"
                                        onClick={() => window.location.href = `/groups/${group._id}`}
                                    >
                                        <div className="font-semibold text-slate-700">{group.name}</div>
                                        <div className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-full">{group.members.length} users</div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-6 text-center text-slate-500">No groups found</div>
                        )}
                    </div>
                </div>

                {/* Settlements Column */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Settlement Details</h2>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        {settlements.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">All Settled Up!</h3>
                                <p className="text-slate-500">You don't have any pending debts.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {settlements.map((s, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${s.type === 'I_OWE' ? 'bg-red-500' : 'bg-green-500'}`}>
                                                {s.type === 'I_OWE' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800">
                                                    {s.type === 'I_OWE' ? `You owe ${s.to.name}` : `${s.from.name} owes You`}
                                                </div>
                                                <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                                                    {s.groupName}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className={`text-xl font-black ${s.type === 'I_OWE' ? 'text-red-500' : 'text-green-500'}`}>
                                                {formatCurrency(s.amount)}
                                            </span>

                                            {s.type === 'I_OWE' && (
                                                confirmingSettle === idx ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleSettle(s)}
                                                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                                                            title="Confirm Payment"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmingSettle(null)}
                                                            className="bg-slate-200 hover:bg-slate-300 text-slate-600 p-2 rounded-lg transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setConfirmingSettle(idx)}
                                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-colors shadow-md hover:shadow-lg"
                                                    >
                                                        Pay
                                                    </button>
                                                )
                                            )}
                                            {s.type === 'OWED_TO_ME' && (
                                                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">Pending</span>
                                            )}
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
