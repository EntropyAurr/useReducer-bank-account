/*
INSTRUCTIONS / CONSIDERATIONS:

1. Let's implement a simple bank account! It's similar to the example that I used as an analogy to explain how useReducer works, but it's simplified (we're not using account numbers here)

2. Use a reducer to model the following state transitions: openAccount, deposit, withdraw, requestLoan, payLoan, closeAccount. Use the `initialState` below to get started.

3. All operations (expect for opening account) can only be performed if isActive is true. If it's not, just return the original state object. You can check this right at the beginning of the reducer

4. When the account is opened, isActive is set to true. There is also a minimum deposit amount of 500 to open an account (which means that the balance will start at 500)

5. Customer can only request a loan if there is no loan yet. If that condition is met, the requested amount will be registered in the 'loan' state, and it will be added to the balance. If the condition is not met, just return the current state

6. When the customer pays the loan, the opposite happens: the money is taken from the balance, and the 'loan' will get back to 0. This can lead to negative balances, but that's no problem, because the customer can't close their account now (see next point)

7. Customer can only close an account if there is no loan, AND if the balance is zero. If this condition is not met, just return the state. If the condition is met, the account is deactivated and all money is withdrawn. The account basically gets back to the initial state
*/

import { useReducer } from "react";

const initialState = {
  balance: 0,
  loan: 0,
  totalLoan: 0,
  deposit: 0,
  withdraw: 0,
  isActive: false,
};

function reducer(state, action) {
  if (!state.isActive && action.type !== "openAccount") return state;

  switch (action.type) {
    case "openAccount":
      return { ...state, isActive: true, balance: 500 };

    case "deposit":
      return { ...state, deposit: action.payload };

    case "setDeposit":
      return { ...state, balance: state.balance + state.deposit };

    case "withdraw":
      return { ...state, withdraw: action.payload };

    case "setWithdraw":
      if (state.withdraw > state.balance) return state;

      return { ...state, balance: state.balance - state.withdraw };

    case "loan":
      return { ...state, loan: action.payload };

    case "requestLoan":
      if (state.totalLoan > 0) return state;

      return { ...state, totalLoan: state.totalLoan + state.loan, balance: state.balance + state.loan };

    case "payLoan":
      if (state.balance < state.loan) return state;

      return { ...state, totalLoan: 0, balance: state.balance - state.totalLoan };

    case "closeAccount":
      if (state.totalLoan > 0 || state.balance !== 0) return state;

      return initialState;

    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [{ balance, deposit, withdraw, loan, totalLoan, isActive }, dispatch] = useReducer(reducer, initialState);

  const setDeposit = function (e) {
    dispatch({ type: "deposit", payload: Number(e.target.value) });
  };

  const setWithdraw = function (e) {
    dispatch({ type: "withdraw", payload: Number(e.target.value) });
  };

  const requestLoan = function (e) {
    dispatch({ type: "loan", payload: Number(e.target.value) });
  };

  return (
    <div className="app">
      <h1>useReducer Bank Account</h1>
      <p>Balance: {balance}</p>
      <p>Loan: {totalLoan}</p>

      <p>
        <button onClick={() => dispatch({ type: "openAccount" })} disabled={isActive}>
          Open account
        </button>
      </p>

      <div className="input">
        <p>
          <input type="text" min={0} value={deposit} onChange={setDeposit} />
          <button onClick={() => dispatch({ type: "setDeposit" })} disabled={!isActive}>
            Deposit
          </button>
        </p>

        <p>
          <input type="text" min={0} value={withdraw} onChange={setWithdraw} />
          <button onClick={() => dispatch({ type: "setWithdraw" })} disabled={!isActive}>
            Withdraw
          </button>
        </p>

        <p>
          <input type="text" min={0} value={loan} onChange={requestLoan} />
          <button onClick={() => dispatch({ type: "requestLoan" })} disabled={!isActive}>
            Request a loan
          </button>
        </p>
      </div>

      <p>
        <button onClick={() => dispatch({ type: "payLoan" })} disabled={!isActive}>
          Pay loan
        </button>
      </p>

      <p>
        <button onClick={() => dispatch({ type: "closeAccount" })} disabled={!isActive}>
          Close account
        </button>
      </p>
    </div>
  );
}
