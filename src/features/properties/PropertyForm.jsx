import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useProperties, useProprietors } from '../../hooks/useDatabase'
import { uploadImage } from '../../utils/supabase'
import { Input, Select, SelectItem, Button, Checkbox, useDisclosure } from '@nextui-org/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import ProprietorModal from './ProprietorModal'
import ImageUpload from './ImageUpload'
import MapPreview from './MapPreview'

const PROPERTY_TYPES = ['Group Asset', 'Co-investment', 'Leased In', 'Managed Asset']
const PROPERTY_STATUSES = ['Holding', 'Renting', 'Sold', 'Suspended']
const LAND_USES = ['Unknown', 'Open Storage', 'Residential A', 'Open Space', 'Village Dev', 'Nature Reserve']

const PropertyForm = ({ property, onClose }) => {
    const { t } = useTranslation()
    const { createProperty, updateProperty } = useProperties()
    const { proprietors, refetch: refetchProprietors } = useProprietors()
    const { isOpen, onOpen, onClose: onProprietorModalClose } = useDisclosure()

    const [formData, setFormData] = useState({
        name: '',
        proprietor_id: '',
        type: 'Group Asset',
        status: 'Holding',
        land_use: 'Unknown',
        address: '',
        lot_number: '',
        area_sqft: '',
        code: '',
        floor_plan_url: '',
        has_planning_permission: false,
        is_listed: false,
        images: [],
        map_images: [],
    })

    const [loading, setLoading] = useState(false)
    const [uploadingImages, setUploadingImages] = useState(false)

    useEffect(() => {
        if (property) {
            setFormData({
                name: property.name || '',
                proprietor_id: property.proprietor_id || '',
                type: property.type || 'Group Asset',
                status: property.status || 'Holding',
                land_use: property.land_use || 'Unknown',
                address: property.address || '',
                lot_number: property.lot_number || '',
                area_sqft: property.area_sqft || '',
                code: property.code || '',
                floor_plan_url: property.floor_plan_url || '',
                has_planning_permission: property.has_planning_permission || false,
                is_listed: property.is_listed || false,
                images: property.images || [],
                map_images: property.map_images || [],
            })
        }
    }, [property])

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleAddressBlur = async () => {
        // Mock Google Maps API call
        // In production, you would call the actual Google Maps Geocoding API
        if (formData.address && !formData.lot_number) {
            // Simulate API delay
            setTimeout(() => {
                // Mock lot number generation
                const mockLotNumber = `LOT-${Math.floor(Math.random() * 10000)}`
                handleChange('lot_number', mockLotNumber)
            }, 500)
        }
    }

    const handleImagesChange = async (files) => {
        if (files.length + formData.images.length > 5) {
            alert('Maximum 5 images allowed')
            return
        }

        // Validate total size (5MB)
        const totalSize = files.reduce((acc, file) => acc + file.size, 0)
        if (totalSize > 5 * 1024 * 1024) {
            alert('Total file size must not exceed 5MB')
            return
        }

        setUploadingImages(true)
        try {
            const uploadPromises = files.map((file) => uploadImage(file))
            const urls = await Promise.all(uploadPromises)
            handleChange('images', [...formData.images, ...urls])
        } catch (error) {
            console.error('Error uploading images:', error)
            alert('Error uploading images')
        } finally {
            setUploadingImages(false)
        }
    }

    const handleMapImagesChange = async (files) => {
        if (files.length + formData.map_images.length > 2) {
            alert('Maximum 2 map images allowed')
            return
        }

        setUploadingImages(true)
        try {
            const uploadPromises = files.map((file) => uploadImage(file))
            const urls = await Promise.all(uploadPromises)
            handleChange('map_images', [...formData.map_images, ...urls])
        } catch (error) {
            console.error('Error uploading map images:', error)
            alert('Error uploading map images')
        } finally {
            setUploadingImages(false)
        }
    }

    const handleRemoveImage = (index, type = 'images') => {
        const newImages = [...formData[type]]
        newImages.splice(index, 1)
        handleChange(type, newImages)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const dataToSubmit = {
                ...formData,
                area_sqft: formData.area_sqft ? parseFloat(formData.area_sqft) : null,
            }

            if (property) {
                await updateProperty(property.id, dataToSubmit)
            } else {
                await createProperty(dataToSubmit)
            }

            onClose()
        } catch (error) {
            console.error('Error saving property:', error)
            alert('Error saving property')
        } finally {
            setLoading(false)
        }
    }

    const handleProprietorCreated = (newProprietor) => {
        refetchProprietors()
        handleChange('proprietor_id', newProprietor.id)
        onProprietorModalClose()
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6 pb-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label={t('properties.name')}
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                        variant="bordered"
                    />

                    <div className="flex gap-2">
                        <Select
                            label={t('properties.proprietor')}
                            selectedKeys={formData.proprietor_id ? [formData.proprietor_id] : []}
                            onChange={(e) => handleChange('proprietor_id', e.target.value)}
                            variant="bordered"
                            className="flex-1"
                        >
                            {proprietors.map((proprietor) => (
                                <SelectItem key={proprietor.id} value={proprietor.id}>
                                    {proprietor.name}
                                </SelectItem>
                            ))}
                        </Select>
                        <Button
                            isIconOnly
                            color="primary"
                            variant="flat"
                            onPress={onOpen}
                            className="mt-1"
                        >
                            <PlusIcon className="w-5 h-5" />
                        </Button>
                    </div>

                    <Select
                        label={t('properties.type')}
                        selectedKeys={[formData.type]}
                        onChange={(e) => handleChange('type', e.target.value)}
                        variant="bordered"
                    >
                        {PROPERTY_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                        ))}
                    </Select>

                    <Select
                        label={t('properties.status')}
                        selectedKeys={[formData.status]}
                        onChange={(e) => handleChange('status', e.target.value)}
                        variant="bordered"
                    >
                        {PROPERTY_STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </Select>

                    <Select
                        label={t('properties.landUse')}
                        selectedKeys={[formData.land_use]}
                        onChange={(e) => handleChange('land_use', e.target.value)}
                        variant="bordered"
                    >
                        {LAND_USES.map((landUse) => (
                            <SelectItem key={landUse} value={landUse}>
                                {landUse}
                            </SelectItem>
                        ))}
                    </Select>

                    <Input
                        label={t('properties.code')}
                        value={formData.code}
                        onChange={(e) => handleChange('code', e.target.value)}
                        variant="bordered"
                    />

                    <Input
                        label={t('properties.areaSquareFeet')}
                        type="number"
                        value={formData.area_sqft}
                        onChange={(e) => handleChange('area_sqft', e.target.value)}
                        variant="bordered"
                    />
                </div>

                {/* Address & Location */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Location Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label={t('properties.address')}
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            onBlur={handleAddressBlur}
                            variant="bordered"
                            className="md:col-span-2"
                        />

                        <Input
                            label={t('properties.lotNumber')}
                            value={formData.lot_number}
                            onChange={(e) => handleChange('lot_number', e.target.value)}
                            variant="bordered"
                        />

                        <Input
                            label={t('properties.floorPlan')}
                            value={formData.floor_plan_url}
                            onChange={(e) => handleChange('floor_plan_url', e.target.value)}
                            variant="bordered"
                            placeholder="URL to floor plan"
                        />
                    </div>

                    {formData.address && (
                        <MapPreview address={formData.address} />
                    )}
                </div>

                {/* Images */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{t('properties.images')} (Max 5, Total 5MB)</h3>
                    <ImageUpload
                        images={formData.images}
                        onImagesChange={handleImagesChange}
                        onRemoveImage={(index) => handleRemoveImage(index, 'images')}
                        maxImages={5}
                        loading={uploadingImages}
                    />
                </div>

                {/* Map Images */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{t('properties.mapImages')} (Max 2)</h3>
                    <ImageUpload
                        images={formData.map_images}
                        onImagesChange={handleMapImagesChange}
                        onRemoveImage={(index) => handleRemoveImage(index, 'map_images')}
                        maxImages={2}
                        loading={uploadingImages}
                    />
                </div>

                {/* Checkboxes */}
                <div className="flex gap-6">
                    <Checkbox
                        isSelected={formData.has_planning_permission}
                        onValueChange={(value) => handleChange('has_planning_permission', value)}
                    >
                        {t('properties.hasPlanningPermission')}
                    </Checkbox>

                    <Checkbox
                        isSelected={formData.is_listed}
                        onValueChange={(value) => handleChange('is_listed', value)}
                    >
                        {t('properties.isListed')}
                    </Checkbox>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <Button variant="flat" onPress={onClose}>
                        {t('common.cancel')}
                    </Button>
                    <Button type="submit" color="primary" isLoading={loading}>
                        {t('common.save')}
                    </Button>
                </div>
            </form>

            {/* Proprietor Modal */}
            <ProprietorModal
                isOpen={isOpen}
                onClose={onProprietorModalClose}
                onProprietorCreated={handleProprietorCreated}
            />
        </>
    )
}

export default PropertyForm
