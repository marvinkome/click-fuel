import { Wallet } from "ethers"
import React, { createContext, useCallback, useContext, useMemo, useReducer } from "react"

const REDUCER_ACTIONS = {
    INIT: "initialize",
    ADD_ACCOUNT: "addAccount",
    UPDATE_BALANCE: "updateBalance",
    RESET: "reset",
}

export const WalletContext = createContext([
    // state
    {
        account: null as string,
        address: null as string,
        balance: 0 as number,
    },

    // actions
    {
        initialize: (account?: string, address?: string, balance?: number) => null,
        addAccount: (account?: string) => null,
        updateBalance: (balance: number) => null,
        reset: () => null,
    },
])

export function useClientContext() {
    return useContext(WalletContext)
}

function useContextReducer(address: string) {
    const initialState = {
        account: null,
        address,
        balance: 0,
    }

    const reducer = (state, action) => {
        switch (action.type) {
            case REDUCER_ACTIONS.INIT: {
                const { account, address, balance } = action.payload
                return { ...state, account, address, balance }
            }

            case REDUCER_ACTIONS.ADD_ACCOUNT: {
                const { account } = action.payload
                const address = Wallet.fromMnemonic(account).address

                return { ...state, account, address }
            }

            case REDUCER_ACTIONS.UPDATE_BALANCE: {
                const { balance } = action.payload
                return { ...state, balance }
            }

            case REDUCER_ACTIONS.RESET: {
                return { account: null, address: null }
            }

            default:
                throw new Error()
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState)

    const initialize = useCallback((account?: string, address?: string, balance?: number) => {
        dispatch({ type: REDUCER_ACTIONS.INIT, payload: { account, address, balance } })
    }, [])

    const addAccount = useCallback((account?: string) => {
        dispatch({ type: REDUCER_ACTIONS.ADD_ACCOUNT, payload: { account } })
    }, [])

    const updateBalance = useCallback((balance: number) => {
        dispatch({ type: REDUCER_ACTIONS.UPDATE_BALANCE, payload: { balance } })
    }, [])

    const reset = useCallback(() => {
        dispatch({ type: REDUCER_ACTIONS.RESET, payload: {} })
    }, [])

    return { state, initialize, addAccount, updateBalance, reset }
}

export const WalletProvider: React.FC<{ address?: string }> = ({ address, children }) => {
    const { state, ...actions } = useContextReducer(address)
    const value = useMemo(() => [state, actions], [state, actions])

    return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}
