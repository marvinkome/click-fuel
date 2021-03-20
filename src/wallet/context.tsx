import { Wallet } from "ethers"
import React, { createContext, useCallback, useContext, useMemo, useReducer } from "react"

const REDUCER_ACTIONS = {
    INIT: "initialize",
    ADD_ACCOUNT: "addAccount",
    RESET: "reset",
}

export const WalletContext = createContext([
    // state
    {
        account: null as string,
        address: null as string,
    },

    // actions
    {
        initialize: (account?: string, address?: string) => null,
        addAccount: (account?: string) => null,
        reset: () => null,
    },
])

export function useClientContext() {
    return useContext(WalletContext)
}

export const WalletProvider: React.FC<{ address?: string }> = ({ address, children }) => {
    const initialState = {
        account: null,
        address,
    }

    const reducer = (state, action) => {
        switch (action.type) {
            case REDUCER_ACTIONS.INIT: {
                const { account, address } = action.payload
                return { ...state, account, address }
            }

            case REDUCER_ACTIONS.ADD_ACCOUNT: {
                const { account } = action.payload
                const address = Wallet.fromMnemonic(account).address

                return { ...state, account, address }
            }

            case REDUCER_ACTIONS.RESET: {
                return { account: null, address: null }
            }

            default:
                throw new Error()
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState)

    const initialize = useCallback((account?: string, address?: string) => {
        dispatch({ type: REDUCER_ACTIONS.INIT, payload: { account, address } })
    }, [])

    const addAccount = useCallback((account?: string) => {
        dispatch({ type: REDUCER_ACTIONS.ADD_ACCOUNT, payload: { account } })
    }, [])

    const reset = useCallback(() => {
        dispatch({ type: REDUCER_ACTIONS.RESET, payload: {} })
    }, [])

    const value = useMemo(() => {
        return [state, { initialize, addAccount, reset }]
    }, [state, initialize, addAccount, reset])

    return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}
