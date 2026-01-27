import { useTranslation } from 'react-i18next'
import { Card, CardBody } from '@nextui-org/react'

const ShowAllPage = () => {
    const { t } = useTranslation()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('nav.dashboard')}
                </h1>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Properties Card */}
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600">
                    <CardBody className="p-6">
                        <div className="text-white">
                            <p className="text-sm opacity-90">Total Properties</p>
                            <h3 className="text-4xl font-bold mt-2">0</h3>
                        </div>
                    </CardBody>
                </Card>

                {/* Total Income Card */}
                <Card className="bg-gradient-to-br from-green-500 to-green-600">
                    <CardBody className="p-6">
                        <div className="text-white">
                            <p className="text-sm opacity-90">Total Income</p>
                            <h3 className="text-4xl font-bold mt-2">$0</h3>
                        </div>
                    </CardBody>
                </Card>

                {/* Total Expenses Card */}
                <Card className="bg-gradient-to-br from-red-500 to-red-600">
                    <CardBody className="p-6">
                        <div className="text-white">
                            <p className="text-sm opacity-90">Total Expenses</p>
                            <h3 className="text-4xl font-bold mt-2">$0</h3>
                        </div>
                    </CardBody>
                </Card>

                {/* Recent Properties - Spans 2 columns */}
                <Card className="md:col-span-2">
                    <CardBody className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Recent Properties</h3>
                        <p className="text-gray-500 dark:text-gray-400">No properties yet</p>
                    </CardBody>
                </Card>

                {/* Quick Stats */}
                <Card>
                    <CardBody className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Holding</span>
                                <span className="font-semibold">0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Renting</span>
                                <span className="font-semibold">0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Listed</span>
                                <span className="font-semibold">0</span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default ShowAllPage
