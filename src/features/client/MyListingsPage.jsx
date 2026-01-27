import { useTranslation } from 'react-i18next'
import { useProperties } from '../../hooks/useDatabase'
import { Card, CardBody, Switch } from '@nextui-org/react'
import { motion } from 'framer-motion'

const MyListingsPage = () => {
    const { t } = useTranslation()
    const { properties, loading, updateProperty } = useProperties()

    const handleToggleListing = async (property) => {
        try {
            await updateProperty(property.id, {
                is_listed: !property.is_listed,
            })
        } catch (error) {
            console.error('Error toggling listing:', error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('nav.myListings')}
                </h1>
            </div>

            {loading ? (
                <div className="text-center py-12">{t('common.loading')}</div>
            ) : properties.length === 0 ? (
                <Card>
                    <CardBody className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">No properties assigned to you</p>
                    </CardBody>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property, index) => (
                        <motion.div
                            key={property.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full">
                                <CardBody className="p-6">
                                    {/* Property Image */}
                                    {property.images && property.images.length > 0 ? (
                                        <img
                                            src={property.images[0]}
                                            alt={property.name}
                                            className="w-full h-48 object-cover rounded-lg mb-4"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                                            <span className="text-gray-400">No image</span>
                                        </div>
                                    )}

                                    {/* Property Details */}
                                    <h3 className="text-xl font-semibold mb-2">{property.name}</h3>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">{t('properties.type')}:</span>
                                            <span className="font-medium">{property.type}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">{t('properties.status')}:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${property.status === 'Renting' ? 'bg-green-100 text-green-800' :
                                                    property.status === 'Holding' ? 'bg-blue-100 text-blue-800' :
                                                        property.status === 'Sold' ? 'bg-gray-100 text-gray-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {property.status}
                                            </span>
                                        </div>
                                        {property.address && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">{t('properties.address')}:</span>
                                                <span className="font-medium text-right">{property.address}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* List/Unlist Toggle */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <span className="text-sm font-medium">
                                            {property.is_listed ? 'Listed for Rent' : 'Not Listed'}
                                        </span>
                                        <Switch
                                            isSelected={property.is_listed}
                                            onValueChange={() => handleToggleListing(property)}
                                            color="success"
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyListingsPage
