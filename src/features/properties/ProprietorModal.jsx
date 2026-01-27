import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useProprietors } from '../../hooks/useDatabase'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Button, Textarea } from '@nextui-org/react'

const ProprietorModal = ({ isOpen, onClose, onProprietorCreated }) => {
    const { t } = useTranslation()
    const { createProprietor } = useProprietors()
    const [formData, setFormData] = useState({
        name: '',
        contact_info: {},
        relation_status: '',
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const newProprietor = await createProprietor(formData)
            onProprietorCreated(newProprietor)
            setFormData({ name: '', contact_info: {}, relation_status: '' })
        } catch (error) {
            console.error('Error creating proprietor:', error)
            alert('Error creating proprietor')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <form onSubmit={handleSubmit}>
                    <ModalHeader>{t('properties.createNewProprietor')}</ModalHeader>
                    <ModalBody>
                        <div className="space-y-4">
                            <Input
                                label={t('proprietors.name')}
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                required
                                variant="bordered"
                            />

                            <Textarea
                                label={t('proprietors.contactInfo')}
                                placeholder="Email, phone, address, etc."
                                value={JSON.stringify(formData.contact_info)}
                                onChange={(e) => {
                                    try {
                                        handleChange('contact_info', JSON.parse(e.target.value || '{}'))
                                    } catch {
                                        // Invalid JSON, ignore
                                    }
                                }}
                                variant="bordered"
                            />

                            <Input
                                label={t('proprietors.relationStatus')}
                                value={formData.relation_status}
                                onChange={(e) => handleChange('relation_status', e.target.value)}
                                variant="bordered"
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={onClose}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" color="primary" isLoading={loading}>
                            {t('common.save')}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )
}

export default ProprietorModal
