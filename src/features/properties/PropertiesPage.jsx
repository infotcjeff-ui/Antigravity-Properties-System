import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useProperties } from '../../hooks/useDatabase'
import { Card, CardBody, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from '@nextui-org/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import PropertyForm from './PropertyForm'

const PropertiesPage = () => {
    const { t } = useTranslation()
    const { properties, loading, deleteProperty } = useProperties()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedProperty, setSelectedProperty] = useState(null)

    const handleEdit = (property) => {
        setSelectedProperty(property)
        onOpen()
    }

    const handleAdd = () => {
        setSelectedProperty(null)
        onOpen()
    }

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this property?')) {
            try {
                await deleteProperty(id)
            } catch (error) {
                console.error('Error deleting property:', error)
            }
        }
    }

    const handleFormClose = () => {
        setSelectedProperty(null)
        onClose()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('properties.title')}
                </h1>
                <Button
                    color="primary"
                    startContent={<PlusIcon className="w-5 h-5" />}
                    onPress={handleAdd}
                >
                    {t('properties.addProperty')}
                </Button>
            </div>

            <Card>
                <CardBody>
                    <Table aria-label="Properties table">
                        <TableHeader>
                            <TableColumn>{t('properties.name')}</TableColumn>
                            <TableColumn>{t('properties.proprietor')}</TableColumn>
                            <TableColumn>{t('properties.type')}</TableColumn>
                            <TableColumn>{t('properties.status')}</TableColumn>
                            <TableColumn>{t('properties.address')}</TableColumn>
                            <TableColumn>{t('common.actions')}</TableColumn>
                        </TableHeader>
                        <TableBody
                            items={properties}
                            isLoading={loading}
                            loadingContent={<div>{t('common.loading')}</div>}
                            emptyContent={<div>No properties found</div>}
                        >
                            {(property) => (
                                <TableRow key={property.id}>
                                    <TableCell>{property.name}</TableCell>
                                    <TableCell>{property.proprietor?.name || '-'}</TableCell>
                                    <TableCell>{property.type}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${property.status === 'Renting' ? 'bg-green-100 text-green-800' :
                                                property.status === 'Holding' ? 'bg-blue-100 text-blue-800' :
                                                    property.status === 'Sold' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {property.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{property.address || '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" onPress={() => handleEdit(property)}>
                                                {t('common.edit')}
                                            </Button>
                                            <Button size="sm" color="danger" onPress={() => handleDelete(property.id)}>
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

            <Modal isOpen={isOpen} onClose={handleFormClose} size="5xl" scrollBehavior="inside">
                <ModalContent>
                    <ModalHeader>
                        {selectedProperty ? t('properties.editProperty') : t('properties.addProperty')}
                    </ModalHeader>
                    <ModalBody>
                        <PropertyForm property={selectedProperty} onClose={handleFormClose} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default PropertiesPage
