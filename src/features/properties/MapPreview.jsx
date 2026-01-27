import { Card, CardBody } from '@nextui-org/react'
import { MapPinIcon } from '@heroicons/react/24/outline'

const MapPreview = ({ address }) => {
    // Mock Google Maps preview
    // In production, you would use the Google Maps Embed API or Static Maps API

    return (
        <Card>
            <CardBody className="p-4">
                <div className="flex items-start gap-3">
                    <MapPinIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                        <h4 className="font-semibold mb-2">Location Preview</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{address}</p>

                        {/* Mock Map Placeholder */}
                        <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">
                                    Map preview would appear here
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    (Requires Google Maps API key)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}

export default MapPreview
