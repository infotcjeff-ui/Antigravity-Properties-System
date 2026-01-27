import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTransactions, useProperties } from '../../hooks/useDatabase'
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Modal, ModalContent, ModalHeader, ModalBody, Input, Select, SelectItem, useDisclosure } from '@nextui-org/react'
import { PlusIcon } from '@heroicons/react/24/outline'

const RentOutPage = () => {
    const { t } = useTranslation()
    const { transactions, loading, createTransaction, deleteTransaction } = useTransactions()
    const { properties } = useProperties()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [formData, setFormData] = useState({
        property_id: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        party_name: '',
        description: '',
    })

    const income = transactions.filter((t) => t.type === 'income')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createTransaction({
                ...formData,
                type: 'income',
                amount: parseFloat(formData.amount),
            })
            setFormData({
                property_id: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                party_name: '',
                description: '',
            })
            onClose()
        } catch (error) {
            console.error('Error creating transaction:', error)
        }
    }

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            try {
                await deleteTransaction(id)
            } catch (error) {
                console.error('Error deleting transaction:', error)
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('nav.rentout')}
                </h1>
                <Button
                    color="primary"
                    startContent={<PlusIcon className="w-5 h-5" />}
                    onPress={onOpen}
                >
                    {t('transactions.addTransaction')}
                </Button>
            </div>

            <Card>
                <CardBody>
                    <Table aria-label="Rent out income table">
                        <TableHeader>
                            <TableColumn>{t('properties.name')}</TableColumn>
                            <TableColumn>{t('transactions.amount')}</TableColumn>
                            <TableColumn>{t('transactions.date')}</TableColumn>
                            <TableColumn>{t('transactions.partyName')}</TableColumn>
                            <TableColumn>{t('transactions.description')}</TableColumn>
                            <TableColumn>{t('common.actions')}</TableColumn>
                        </TableHeader>
                        <TableBody
                            items={income}
                            isLoading={loading}
                            loadingContent={<div>{t('common.loading')}</div>}
                            emptyContent={<div>No income found</div>}
                        >
                            {(transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{transaction.property?.name || '-'}</TableCell>
                                    <TableCell className="text-green-600 font-semibold">
                                        ${transaction.amount?.toLocaleString()}
                                    </TableCell>
                                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{transaction.party_name || '-'}</TableCell>
                                    <TableCell>{transaction.description || '-'}</TableCell>
                                    <TableCell>
                                        <Button size="sm" color="danger" onPress={() => handleDelete(transaction.id)}>
                                            {t('common.delete')}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <form onSubmit={handleSubmit}>
                        <ModalHeader>{t('transactions.addTransaction')}</ModalHeader>
                        <ModalBody>
                            <div className="space-y-4 pb-4">
                                <Select
                                    label={t('properties.name')}
                                    selectedKeys={formData.property_id ? [formData.property_id] : []}
                                    onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
                                    required
                                    variant="bordered"
                                >
                                    {properties.map((property) => (
                                        <SelectItem key={property.id} value={property.id}>
                                            {property.name}
                                        </SelectItem>
                                    ))}
                                </Select>

                                <Input
                                    type="number"
                                    label={t('transactions.amount')}
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    required
                                    variant="bordered"
                                    startContent={<span className="text-gray-500">$</span>}
                                />

                                <Input
                                    type="date"
                                    label={t('transactions.date')}
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                    variant="bordered"
                                />

                                <Input
                                    label={t('transactions.partyName')}
                                    value={formData.party_name}
                                    onChange={(e) => setFormData({ ...formData, party_name: e.target.value })}
                                    variant="bordered"
                                />

                                <Input
                                    label={t('transactions.description')}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    variant="bordered"
                                />

                                <div className="flex justify-end gap-3">
                                    <Button variant="flat" onPress={onClose}>
                                        {t('common.cancel')}
                                    </Button>
                                    <Button type="submit" color="primary">
                                        {t('common.save')}
                                    </Button>
                                </div>
                            </div>
                        </ModalBody>
                    </form>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default RentOutPage
