import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

// Properties hooks
export const useProperties = () => {
    const [properties, setProperties] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchProperties = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('properties')
                .select(`
          *,
          proprietor:proprietors(id, name)
        `)
                .order('created_at', { ascending: false })

            if (error) throw error
            setProperties(data || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProperties()
    }, [])

    const createProperty = async (propertyData) => {
        const { data, error } = await supabase
            .from('properties')
            .insert([propertyData])
            .select()
            .single()

        if (error) throw error
        await fetchProperties()
        return data
    }

    const updateProperty = async (id, propertyData) => {
        const { data, error } = await supabase
            .from('properties')
            .update(propertyData)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        await fetchProperties()
        return data
    }

    const deleteProperty = async (id) => {
        const { error } = await supabase
            .from('properties')
            .delete()
            .eq('id', id)

        if (error) throw error
        await fetchProperties()
    }

    return {
        properties,
        loading,
        error,
        createProperty,
        updateProperty,
        deleteProperty,
        refetch: fetchProperties,
    }
}

// Proprietors hooks
export const useProprietors = () => {
    const [proprietors, setProprietors] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchProprietors = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('proprietors')
                .select('*')
                .order('name', { ascending: true })

            if (error) throw error
            setProprietors(data || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProprietors()
    }, [])

    const createProprietor = async (proprietorData) => {
        const { data, error } = await supabase
            .from('proprietors')
            .insert([proprietorData])
            .select()
            .single()

        if (error) throw error
        await fetchProprietors()
        return data
    }

    const updateProprietor = async (id, proprietorData) => {
        const { data, error } = await supabase
            .from('proprietors')
            .update(proprietorData)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        await fetchProprietors()
        return data
    }

    const deleteProprietor = async (id) => {
        const { error } = await supabase
            .from('proprietors')
            .delete()
            .eq('id', id)

        if (error) throw error
        await fetchProprietors()
    }

    return {
        proprietors,
        loading,
        error,
        createProprietor,
        updateProprietor,
        deleteProprietor,
        refetch: fetchProprietors,
    }
}

// Transactions hooks
export const useTransactions = (propertyId = null) => {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchTransactions = async () => {
        try {
            setLoading(true)
            let query = supabase
                .from('transactions')
                .select(`
          *,
          property:properties(id, name)
        `)
                .order('date', { ascending: false })

            if (propertyId) {
                query = query.eq('property_id', propertyId)
            }

            const { data, error } = await query

            if (error) throw error
            setTransactions(data || [])
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [propertyId])

    const createTransaction = async (transactionData) => {
        const { data, error } = await supabase
            .from('transactions')
            .insert([transactionData])
            .select()
            .single()

        if (error) throw error
        await fetchTransactions()
        return data
    }

    const updateTransaction = async (id, transactionData) => {
        const { data, error } = await supabase
            .from('transactions')
            .update(transactionData)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        await fetchTransactions()
        return data
    }

    const deleteTransaction = async (id) => {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)

        if (error) throw error
        await fetchTransactions()
    }

    return {
        transactions,
        loading,
        error,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        refetch: fetchTransactions,
    }
}
