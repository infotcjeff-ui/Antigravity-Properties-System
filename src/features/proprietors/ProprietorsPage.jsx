import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useProprietors } from '../../hooks/useDatabase'
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Modal, ModalContent, ModalHeader, ModalBody, Input, Textarea, useDisclosure } from '@nextui-org/react'
import { PlusIcon } from '@heroicons/react/24/outline'

const ProprietorsPage = () => {
    const { t } = useTranslation()
    const { proprietors, loading, createProprietor, updateProprietor, deleteProprietor } = useProprietors()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedProprietor, setSelectedProprietor] = useState(null)

    const [formData, setFormData] = useState({
        name: '',
        contact_info: {},
        relation_status: '',
    })

    const handleEdit = (proprietor) => {
        setSelectedProprietor(proprietor)
        setFormData({
            name: proprietor.name,
            contact_info: proprietor.contact_info || {},
            relation_status: proprietor.relation_status || '',
        })
        onOpen()
    }

    const handleAdd = () => {
        setSelectedProprietor(null)
        setFormData({
            name: '',
            contact_info: {},
            relation_status: '',
        })
        onOpen()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (selectedProprietor) {
                await updateProprietor(selectedProprietor.id, formData)
            } else {
                await createProprietor(formData)
            }
            onClose()
        } catch (error) {
            console.error('Error saving proprietor:', error)
        }
    }

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this proprietor?')) {
            try {
                await deleteProprietor(id)
            } catch (error) {
                console.error('Error deleting proprietor:', error)
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('proprietors.title')}
                </h1>
                <Button
                    color="primary"
                    startContent={<PlusIcon className="w-5 h-5" />}
                    onPress={handleAdd}
                >
                    {t('proprietors.addProprietor')}
                </Button>
            </div>

            <Card>
                <CardBody>
                    <Table aria-label="Proprietors table">
                        <TableHeader>
                            <TableColumn>{t('proprietors.name')}</TableColumn>
                            <TableColumn>{t('proprietors.contactInfo')}</TableColumn>
                            <TableColumn>{t('proprietors.relationStatus')}</TableColumn>
                            <TableColumn>{t('common.actions')}</TableColumn>
                        </TableHeader>
                        <TableBody
                            items={proprietors}
                            isLoading={loading}
                            loadingContent={<div>{t('common.loading')}</div>}
                            emptyContent={<div>No proprietors found</div>}
                        >
                            {(proprietor) => (
                                <TableRow key={proprietor.id}>
                                    <TableCell>{proprietor.name}</TableCell>
                                    <TableCell>
                                        {proprietor.contact_info ? JSON.stringify(proprietor.contact_info) : '-'}
                                    </TableCell>
                                    <TableCell>{proprietor.relation_status || '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" onPress={() => handleEdit(proprietor)}>
                                                {t('common.edit')}
                                            </Button>
                                            <Button size="sm" color="danger" onPress={() => handleDelete(proprietor.id)}>
                                                {t('common.delete')}
                                            </Button>
                                        </div>
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
                        <ModalHeader>
                            {selectedProprietor ? 'Edit Proprietor' : t('proprietors.addProprietor')}
                        </ModalHeader>
                        <ModalBody>
                            <div className="space-y-4 pb-4">
                                <Input
                                    label={t('proprietors.name')}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    variant="bordered"
                                />

                                <Textarea
                                    label={t('proprietors.contactInfo')}
                                    placeholder="Email, phone, address, etc."
                                    value={JSON.stringify(formData.contact_info)}
                                    onChange={(e) => {
                                        try {
                                            setFormData({ ...formData, contact_info: JSON.parse(e.target.value || '{}') })
                                        } catch {
                                            // Invalid JSON, ignore
                                        }
                                    }}
                                    variant="bordered"
                                />

                                <Input
                                    label={t('proprietors.relationStatus')}
                                    value={formData.relation_status}
                                    onChange={(e) => setFormData({ ...formData, relation_status: e.target.value })}
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

export default ProprietorsPage
