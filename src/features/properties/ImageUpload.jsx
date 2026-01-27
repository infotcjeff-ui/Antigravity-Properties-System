import { useCallback } from 'react'
import { Card, CardBody, Button } from '@nextui-org/react'
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const ImageUpload = ({ images = [], onImagesChange, onRemoveImage, maxImages = 5, loading = false }) => {
    const handleDrop = useCallback(
        (e) => {
            e.preventDefault()
            const files = Array.from(e.dataTransfer.files).filter((file) =>
                file.type.startsWith('image/')
            )
            if (files.length > 0) {
                onImagesChange(files)
            }
        },
        [onImagesChange]
    )

    const handleDragOver = (e) => {
        e.preventDefault()
    }

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files)
        if (files.length > 0) {
            onImagesChange(files)
        }
    }

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            {images.length < maxImages && (
                <Card
                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <CardBody className="p-8">
                        <label className="flex flex-col items-center justify-center cursor-pointer">
                            <PhotoIcon className="w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Drag & drop images here, or click to select
                            </p>
                            <p className="text-xs text-gray-500">
                                {images.length}/{maxImages} images uploaded
                            </p>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                disabled={loading}
                            />
                        </label>
                    </CardBody>
                </Card>
            )}

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {images.map((url, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative group"
                        >
                            <img
                                src={url}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                            />
                            <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onPress={() => onRemoveImage(index)}
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    ))}
                </div>
            )}

            {loading && (
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Uploading images...
                </div>
            )}
        </div>
    )
}

export default ImageUpload
