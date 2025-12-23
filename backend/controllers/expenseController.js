const Expense = require('../models/Expense');

// @desc    Add a new expense
// @route   POST /api/expenses
// @access  Public
const addExpense = async (req, res) => {
    try {
        const { description, amount, payer, group, splitType, splits } = req.body;

        // Validation based on splitType
        if (splitType === 'EXACT') {
            const totalSplit = splits.reduce((acc, curr) => acc + curr.amount, 0);
            if (totalSplit !== amount) {
                return res.status(400).json({ message: `Total split amount (${totalSplit}) must equal expense amount (${amount})` });
            }
        } else if (splitType === 'PERCENTAGE') {
            const totalPercent = splits.reduce((acc, curr) => acc + curr.percentage, 0);
            if (totalPercent !== 100) {
                return res.status(400).json({ message: `Total percentage (${totalPercent}) must equal 100%` });
            }
        }

        // Logic to populate 'amount' for EQUAL and PERCENTAGE if not sent from frontend?
        // Usually frontend sends the details, but let's make it robust.
        let finalSplits = splits;

        if (splitType === 'EQUAL') {
            const splitAmount = amount / splits.length;
            finalSplits = splits.map(s => ({ ...s, amount: splitAmount }));
        } else if (splitType === 'PERCENTAGE') {
            finalSplits = splits.map(s => ({ ...s, amount: (amount * s.percentage) / 100 }));
        }

        const expense = await Expense.create({
            description,
            amount,
            payer,
            group,
            splitType,
            splits: finalSplits,
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get expenses for a group
// @route   GET /api/groups/:groupId/expenses
// @access  Public
const getGroupExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find({ group: req.params.groupId })
            .populate('payer', 'name')
            .populate('splits.user', 'name');
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get group balance (Simplified)
// @route   GET /api/expenses/group/:groupId/balance
// @access  Public
const getGroupBalance = async (req, res) => {
    try {
        const { groupId } = req.params;
        const expenses = await Expense.find({ group: groupId });

        // 1. Calculate Net Balances
        const balances = {}; // { userId: amount }

        expenses.forEach(expense => {
            const payerId = expense.payer.toString();
            // Payer gets back the full amount (they "lent" it to the group)
            if (!balances[payerId]) balances[payerId] = 0;
            balances[payerId] += expense.amount;

            // Subtract from splitters (they "borrowed" it)
            expense.splits.forEach(split => {
                const debtorId = split.user.toString();
                if (!balances[debtorId]) balances[debtorId] = 0;
                balances[debtorId] -= split.amount;
            });
        });

        // 2. Simplify Debts (Min Cash Flow Algorithm)
        const givers = [];
        const receivers = [];

        for (const [userId, amount] of Object.entries(balances)) {
            if (amount < -0.01) givers.push({ userId, amount }); // Using 0.01 to handle float precision
            else if (amount > 0.01) receivers.push({ userId, amount });
        }

        const simplifiedDebts = [];

        let giverIdx = 0;
        let receiverIdx = 0;

        while (giverIdx < givers.length && receiverIdx < receivers.length) {
            const giver = givers[giverIdx];
            const receiver = receivers[receiverIdx];

            const amount = Math.min(Math.abs(giver.amount), receiver.amount);

            // Record transaction
            simplifiedDebts.push({
                from: giver.userId,
                to: receiver.userId,
                amount: Math.round(amount * 100) / 100, // Round to 2 decimals
            });

            // Adjust balances
            giver.amount += amount;
            receiver.amount -= amount;

            // Move pointers if settled
            if (Math.abs(giver.amount) < 0.01) giverIdx++;
            if (receiver.amount < 0.01) receiverIdx++;
        }

        // Populate names for better UI response
        const User = require('../models/User'); // Lazy load or move to top
        const userMap = {};
        const users = await User.find({ _id: { $in: [...Object.keys(balances)] } });
        users.forEach(u => userMap[u._id.toString()] = u.name);

        const formattedDebts = simplifiedDebts.map(d => ({
            from: { id: d.from, name: userMap[d.from] || 'Unknown' },
            to: { id: d.to, name: userMap[d.to] || 'Unknown' },
            amount: d.amount
        }));

        res.json(formattedDebts);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Settle a debt
// @route   POST /api/expenses/settle
// @access  Public
const settleDebt = async (req, res) => {
    try {
        const { payer, receiver, amount, group } = req.body;

        const expense = await Expense.create({
            description: 'Settlement',
            amount,
            payer,
            group,
            splitType: 'EXACT',
            splits: [
                {
                    user: receiver,
                    amount: amount
                }
            ]
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addExpense,
    getGroupExpenses,
    getGroupBalance,
    settleDebt
};
